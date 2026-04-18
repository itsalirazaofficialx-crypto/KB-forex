'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Tag, ExternalLink } from "lucide-react";
import { CategoryService } from "@/services/categories";
import AdminLayout from "@/components/admin/AdminLayout";

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PRESET_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

const EMPTY_FORM = { name: "", slug: "", description: "", color: "#10b981" };

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editId,     setEditId]     = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({
      name:        cat.name || "",
      slug:        cat.slug || "",
      description: cat.description || "",
      color:       cat.color || "#10b981",
    });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await CategoryService.update(editId, form);
      } else {
        await CategoryService.create(form);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      load();
    } catch (err) {
      console.error("Failed to save category:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm("Delete this category? Posts in this category won't be affected.")) return;
    setDeleting(id);
    try {
      await CategoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto font-body">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {categories.length} categor{categories.length === 1 ? "y" : "ies"}
            </p>
          </div>
          <button onClick={openNew} className="btn-primary h-9 px-4 text-sm inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-7 animate-fade-in shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base text-foreground">{editId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        name: e.target.value,
                        slug: editId ? f.slug : slugify(e.target.value),
                      }))
                    }
                    placeholder="e.g. Forex Trading"
                    className="w-full px-4 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Slug *</label>
                  <div className="flex items-center bg-muted rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                    <span className="px-3 text-xs text-muted-foreground border-r border-border py-2.5 bg-muted/50">/category/</span>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                      placeholder="forex-trading"
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description shown on the category page"
                  className="w-full px-4 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Color</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className={`w-7 h-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-muted-foreground">{form.color}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-9 px-4 rounded-xl bg-muted text-sm font-medium hover:bg-border transition-colors text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary h-9 px-5 text-sm"
                >
                  {saving ? "Saving…" : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-14 text-center">
              <Tag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm mb-4">No categories yet. Create your first one.</p>
              <button onClick={openNew} className="btn-primary h-9 px-4 text-sm shrink-0 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-border bg-muted/30 grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Color</span>
                <span>Name</span>
                <span className="hidden md:block">Description</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-border">
                {categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color || "#10b981" }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground">{cat.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">/category/{cat.slug}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-xs hidden md:block">
                      {cat.description || <span className="italic text-muted-foreground/50">No description</span>}
                    </p>
                    <div className="flex items-center gap-1 justify-end flex-shrink-0">
                      <Link
                        href={`/category/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View category page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deleting === cat.id}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

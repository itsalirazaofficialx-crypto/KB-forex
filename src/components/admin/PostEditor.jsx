'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save, Eye, EyeOff, ArrowLeft, Upload, X, ChevronDown, ChevronUp,
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  Code, Image, Link2, Minus, CheckCircle
} from "lucide-react";
import { PostService } from "@/services/posts";
import { CategoryService } from "@/services/categories";
import { supabase } from "@/lib/supabase";

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function estimateReadingTime(html) {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function PostEditor({ id = null }) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const editorRef = useRef(null);

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    featured_image: "", category_id: "", tags: [],
    status: "draft", featured: false,
    seo_title: "", meta_description: "",
    author_name: "KB Forex", author_avatar: "",
    publish_date: new Date().toISOString().slice(0, 16),
    reading_time: 5,
  });
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoOpen, setSeoOpen]     = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading]     = useState(isEdit);

  useEffect(() => {
    (async () => {
      try {
        const cats = await CategoryService.getAll();
        setCategories(cats);
        
        if (isEdit) {
          const post = await PostService.getById(id);
          if (post) {
            setForm({
               ...post,
               publish_date: post.publish_date ? new Date(post.publish_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
               category_id: post.category_id || ""
            });
          }
        }
      } catch (err) {
        console.error("Error initializing editor:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(f => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }));
  };

  const handleSave = async (statusArg = null) => {
    const finalStatus = statusArg || form.status;
    if (!form.title.trim()) { alert("Please add a title before saving."); return; }
    setSaving(true);
    
    // Convert publish_date back to ISO
    const publishDateISO = form.publish_date ? new Date(form.publish_date).toISOString() : null;

    const data = {
      ...form,
      status: finalStatus,
      reading_time: estimateReadingTime(form.content),
      publish_date: finalStatus === "published" && !publishDateISO
        ? new Date().toISOString()
        : publishDateISO,
    };
    
    // Remove complex objects before sending
    delete data.categories;
    delete data.id;
    delete data.created_at;
    delete data.updated_at;

    try {
      if (isEdit) {
        await PostService.update(id, data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const newPost = await PostService.create(data);
        router.push("/admin/posts");
      }
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Error saving post. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      set("featured_image", publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Make sure the 'images' bucket exists and is public.");
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      set("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };
  const removeTag = (t) => set("tags", form.tags.filter(x => x !== t));

  const exec = (cmd, val) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) set("content", editorRef.current.innerHTML);
  };
  const insertHTML = (html) => {
    document.execCommand("insertHTML", false, html);
    if (editorRef.current) set("content", editorRef.current.innerHTML);
  };

  const TOOLBAR = [
    { icon: Bold,        action: () => exec("bold"),                    title: "Bold" },
    { icon: Italic,      action: () => exec("italic"),                  title: "Italic" },
    { divider: true },
    { icon: Heading2,    action: () => exec("formatBlock", "h2"),       title: "Heading 2" },
    { icon: Heading3,    action: () => exec("formatBlock", "h3"),       title: "Heading 3" },
    { divider: true },
    { icon: List,        action: () => exec("insertUnorderedList"),     title: "Bullet List" },
    { icon: ListOrdered, action: () => exec("insertOrderedList"),       title: "Numbered List" },
    { divider: true },
    { icon: Quote,       action: () => exec("formatBlock", "blockquote"), title: "Quote" },
    { icon: Code,        action: () => exec("formatBlock", "pre"),      title: "Code Block" },
    { divider: true },
    { icon: Minus,       action: () => insertHTML("<hr />"),            title: "Divider" },
    {
      icon: Link2,
      action: () => { const url = window.prompt("Enter URL:"); if (url) exec("createLink", url); },
      title: "Link"
    },
    {
      icon: Image,
      action: () => { const url = window.prompt("Image URL:"); if (url) insertHTML(`<img src="${url}" alt="" />`); },
      title: "Image"
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/posts" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {isEdit ? (form.title || "Edit Post") : "New Post"}
            </p>
            {saved && (
              <p className="text-xs text-accent flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Saved
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Preview toggle */}
          <button
            onClick={() => setPreviewMode(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              previewMode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{previewMode ? "Edit" : "Preview"}</span>
          </button>

          {/* Save draft */}
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-3.5 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-border transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>

          {/* Publish */}
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="btn-accent h-9 px-4 text-sm inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Main editor ── */}
          <div className="space-y-5 min-w-0">

            {/* Title */}
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Article title…"
              className="w-full text-3xl md:text-4xl font-heading font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/30 text-foreground resize-none"
            />

            {/* URL slug */}
            <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
              <span className="text-muted-foreground text-xs flex-shrink-0">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none text-muted-foreground"
                placeholder="url-slug"
              />
            </div>

            {/* Excerpt */}
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short excerpt — used in listings and SEO (optional but recommended)…"
              rows={2}
              className="w-full px-4 py-3 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
            />

            {/* Editor area */}
            {previewMode ? (
              <div
                className="prose-trading min-h-[400px] p-6 bg-card border border-border rounded-2xl"
                dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-muted-foreground'>Nothing to preview yet.</p>" }}
              />
            ) : (
              <div className="border border-border rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 p-2.5 border-b border-border bg-muted/40">
                  {TOOLBAR.map((item, i) =>
                    item.divider ? (
                      <div key={i} className="w-px h-5 bg-border mx-1" />
                    ) : (
                      <button
                        key={i}
                        onMouseDown={(e) => { e.preventDefault(); item.action(); }}
                        title={item.title}
                        className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>

                {/* Contenteditable area */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => {
                    if (editorRef.current) set("content", editorRef.current.innerHTML);
                  }}
                  dangerouslySetInnerHTML={{ __html: form.content }}
                  className="prose-trading min-h-[500px] p-6 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Publish settings */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-sm text-foreground">Publish Settings</h3>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Publish Date</label>
                <input
                  type="datetime-local"
                  value={form.publish_date}
                  onChange={(e) => set("publish_date", e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-foreground">Featured Post</p>
                  <p className="text-xs text-muted-foreground">Show in homepage hero</p>
                </div>
                <button
                  onClick={() => set("featured", !form.featured)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.featured ? "bg-accent" : "bg-muted-foreground/30"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${form.featured ? "left-6" : "left-1"}`} />
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-foreground">Featured Image</h3>
              {form.featured_image ? (
                <div className="relative">
                  <img src={form.featured_image} alt="" className="w-full h-36 object-cover rounded-xl" />
                  <button
                    onClick={() => set("featured_image", "")}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-accent/40 transition-all">
                  <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
                  <span className="text-xs text-muted-foreground">{uploading ? "Uploading…" : "Upload image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
              <input
                type="url"
                value={form.featured_image}
                onChange={(e) => set("featured_image", e.target.value)}
                placeholder="Or paste image URL…"
                className="w-full px-3 py-2 bg-muted rounded-xl text-xs border border-border focus:outline-none focus:ring-1 focus:ring-accent/50"
              />
            </div>

            {/* Post Details */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-sm text-foreground">Post Details</h3>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Author Name</label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={(e) => set("author_name", e.target.value)}
                  className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Author Avatar URL</label>
                <input
                  type="url"
                  value={form.author_avatar}
                  onChange={(e) => set("author_avatar", e.target.value)}
                  placeholder="https://…"
                  className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Tags</label>
                {Array.isArray(form.tags) && form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 tag-badge bg-muted text-muted-foreground text-[10px]">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-foreground">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Type tag + Enter"
                    className="flex-1 px-3 py-2 bg-muted rounded-xl text-xs border border-border focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 bg-accent text-accent-foreground rounded-xl text-xs font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setSeoOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                SEO Settings
                {seoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {seoOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">SEO Title</label>
                    <input
                      type="text"
                      value={form.seo_title}
                      onChange={(e) => set("seo_title", e.target.value)}
                      placeholder={form.title || "SEO title…"}
                      className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <p className={`text-xs mt-1 ${(form.seo_title || form.title || "").length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                      {(form.seo_title || form.title || "").length}/60
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Meta Description</label>
                    <textarea
                      value={form.meta_description}
                      onChange={(e) => set("meta_description", e.target.value)}
                      placeholder={form.excerpt || "Meta description…"}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                    />
                    <p className={`text-xs mt-1 ${(form.meta_description || "").length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                      {(form.meta_description || "").length}/160
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

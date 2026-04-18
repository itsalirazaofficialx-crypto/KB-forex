'use client';

import { useState, useEffect } from "react";
import { Mail, Calendar, Download, Search, CheckCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { NewsletterService } from "@/services/newsletter";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminNewsletters() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await NewsletterService.getAll();
      setSubscribers(data);
    } catch (err) {
      console.error("Failed to load subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["Email", "Subscribed At"];
    const rows = filtered.map(s => [s.email, s.created_at]);
    const content = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kbforex-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto font-body">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Newsletter Subscribers</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage your audience and export contacts.</p>
          </div>
          <button 
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="btn-outline h-10 px-4 text-sm inline-flex items-center gap-2 flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-semibold text-foreground">Total Audience</p>
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{subscribers.length}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-foreground">Active Members</p>
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{subscribers.filter(s => s.subscribed).length}</p>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground"
          />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Mail className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No subscribers found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subscribed Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{s.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {s.created_at ? format(new Date(s.created_at), "MMM d, yyyy") : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.subscribed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {s.subscribed ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect } from "react";
import { UserPlus, Shield, Mail, Trash2, Loader2, Users } from "lucide-react";
import { inviteAdmin, getAdminUsers, deleteAdminUser } from "@/lib/admin-actions";
import AdminLayout from "@/components/admin/AdminLayout";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";

export default function ManageUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState(null);
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const loadAdmins = async () => {
    setLoading(true);
    const data = await getAdminUsers();
    setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setMessage(null);

    const fData = new FormData();
    fData.append('email', formData.email);
    fData.append('password', formData.password);

    const result = await inviteAdmin(fData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Admin account created successfully!' });
      setFormData({ email: '', password: '' });
      loadAdmins();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create admin' });
    }
    setInviting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this admin? they will lose all access immediately.")) return;
    
    const result = await deleteAdminUser(id);
    if (result.success) {
      loadAdmins();
    } else {
      alert(result.error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage administrators who can access this dashboard.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invite Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-bold text-foreground">Invite New Admin</h2>
              </div>

              {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-2 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  <p>{message.text}</p>
                </div>
              )}

              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="field-input text-sm"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Set Initial Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="field-input text-sm"
                    placeholder="••••••••"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5">New admin can change this via "Forgot Password".</p>
                </div>
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full btn-primary h-11 flex items-center justify-center gap-2 mt-2"
                >
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </form>
            </div>
          </div>

          {/* Admin List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  Active Administrators
                </h3>
              </div>

              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : admins.length === 0 ? (
                <div className="py-20 text-center">
                   <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="text-muted-foreground text-sm">No administrators found.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {admins.map((admin) => (
                    <div key={admin.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {admin.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {admin.email}
                            {admin.id === currentUser?.id && (
                              <span className="bg-accent/10 text-accent text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold">You</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Added on {admin.created_at ? format(new Date(admin.created_at), "MMM d, yyyy") : "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      {admin.id !== currentUser?.id && (
                        <button 
                          onClick={() => handleDelete(admin.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors md:opacity-0 group-hover:opacity-100"
                          title="Remove access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

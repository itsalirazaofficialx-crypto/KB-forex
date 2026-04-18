'use client';

import PostEditor from "@/components/admin/PostEditor";
import AdminLayout from "@/components/admin/AdminLayout";

export default function NewPostPage() {
  return (
    <AdminLayout>
      <PostEditor />
    </AdminLayout>
  );
}

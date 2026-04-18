'use client';

import PostEditor from "@/components/admin/PostEditor";
import AdminLayout from "@/components/admin/AdminLayout";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams();
  
  return (
    <AdminLayout>
      <PostEditor id={id} />
    </AdminLayout>
  );
}

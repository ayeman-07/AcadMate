import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateProfessorForm from "@/components/admin/CreateProfessorForm";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function CreateProfessorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <AdminLayout>
      <CreateProfessorForm />
    </AdminLayout>
  );
} 
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CreateExamForm from "@/components/exams/CreateExamForm";

export default async function AdminCreateExamPage() {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/auth/signin");
  // }

  return (
    
      <CreateExamForm />
    
  );
} 
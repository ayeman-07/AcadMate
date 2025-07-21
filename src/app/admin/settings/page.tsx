import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Admin from "@/models/admin/admin.model";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

interface AdminInfo {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  isActive: boolean;
}

const getAdmin = async (): Promise<AdminInfo | string> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return "Unauthorized";

  try {
    await connectToDB();
    const adminDoc = await Admin.findById(session.user.id).lean().exec();
    if (!adminDoc || Array.isArray(adminDoc)) return "Admin not found";

    return {
      _id: adminDoc._id?.toString?.() ?? "",
      name: adminDoc.name,
      email: adminDoc.email,
      avatar: adminDoc.avatar,
      phoneNumber: adminDoc.phoneNumber,
      isActive: adminDoc.isActive,
    };
  } catch (error) {
    console.error("DB error:", error);
    return "Failed to fetch admin";
  }
};

// ✅ Server Action
async function updateAdminProfile(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return redirect("/unauthorized");

  const name = formData.get("name")?.toString();
  const phoneNumber = formData.get("phoneNumber")?.toString();
  const password = formData.get("password")?.toString();

  if (!name) return;

  await connectToDB();

  const updateFields: any = { name, phoneNumber };
  if (password && password.trim() !== "") {
    updateFields.password = await bcrypt.hash(password, 10);
  }

  await Admin.findByIdAndUpdate(session.user.id, updateFields);

  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

export default async function AdminDetailPage() {
  const result = await getAdmin();

  if (!result || typeof result === "string") {
    if (result === "Unauthorized")
      return new Response("Unauthorized", { status: 401 });
    return notFound();
  }

  const admin = result;

  return (
    <div className="max-w-3xl mx-auto p-6 text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <form
        action={updateAdminProfile}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800"
      >
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Name</label>
          <input
            name="name"
            defaultValue={admin.name}
            className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 block mb-1">Email</label>
          <input
            value={admin.email}
            disabled
            className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 block mb-1">
            Phone Number
          </label>
          <input
            name="phoneNumber"
            defaultValue={admin.phoneNumber ?? ""}
            className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-zinc-100"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 block mb-1">
            New Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Leave empty to keep current"
            className="w-full bg-zinc-800 border border-zinc-700 px-3 py-2 rounded text-zinc-100"
          />
        </div>

        <div>
          <p className="text-sm text-zinc-400">Status</p>
          <p className="font-medium">
            {admin.isActive ? "Active ✅" : "Inactive ❌"}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">User ID</p>
          <p className="font-mono text-xs text-zinc-300 break-words">
            {admin._id}
          </p>
        </div>

        <div className="sm:col-span-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

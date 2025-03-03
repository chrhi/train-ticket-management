import { SigninForm } from "@/components/forms/signin.form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <SigninForm />
    </div>
  );
}

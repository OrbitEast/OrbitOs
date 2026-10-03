import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AppHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-zinc-500">OrbitOS</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your business workspace</h1>
        <p className="mt-3 text-zinc-600">Authentication is connected. Business onboarding is the next foundation layer.</p>
      </div>
    </main>
  );
}

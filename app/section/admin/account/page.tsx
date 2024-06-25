import { createSessionClient, getLoggedInUser } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import BookManager from "@/components/admin/bookManager";

async function signOut() {
  "use server";

  const { account } = await createSessionClient();

  cookies().delete("my-custom-session");
  await account.deleteSession("current");

  redirect("/");
}

export default async function HomePage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/section/admin/login");

  return (
    <div className="flex w-full flex-col gap-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="text-5xl font-semibold uppercase text-primary">
          Ciao {user.name}
        </div>
        <form action={signOut}>
          <Button
            className="border-2 border-primary bg-background text-primary"
            type="submit"
          >
            Sign out
          </Button>
        </form>
      </div>
      <BookManager />
    </div>
  );
}

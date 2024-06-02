import {
    createSessionClient,
    getLoggedInUser,
} from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

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
        <div className="flex md:items-center md:flex-row gap-4 flex-col">
            <div className="text-5xl uppercase text-primary font-semibold">Ciao {user.name}</div>
            <form action={signOut}>
                <Button type="submit">Sign out</Button>
            </form>
        </div>
    );
}
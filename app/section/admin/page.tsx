import { getLoggedInUser } from "@/lib/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getLoggedInUser();

    if (!user) redirect("/section/admin/login");

    redirect("/section/admin/account");
}
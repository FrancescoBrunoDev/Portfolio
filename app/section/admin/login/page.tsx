// src/app/signup/page.jsx

import { getLoggedInUser, createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, KeyRound } from "lucide-react";

async function logIn(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession(email, password);

  cookies().set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/section/admin/account");
}

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/section/admin/account");

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form action={logIn} className="flex flex-col w-72 gap-4 text-primary">
        <div className="flex h-8 w-full items-center gap-1  bg-transparent">
          <User strokeWidth={2.75} className="h-full w-fit text-primary" />
          <span className="text-2xl">/</span>
          <input
            className="h-full w-full border-b-[3px] border-primary bg-transparent px-1 font-semibold placeholder:invisible focus:outline-none"
            id="email"
            name="email"
            placeholder="Email"
            type="email"
          />
        </div>

        <div className="flex h-8 w-full items-center gap-1  bg-transparent">
          <KeyRound strokeWidth={2.75} className="h-full w-fit text-primary" />
          <span className="text-2xl">/</span>
          <input
            className="h-full w-full border-b-[3px] border-primary bg-transparent px-1 font-semibold placeholder:invisible focus:outline-none"
            id="password"
            name="password"
            placeholder="Password"
            minLength={8}
            type="password"
          />
        </div>
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
}


// src/app/signup/page.jsx

import { getLoggedInUser, createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function logIn(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

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
      <form action={logIn} className="flex flex-col gap-2">
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
        />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}


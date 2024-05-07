"use client"

import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@mui/material";

export default function LoginPage() {
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <div className="flex items-center justify-center">
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex gap-4 justify-center text-primary"
          variant="outlined"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          Login with google
        </Button>
      </div>
    </section>
  );
}

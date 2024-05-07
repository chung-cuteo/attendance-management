"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Button } from "@mui/material";

type Status = "idle" | "loading" | "success" | "error";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [createStatus, setCreateStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const handleFormSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setCreateStatus("loading");

    if (!email || !password || !name) {
      setError('Name, Email and Password are required')
      throw Error("Name, Email and Password are required");
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setCreateStatus("success");
      setEmail("");
      setPassword("");
      router.push("/login");
    } else {
      setCreateStatus("error");
    }
  };

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Register</h1>
      {createStatus === "error" && (
        <div className="my-4 text-center">
          An error has occurred.
          <br />
          Please try again later
        </div>
      )}
      {error && (
        <p className="text-rose-600 text-center">{error}</p>
      )}

      <form className="flex flex-col max-w-[500px] mx-auto" onSubmit={handleFormSubmit}>
        <FormControl variant="standard">
          <InputLabel htmlFor="name" className="text-lg">Name</InputLabel>
          <Input id="name" placeholder="Name" value={name}
            onChange={(event) => {
              setError('')
              setName(event.target.value)
            }
            } />
        </FormControl>
        <FormControl variant="standard" className="mt-4">
          <InputLabel htmlFor="email" className="text-lg">Email</InputLabel>
          <Input id="email" placeholder="Email" value={email}
            onChange={(event) => {
              setError('')
              setEmail(event.target.value)
            }} />
        </FormControl>
        <FormControl variant="standard" className="mt-4">
          <InputLabel htmlFor="password" className="text-lg">Password</InputLabel>
          <Input id="password" placeholder="Password" value={password}
            onChange={(event) => {
              setError('')
              setPassword(event.target.value)
            }} />
        </FormControl>
        <Button variant="contained" type="submit" className="mt-6">Register</Button>

        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Existing account?{" "}
          <Link className="underline text-primary" href={"/login"}>
            Login here &raquo;
          </Link>
        </div>
      </form>
    </section>
  );
}

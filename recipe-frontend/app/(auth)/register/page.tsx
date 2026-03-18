"use client";
import { useState } from "react";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

import AuthStyles from '@/app/styles/pages/auth.module.css';
import ButtonStyles from '@/app/styles/components/button.module.css';
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const auth = useContext(AuthContext);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await registerUser(form);

      auth?.login(res.user, res.token);

      router.push("/register/preferences");
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Something went wrong");
        }
    }
  }

  return (
    <div className={AuthStyles.page}>
      <Image className={AuthStyles.image} src={'/ingredients2.jpg'} alt="Ingredients" height={640} width={400} />
      <div className={AuthStyles.main}>
          <h1 className={AuthStyles.title}>Welcome to Mealio</h1>
          <h2 className={AuthStyles.subtitle}>Create an account</h2>

          <form className={AuthStyles.form} onSubmit={handleSubmit}>

            <div className={AuthStyles.inputs}>
              <label className={AuthStyles.label} htmlFor="username">
                Username
                <input
                  className={AuthStyles.input}
                  required
                  placeholder="Username"
                  id="username"
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </label>
              
              <label className={AuthStyles.label} htmlFor="email">
                Email
                <input
                  className={AuthStyles.input}
                  type="email"
                  placeholder="Email"
                  id="email"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </label>

              <label className={AuthStyles.label} htmlFor="password">
                Password
                <input
                  className={AuthStyles.input}
                  placeholder="Password"
                  type="password"
                  id="password"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </label>
            </div>

            <button className={ButtonStyles.button} type="submit">Register</button>
          </form>

        {error && <p className={AuthStyles.error}>{error}</p>}

        <p className={AuthStyles.text}>Already an account? <Link className={AuthStyles.link} href={'/login'}>Log in</Link></p>

        <Link className={AuthStyles.link} href={'/'}>Continue as a Guest</Link>
      </div>
    </div>
  );
}

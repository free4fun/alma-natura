"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setStatus("success");
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm gap-4 sm:max-w-2xl sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div className="grid gap-2">
        <label htmlFor="newsletter-email" className="text-sm text-text/70">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className="w-full rounded-2xl border border-text/20 bg-background/80 px-4 py-3 focus-visible:border-accent1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent1/30"
        />
      </div>
      <div className="sm:pt-6">
        <Button type="submit" className="w-full sm:w-auto">
          Suscribirme
        </Button>
      </div>
      {status === "success" ? (
        <p className="text-sm text-accent1 sm:col-span-2">
          Listo. Te vamos a escribir pronto.
        </p>
      ) : null}
    </form>
  );
}

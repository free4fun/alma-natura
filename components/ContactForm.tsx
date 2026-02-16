"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { allowedFormats, type AllowedFormat } from "@/lib/validation";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    formato: "No estoy seguro",
    mensaje: "",
    company: "",
  });

  useEffect(() => {
    const experienciaParam =
      searchParams.get("experiencia") || searchParams.get("formato");
    if (experienciaParam && allowedFormats.includes(experienciaParam as AllowedFormat)) {
      setForm((prev) => ({
        ...prev,
        formato: experienciaParam as AllowedFormat,
      }));
    }
  }, [searchParams]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setError(data?.error || "No se pudo enviar el mensaje.");
        return;
      }

      setStatus("success");
      setForm({
        nombre: "",
        email: "",
        formato: "No estoy seguro",
        mensaje: "",
        company: "",
      });
    } catch (err) {
      setStatus("error");
      setError("Hubo un problema al enviar el mensaje.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl mx-auto">
      <div className="grid gap-2">
        <label htmlFor="nombre" className="text-sm text-text/70">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          minLength={2}
          maxLength={80}
          value={form.nombre}
          onChange={handleChange}
          className="rounded-2xl border border-text/20 bg-background/80 px-4 py-3 focus-visible:border-accent1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent1/30"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm text-text/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="rounded-2xl border border-text/20 bg-background/80 px-4 py-3 focus-visible:border-accent1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent1/30"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="formato" className="text-sm text-text/70">
          Experiencia de interés
        </label>
        <select
          id="formato"
          name="formato"
          value={form.formato}
          onChange={handleChange}
          className="rounded-2xl border border-text/20 bg-background/80 px-4 py-3 focus-visible:border-accent1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent1/30"
        >
          {allowedFormats.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="mensaje" className="text-sm text-text/70">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={form.mensaje}
          onChange={handleChange}
          className="rounded-2xl border border-text/20 bg-background/80 px-4 py-3 focus-visible:border-accent1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent1/30"
        />
      </div>

      <div className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          value={form.company}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Enviando..." : "Enviar consulta"}
        </Button>
        <p className="text-sm text-text/60">Canal principal: formulario/email.</p>
      </div>

      <div aria-live="polite" className="text-sm">
        {status === "success" ? (
          <p className="text-accent1">Mensaje enviado. Gracias por escribir.</p>
        ) : null}
        {status === "error" ? (
          <p className="text-red-700">{error}</p>
        ) : null}
      </div>
    </form>
  );
}

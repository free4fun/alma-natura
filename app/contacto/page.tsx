import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribí tu consulta. Respondemos en 24–48h con propuestas posibles.",
  openGraph: {
    title: "Contacto",
    description:
      "Escribí tu consulta. Respondemos en 24–48h con propuestas posibles.",
    url: "/contacto",
  },
};

export default function ContactoPage() {
  return (
    <div>
      <Section
        title="Contacto"
        subtitle="Escribí tu consulta y recibí respuesta en 24–48h con propuestas posibles."
      >
        <ContactForm />
        <p className="mt-6 text-sm text-text/70">
          <Icon name="mail" className="mr-2 inline h-4 w-4 text-accent1" />
          También podés escribir a{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-semibold text-text hover:text-accent1 transition-colors"
          >
            {contactEmail}
          </a>
          .
        </p>
        <p className="mt-3 text-sm text-text/70">
          <Icon name="pin" className="mr-2 inline h-4 w-4 text-accent1" />
          Las Toscas, Uruguay.
        </p>
      </Section>
    </div>
  );
}

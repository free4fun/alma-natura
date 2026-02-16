import type { Metadata } from "next";
import Button from "@/components/Button";
import Callout from "@/components/Callout";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import {
  centralPhrase,
  definitionText1,
  definitionText2,
  expectations,
  principles,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Qué es Alma Natura, cómo funciona y el marco que sostiene cada experiencia.",
  openGraph: {
    title: "Acerca de",
    description:
      "Qué es Alma Natura, cómo funciona y el marco que sostiene cada experiencia.",
    url: "/acerca-de",
  },
};

const steps = [
  {
    title: "Elegir experiencia",
    detail:
      "Seleccionás la experiencia que mejor se adapta a tu momento y disponibilidad.",
    icon: "compass" as const,
  },
  {
    title: "Escribir consulta (Opcional)",
    detail:
      "Compartís tu interés o pregunta en el formulario de contacto.",
    icon: "message" as const,
  },
  {
    title: "Coordinación",
    detail:
      "Recibís una respuesta con posibles caminos y acordamos tiempos.",
    icon: "handshake" as const,
  },
  {
    title: "Experiencia",
    detail:
      "Participás de la práctica en un marco simple, cuidado y no dirigido.",
    icon: "route" as const,
  },
];

const principleIcons = {
  Claridad: "focus",
  "Autonomía personal": "balance",
  "Experiencia directa": "care",
} as const;

export default function AcercaDePage() {
  return (
    <div>
      <Section title="Acerca de Alma Natura" subtitle={centralPhrase}>
        <div className="space-y-6 text-text/80 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img src="/images/acerca-hero.jpg" alt="Alma Natura" className="rounded-2xl w-full max-w-md object-cover border border-text/10" />
            <p>{definitionText1}</p>
          </div>
          <p>{definitionText2}</p>
        </div>
      </Section>

      <Section
        title="Cómo funciona"
        subtitle="Un proceso claro y directo. La experiencia se construye paso a paso."
      >
        <ol className="grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-accent2/30 bg-accent2/10 p-6"
            >
              <p className="text-sm text-accent1">Paso {index + 1}</p>
              <h3 className="mt-3 flex items-center gap-2 text-xl font-semibold">
                <Icon name={step.icon} className="h-5 w-5 text-accent1" />
                {step.title}
              </h3>
              <p className="mt-3 text-text/80">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Sección 'Qué no es' eliminada */}

      <Section title="Principios">
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-accent2/30 bg-accent2/10 p-6"
            >
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Icon
                  name={principleIcons[item.title as keyof typeof principleIcons] ?? "focus"}
                  className="h-5 w-5 text-accent2"
                />
                {item.title}
              </h3>
              <p className="mt-3 text-text/80">{item.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Un espacio para explorar">
        <div className="rounded-2xl border border-accent2/30 bg-accent2/10 p-6 flex flex-col md:flex-row gap-6 items-center">
          <img src="/images/acerca-publico.jpg" alt="Personas en práctica" className="rounded-2xl w-full max-w-xs object-cover border border-text/10" />
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Icon name="user-check" className="h-5 w-5 text-accent1" />
              Un espacio para explorar
            </h3>
            <p className="mt-4 text-text/80">
              Alma Natura invita a quienes sienten curiosidad por el bienestar y la claridad interior, y prefieren descubrir por sí mismos, sin fórmulas ni intermediarios. Aquí, la práctica es simple y honesta, pensada para quienes valoran la autonomía y el aprendizaje vivencial. Si te atrae la experiencia directa y el crecimiento personal desde lo cotidiano, este lugar te acompaña en ese recorrido.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Qué esperar">
        <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
          <img
            src="/images/acerca-expectativas.jpg"
            alt="Práctica y bienestar"
            className="rounded-2xl w-full max-w-xs object-cover border border-accent2/30 md:basis-1/4 md:flex-shrink-0"
          />
          <div className="w-full md:basis-3/4">
            <Callout>
              <ul className="space-y-3">
                {expectations.yes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Callout>
          </div>
        </div>
      </Section>

      <Section
        title="Iniciá la consulta"
        subtitle="Activá el primer paso y recibí respuesta en menos de 24hs."
      >
        <Button href="/contacto">Contactar</Button>
      </Section>
    </div>
  );
}
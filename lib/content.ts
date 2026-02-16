export const centralPhrase =
  "Prácticas basadas en la naturaleza para la introspección personal. Un espacio para explorar, reflexionar y habitar el mundo interior con prácticas simples y cercanas.";

export const definitionText1 =
  "Alma Natura propone experiencias de observación y reflexión, crea condiciones para encontrarse consigo mismo y habilita procesos de transformación personal entendidos como cambios en la percepción, la comprensión o la forma de relacionarse consigo mismo y con el entorno.";

export const definitionText2 =
  "Trabaja desde la experiencia directa, con prácticas simples, repetibles y accesibles, y sostiene un encuadre claro y cuidado. La transformación no es impuesta ni dirigida; cada persona define el sentido y el alcance de su propio proceso.";

export const shortDefinition =
  "Alma Natura propone prácticas simples y accesibles para la introspección. Ofrece un marco sobrio y no dirigido para explorar preguntas, observar la propia experiencia y habilitar procesos de transformación personal.";

export const shortDisclaimer =
  "Alma Natura no reemplaza atención profesional ni garantiza resultados.";

export const formatSummaries = [
  {
    title: "Charlas",
    slug: "charlas",
    summary:
      "Impulsan conversaciones claras, activan nuevas perspectivas y ordenan ideas en poco tiempo.",
    highlights: ["60–90 min", "Presencial o virtual", "Ideal para grupos amplios"],
    icon: "talk" as const,
    checkoutUrl: "/checkout/charlas",
  },
  {
    title: "Talleres",
    slug: "talleres",
    summary:
      "Activan la práctica con ejercicios guiados, registro y una dinámica concreta.",
    highlights: ["2–3 h", "Trabajo en equipo", "Material de apoyo"],
    icon: "workshop" as const,
    checkoutUrl: "/checkout/talleres",
  },
  {
    title: "Sesiones 1 a 1",
    slug: "sesiones-1-a-1",
    summary:
      "Ordenan tu proceso con foco total, ritmo propio y seguimiento directo.",
    highlights: ["60–90 min", "Modalidad individual", "Plan personalizado"],
    icon: "one" as const,
    checkoutUrl: "/checkout/sesiones-1-a-1",
  },
  {
    title: "Sesiones Grupales",
    slug: "sesiones-grupales",
    summary:
      "Sostienen continuidad en grupos pequeños con prácticas compartidas.",
    highlights: ["90–120 min", "Grupos reducidos", "Ritmo semanal"],
    icon: "people" as const,
    checkoutUrl: "/checkout/sesiones-grupales",
  },
];

export const formatPages = {
  charlas: {
    title: "Charlas",
    intro:
      "Lanzan una conversación directa y ordenada. Funcionan para abrir mirada y activar un nuevo enfoque.",
    details:
      "Una experiencia breve y clara para ordenar ideas y abrir perspectiva. Incluye un marco simple, una dinámica guiada y un cierre con síntesis. Se trabaja con ejemplos concretos, preguntas ordenadas y un espacio de intercambio para alinear foco y lenguaje común. Ideal para equipos, comunidades o espacios educativos que necesitan destrabar conversaciones y definir próximos pasos sin sobrecargar el proceso.",
    bullets: [
      "Duración: 60–90 min",
      "Presencial o virtual",
      "Ideal para comunidades y equipos",
    ],
    checkoutUrl: "/checkout/charlas",
    outcomes: [
      "Ideas claras para seguir trabajando",
      "Puntos de acción concretos",
      "Un cierre con síntesis compartida",
    ],
    images: [
      { src: "/images/formats/charlas-1.svg", alt: "Charla con mapa de ideas" },
      { src: "/images/formats/charlas-2.svg", alt: "Dinámica de conversación" },
      { src: "/images/formats/charlas-3.svg", alt: "Cierre guiado" },
      { src: "/images/formats/charlas-4.svg", alt: "Aterrizaje práctico" },
    ],
  },
  talleres: {
    title: "Talleres",
    intro:
      "Profundizan la práctica con ejercicios concretos y registro. Ordenan aprendizaje y avance real.",
    details:
      "Un formato práctico con ejercicios guiados, pausas de registro y momentos de síntesis. Se trabaja en bloques para sostener foco y profundidad, combinando explicación breve, práctica directa y reflexión final. Incluye material de apoyo y propuestas para continuar el trabajo después del taller con claridad y continuidad.",
    bullets: [
      "Duración: 2–3 h",
      "Material de apoyo",
      "Trabajo con dinámica guiada",
    ],
    checkoutUrl: "/checkout/talleres",
    outcomes: [
      "Prácticas aplicables al día a día",
      "Registro personal claro",
      "Cierre con próximos pasos",
    ],
    images: [
      { src: "/images/formats/talleres-1.svg", alt: "Bitácora de trabajo" },
      { src: "/images/formats/talleres-2.svg", alt: "Práctica guiada" },
      { src: "/images/formats/talleres-3.svg", alt: "Reflexión final" },
      { src: "/images/formats/talleres-4.svg", alt: "Elementos simples" },
    ],
  },
  "sesiones-1-a-1": {
    title: "Sesiones 1 a 1",
    intro:
      "Ordenan tu proceso con foco total. Definen prioridades y sostienen un ritmo claro.",
    details:
      "Espacio individual con acompañamiento directo. Se define un foco claro, se establecen prioridades y se construye un plan de acción simple. La sesión combina observación, práctica breve y acuerdos concretos. Se cierra con un registro claro de objetivos, pasos y ritmo sugerido para sostener continuidad.",
    bullets: [
      "Duración: 60–90 min",
      "Modalidad individual",
      "Seguimiento directo",
    ],
    checkoutUrl: "/checkout/sesiones-1-a-1",
    outcomes: [
      "Foco en lo esencial",
      "Plan de trabajo personal",
      "Siguiente paso definido",
    ],
    images: [
      { src: "/images/formats/sesiones-1a1-1.svg", alt: "Mapa personal" },
      { src: "/images/formats/sesiones-1a1-2.svg", alt: "Ritmo propio" },
      { src: "/images/formats/sesiones-1a1-3.svg", alt: "Registro claro" },
      { src: "/images/formats/sesiones-1a1-4.svg", alt: "Seguimiento" },
    ],
  },
  "sesiones-grupales": {
    title: "Sesiones Grupales",
    intro:
      "Sostienen continuidad con práctica compartida. Generan compromiso y avance real.",
    details:
      "Encuentros regulares para sostener ritmo y motivación. Se trabajan temas comunes, se comparten prácticas y se acuerdan pasos simples entre sesiones. El grupo aporta claridad, apoyo y continuidad en el proceso, con un marco claro y dinámicas que facilitan el compromiso.",
    bullets: [
      "Duración: 90–120 min",
      "Grupos pequeños",
      "Ritmo semanal o quincenal",
    ],
    checkoutUrl: "/checkout/sesiones-grupales",
    outcomes: [
      "Continuidad sostenida",
      "Aprendizaje colectivo",
      "Plan común con acuerdos claros",
    ],
    images: [
      { src: "/images/formats/grupales-1.svg", alt: "Ronda inicial" },
      { src: "/images/formats/grupales-2.svg", alt: "Práctica compartida" },
      { src: "/images/formats/grupales-3.svg", alt: "Registro grupal" },
      { src: "/images/formats/grupales-4.svg", alt: "Cierre común" },
    ],
  },
};

export const toolsCategories = [
  {
    title: "Gemas semipreciosas",
    description: "Elegí gemas para acompañar tu práctica diaria.",
    items: [
      {
        slug: "gema-amatista",
        name: "Amatista",
        price: 32,
        description: "Gema de calma y claridad para prácticas de foco.",
        image: "/images/tools/gema-amatista.svg",
      },
      {
        slug: "gema-cuarzo-rosa",
        name: "Cuarzo rosa",
        price: 30,
        description: "Gema suave para rituales de autocuidado.",
        image: "/images/tools/gema-cuarzo-rosa.svg",
      },
      {
        slug: "gema-obsidiana",
        name: "Obsidiana",
        price: 34,
        description: "Gema de profundidad para trabajo interno.",
        image: "/images/tools/gema-obsidiana.svg",
      },
      {
        slug: "gema-citrino",
        name: "Citrino",
        price: 31,
        description: "Gema de energía para intención y enfoque.",
        image: "/images/tools/gema-citrino.svg",
      },
      {
        slug: "gema-cuarzo-ahumado",
        name: "Cuarzo ahumado",
        price: 33,
        description: "Gema para enraizar y soltar tensión.",
        image: "/images/tools/gema-cuarzo-ahumado.svg",
      },
      {
        slug: "gema-lapislazuli",
        name: "Lapislázuli",
        price: 36,
        description: "Gema de claridad mental y expresión.",
        image: "/images/tools/gema-lapislazuli.svg",
      },
    ],
  },
  {
    title: "Flautas nativas artesanales",
    description: "Instrumentos hechos a mano con materiales naturales.",
    items: [
      {
        slug: "flauta-andina",
        name: "Flauta andina",
        price: 95,
        description: "Tono cálido y suave. Ideal para apertura de prácticas.",
        image: "/images/tools/flauta-andina.svg",
      },
      {
        slug: "flauta-bambu",
        name: "Flauta de bambú",
        price: 88,
        description: "Sonido claro y liviano para respiración consciente.",
        image: "/images/tools/flauta-bambu.svg",
      },
      {
        slug: "flauta-cedro",
        name: "Flauta de cedro",
        price: 102,
        description: "Tono profundo para apertura y cierre de prácticas.",
        image: "/images/tools/flauta-cedro.svg",
      },
      {
        slug: "flauta-ocarina",
        name: "Flauta ocarina",
        price: 78,
        description: "Formato pequeño para práctica íntima y suave.",
        image: "/images/tools/flauta-ocarina.svg",
      },
    ],
  },
  {
    title: "Bolsitas medicinales",
    description: "Bolsitas con hierbas seleccionadas y aroma natural.",
    items: [
      {
        slug: "bolsita-limpieza",
        name: "Bolsita limpieza",
        price: 18,
        description: "Hierbas para limpieza y renovación del espacio.",
        image: "/images/tools/bolsita-limpieza.svg",
      },
      {
        slug: "bolsita-descanso",
        name: "Bolsita descanso",
        price: 18,
        description: "Hierbas para descanso profundo y calma.",
        image: "/images/tools/bolsita-descanso.svg",
      },
      {
        slug: "bolsita-claridad",
        name: "Bolsita claridad",
        price: 18,
        description: "Hierbas para despejar la mente y ordenar.",
        image: "/images/tools/bolsita-claridad.svg",
      },
      {
        slug: "bolsita-proteccion",
        name: "Bolsita protección",
        price: 20,
        description: "Mezcla para sostén y resguardo energético.",
        image: "/images/tools/bolsita-proteccion.svg",
      },
    ],
  },
  {
    title: "Elementos de apoyo",
    description: "Objetos simples para sostener ritmo y presencia.",
    items: [
      {
        slug: "cuenco-ceramico",
        name: "Cuenco cerámico",
        price: 26,
        description: "Soporte estable para rituales y prácticas simples.",
        image: "/images/tools/cuenco-ceramico.svg",
      },
      {
        slug: "sahumador",
        name: "Sahumador minimal",
        price: 24,
        description: "Elemento para humo suave y ambiente cuidado.",
        image: "/images/tools/sahumador.svg",
      },
      {
        slug: "campana-bronce",
        name: "Campana de bronce",
        price: 28,
        description: "Sonido breve para marcar inicio y cierre.",
        image: "/images/tools/campana-bronce.svg",
      },
      {
        slug: "vela-soja",
        name: "Vela de soja",
        price: 16,
        description: "Vela natural para ritmo y presencia.",
        image: "/images/tools/vela-soja.svg",
      },
      {
        slug: "manta-meditacion",
        name: "Manta de meditación",
        price: 42,
        description: "Textil suave para sostener la postura.",
        image: "/images/tools/manta-meditacion.svg",
      },
    ],
  },
];

export const audience = {
  for: [
    "Personas con interés en la introspección y la observación de su experiencia.",
    "Quienes buscan prácticas simples, repetibles y accesibles.",
    "Personas que valoran un marco simple y no dirigido.",
  ],
};

export const principles = [
  {
    title: "Claridad",
    detail:
      "El encuadre es claro y cuidado. La práctica es una propuesta, no una imposición.",
  },
  {
    title: "Autonomía personal",
    detail:
      "Cada persona define el sentido y el alcance de su proceso; no hay objetivos internos obligatorios.",
  },
  {
    title: "Experiencia directa",
    detail:
      "Se trabaja desde prácticas simples y observables, con espacio para reflexión y comprensión emergente.",
  },
];

export const expectations = {
  yes: [
    "Un espacio de escucha y observación que puede abrir nuevas preguntas.",
    "Prácticas simples para explorar tu experiencia con calma.",
    "Un proceso no dirigido donde el sentido puede emerger con el tiempo.",
  ],
};

export const downloads = [
  {
    slug: "guia-observacion",
    title: "Guía de observación cotidiana (PDF)",
    description:
      "Una guía breve para entrenar la mirada y sostener prácticas simples en el día a día.",
    details:
      "Incluye ejercicios simples, preguntas de autoobservación y una pauta semanal para sostener continuidad.",
    highlights: ["PDF imprimible", "Ejercicios breves", "Uso cotidiano"],
    showOnHome: true,
    access: "Gratis",
    fileUrl: "/descargables/guia-observacion.pdf",
  },
  {
    slug: "cuaderno-practicas",
    title: "Cuaderno de prácticas Alma Natura (PDF)",
    description:
      "Hojas de trabajo y espacios para registrar procesos personales con calma.",
    details:
      "Formato imprimible con secciones guiadas para registrar avances, emociones y aprendizajes.",
    highlights: ["Formato A4", "Secciones guiadas", "Registro personal"],
    showOnHome: false,
    access: "Pago",
    fileUrl: "",
  },
  {
    slug: "mapa-preguntas",
    title: "Mapa de preguntas esenciales (PDF)",
    description:
      "Un conjunto de preguntas abiertas para explorar tu experiencia.",
    details:
      "Preguntas agrupadas por temas para ampliar la reflexión y abrir nuevas perspectivas.",
    highlights: ["Preguntas guiadas", "Reflexión profunda", "Uso flexible"],
    showOnHome: true,
    access: "Gratis",
    fileUrl: "/descargables/mapa-preguntas.pdf",
  },
  {
    slug: "bitacora-temporada",
    title: "Bitácora de temporada (PDF)",
    description:
      "Plantillas para acompañar ciclos y sostener continuidad.",
    details:
      "Incluye un esquema mensual, ejercicios de cierre y una guía breve para revisar procesos.",
    highlights: ["Plan mensual", "Ejercicios de cierre", "Seguimiento"],
    showOnHome: false,
    access: "Pago",
    fileUrl: "",
  },
];

export const checkoutCatalog = {
  charlas: {
    title: "Charlas",
    description: "Experiencia grupal con foco y síntesis.",
    price: 120,
    image: "/images/formats/charlas-1.svg",
  },
  talleres: {
    title: "Talleres",
    description: "Experiencia práctica con material de apoyo.",
    price: 180,
    image: "/images/formats/talleres-1.svg",
  },
  "sesiones-1-a-1": {
    title: "Sesiones 1 a 1",
    description: "Experiencia personalizada con seguimiento directo.",
    price: 200,
    image: "/images/formats/sesiones-1a1-1.svg",
  },
  "sesiones-grupales": {
    title: "Sesiones Grupales",
    description: "Experiencia compartida con continuidad.",
    price: 150,
    image: "/images/formats/grupales-1.svg",
  },
  "cuaderno-practicas": {
    title: "Cuaderno de prácticas (PDF)",
    description: "Material descargable con hojas de trabajo.",
    price: 18,
    image: "/images/tools/tarjetas-practica.svg",
  },
  "guia-observacion": {
    title: "Guía de observación cotidiana (PDF)",
    description: "Guía breve para sostener prácticas simples en el día a día.",
    price: 0,
    image: "/images/tools/tarjetas-practica.svg",
  },
  "mapa-preguntas": {
    title: "Mapa de preguntas esenciales (PDF)",
    description: "Preguntas abiertas para explorar tu experiencia.",
    price: 0,
    image: "/images/tools/kit-observacion.svg",
  },
  "bitacora-temporada": {
    title: "Bitácora de temporada (PDF)",
    description: "Plantillas para sostener continuidad.",
    price: 22,
    image: "/images/tools/kit-observacion.svg",
  },
  "gema-amatista": {
    title: "Amatista",
    description: "Gema de calma y claridad para prácticas de foco.",
    price: 32,
    image: "/images/tools/gema-amatista.svg",
  },
  "gema-cuarzo-rosa": {
    title: "Cuarzo rosa",
    description: "Gema suave para rituales de autocuidado.",
    price: 30,
    image: "/images/tools/gema-cuarzo-rosa.svg",
  },
  "gema-obsidiana": {
    title: "Obsidiana",
    description: "Gema de profundidad para trabajo interno.",
    price: 34,
    image: "/images/tools/gema-obsidiana.svg",
  },
  "gema-citrino": {
    title: "Citrino",
    description: "Gema de energía para intención y enfoque.",
    price: 31,
    image: "/images/tools/gema-citrino.svg",
  },
  "gema-cuarzo-ahumado": {
    title: "Cuarzo ahumado",
    description: "Gema para enraizar y soltar tensión.",
    price: 33,
    image: "/images/tools/gema-cuarzo-ahumado.svg",
  },
  "gema-lapislazuli": {
    title: "Lapislázuli",
    description: "Gema de claridad mental y expresión.",
    price: 36,
    image: "/images/tools/gema-lapislazuli.svg",
  },
  "flauta-andina": {
    title: "Flauta andina",
    description: "Tono cálido y suave. Ideal para apertura de prácticas.",
    price: 95,
    image: "/images/tools/flauta-andina.svg",
  },
  "flauta-bambu": {
    title: "Flauta de bambú",
    description: "Sonido claro y liviano para respiración consciente.",
    price: 88,
    image: "/images/tools/flauta-bambu.svg",
  },
  "flauta-cedro": {
    title: "Flauta de cedro",
    description: "Tono profundo para apertura y cierre de prácticas.",
    price: 102,
    image: "/images/tools/flauta-cedro.svg",
  },
  "flauta-ocarina": {
    title: "Flauta ocarina",
    description: "Formato pequeño para práctica íntima y suave.",
    price: 78,
    image: "/images/tools/flauta-ocarina.svg",
  },
  "bolsita-limpieza": {
    title: "Bolsita limpieza",
    description: "Hierbas para limpieza y renovación del espacio.",
    price: 18,
    image: "/images/tools/bolsita-limpieza.svg",
  },
  "bolsita-descanso": {
    title: "Bolsita descanso",
    description: "Hierbas para descanso profundo y calma.",
    price: 18,
    image: "/images/tools/bolsita-descanso.svg",
  },
  "bolsita-claridad": {
    title: "Bolsita claridad",
    description: "Hierbas para despejar la mente y ordenar.",
    price: 18,
    image: "/images/tools/bolsita-claridad.svg",
  },
  "bolsita-proteccion": {
    title: "Bolsita protección",
    description: "Mezcla para sostén y resguardo energético.",
    price: 20,
    image: "/images/tools/bolsita-proteccion.svg",
  },
  "cuenco-ceramico": {
    title: "Cuenco cerámico",
    description: "Soporte estable para rituales y prácticas simples.",
    price: 26,
    image: "/images/tools/cuenco-ceramico.svg",
  },
  sahumador: {
    title: "Sahumador minimal",
    description: "Elemento para humo suave y ambiente cuidado.",
    price: 24,
    image: "/images/tools/sahumador.svg",
  },
  "campana-bronce": {
    title: "Campana de bronce",
    description: "Sonido breve para marcar inicio y cierre.",
    price: 28,
    image: "/images/tools/campana-bronce.svg",
  },
  "vela-soja": {
    title: "Vela de soja",
    description: "Vela natural para ritmo y presencia.",
    price: 16,
    image: "/images/tools/vela-soja.svg",
  },
  "manta-meditacion": {
    title: "Manta de meditación",
    description: "Textil suave para sostener la postura.",
    price: 42,
    image: "/images/tools/manta-meditacion.svg",
  },
} as const;

import type { Locale } from "./config"

export type Dictionary = {
  meta: {
    title: string
    description: string
  }
  nav: {
    home: string
    about: string
    vision: string
    products: string
    engineering: string
    certifications: string
    selector: string
    contact: string
    quote: string
    openMenu: string
    closeMenu: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
    ctaProducts: string
    ctaExport: string
    imageAlt: string
  }
  stats: {
    experience: string
    facility: string
    models: string
    certification: string
  }
  products: {
    series: string
    title: string
    description: string
    viewAll: string
    viewProduct: string
    stages: string
    pageTitle: string
    pageSubtitle: string
    pageDescription: string
    viewSpecs: string
    backToProducts: string
    specifications: string
    capacity: string
    cylindersDay: string
    finalPressure: string
    features: string
    downloadPdf: string
    requestQuote: string
    category: string
    categoryDescription: string
  }
  engineering: {
    label: string
    title: string
    subtitle: string
    viewAll: string
    pageTitle: string
    pageSubtitle: string
  }
  certifications: {
    label: string
    title: string
    subtitle: string
    viewAll: string
    pageTitle: string
    pageSubtitle: string
    main: string
    safety: string
    electrical: string
    normalization: string
    sectorNote: string
    sectorDescription: string
  }
  cta: {
    label: string
    title: string
    description: string
    selectCompressor: string
    ourHistory: string
    imageAlt: string
  }
  about: {
    label: string
    title: string
    facility: string
    trajectory: string
    imageAlt: string
  }
  vision: {
    label: string
    title: string
    subtitle: string
  }
  selector: {
    label: string
    title: string
    subtitle: string
    byFlow: string
    byCylinders: string
    flowLabel: string
    flowNote: string
    cylinderLabel: string
    cylinderNote: string
    matches: string
    noMatch: string
    view: string
  }
  contact: {
    label: string
    title: string
    office: string
    email: string
    phones: string
    formTitle: string
    name: string
    emailField: string
    subject: string
    message: string
    send: string
    thanks: string
    thanksNote: string
  }
  footer: {
    contact: string
    links: string
    rights: string
    stayInTouch: string
  }
  timeline: {
    y1992: { title: string; description: string }
    y2000s: { title: string; description: string }
    y2010s: { title: string; description: string }
    today: { title: string; description: string }
  }
  values: {
    values: { title: string; description: string }
    vision: { title: string; description: string }
    custom: { title: string; description: string }
    quality: { title: string; description: string }
    efficiency: { title: string; description: string }
    sustainability: { title: string; description: string }
  }
  aboutParagraphs: string[]
  engineeringItems: { title: string; description: string }[]
  productFeatures: Record<string, string[]>
}

const engineeringEs = [
  {
    title: "Sistema de cigüeñal",
    description:
      "Diseño de base robusta con un nivel de equilibrio y velocidades lineales que no superan el metro por segundo, lo que garantiza una larga vida útil y una marcha altamente regular. Los compresores de Air Products garantizan un bajo nivel de ruido.",
  },
  {
    title: "Cilindros",
    description:
      "Cilindros de compresión obtenidos a partir de una sola pieza de material inoxidable de gran superficie de disipación, mecanizados con máquinas CNC de última generación con superficie de deslizamiento superior a 0,05 Ra.",
  },
  {
    title: "Bielas y cojinete",
    description:
      "Bielas termotratadas y solubilizadas de alta resistencia. Cojinete dimensionado, lubricado y sellado para una vida útil superior a 30.000 horas. Rodamiento de agujas con grasa especial para contacto con oxígeno.",
  },
  {
    title: "Anillos guía",
    description:
      "Cruzeta moldeada por inyección de aleación de alto contenido en silicio, con bandas deslizantes en PTFE homologadas por las normas BAM y EIGA.",
  },
  {
    title: "Guía de cruceta",
    description:
      "Cilindro de cruceta de alta disipación con anodizado duro, muy bajo coeficiente de fricción, funcionamiento suave y bajo nivel sonoro.",
  },
  {
    title: "Anillos de pistón",
    description:
      "Diseñados para alta eficiencia volumétrica con pérdidas de flujo muy limitadas. Materiales conformes a estándares BAM y EIGA.",
  },
  {
    title: "Intercoolers",
    description:
      "Intercambiadores refrigerados por aire a presión en modelos OX300, OX500 y OX1000. Aluminio para baja presión y acero inoxidable para media presión.",
  },
]

const engineeringEn = [
  {
    title: "Crankshaft system",
    description:
      "Robust base design with balance and linear speeds under one meter per second, ensuring long service life and smooth operation. Air Products compressors deliver low noise levels.",
  },
  {
    title: "Cylinders",
    description:
      "Compression cylinders machined from a single piece of stainless steel with large heat dissipation surface, CNC-machined to achieve sliding surface quality above 0.05 Ra.",
  },
  {
    title: "Connecting rods and bearings",
    description:
      "Heat-treated connecting rods with high strength. Bearing sized, lubricated and sealed for over 30,000 hours of service life. Needle bearing with special grease for oxygen contact.",
  },
  {
    title: "Guide rings",
    description:
      "Crosshead molded from high-silicon alloy with PTFE sliding bands certified to BAM and EIGA standards.",
  },
  {
    title: "Crosshead guide",
    description:
      "High-dissipation crosshead cylinder with hard anodizing, very low friction coefficient, smooth operation and low noise.",
  },
  {
    title: "Piston rings",
    description:
      "Designed for high volumetric efficiency with very limited flow losses. Materials compliant with BAM and EIGA standards.",
  },
  {
    title: "Intercoolers",
    description:
      "Air-cooled heat exchangers on OX300, OX500 and OX1000 models. Aluminum for low pressure and stainless steel for medium pressure.",
  },
]

const productFeaturesEs: Record<string, string[]> = {
  ox25: [
    "Capacidad de refuerzo pequeño de 0.5 m³/h a 2.1 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Dos etapas",
  ],
  ox50: [
    "Capacidad de refuerzo pequeño de 1.2 m³/h a 2.8 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Dos etapas",
  ],
  ox100: [
    "Capacidad de refuerzo de 1.5 m³/h a 4.8 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Dos etapas",
  ],
  ox100plus: [
    "Capacidad de refuerzo de 1.5 m³/h a 4.8 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 200 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Dos etapas",
  ],
  ox200: [
    "Capacidad de refuerzo medio de 1.5 m³/h a 7.5 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Dos etapas",
  ],
  ox200plus: [
    "Capacidad de refuerzo medio de 1.5 m³/h a 7.5 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 200 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Dos etapas",
  ],
  ox300: [
    "Capacidad de refuerzo media de 8.4 m³/h a 14 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Tres etapas",
  ],
  ox300plus: [
    "Capacidad de refuerzo media de 7.5 m³/h a 13.5 m³/h",
    "Booster de alta presión 100% libre de aceite",
    "Presión final 200 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Tres etapas",
  ],
  ox500: [
    "Alta capacidad de refuerzo de 12 m³/h a 20.5 m³/h",
    "Booster de alta presión 100% sin aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Tres etapas",
  ],
  ox1000: [
    "Alta capacidad de refuerzo de 20 m³/h a 44 m³/h",
    "Booster de alta presión 100% sin aceite",
    "Presión final 150 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Cuatro etapas",
  ],
  ox1000plus: [
    "Alta capacidad de refuerzo de 20 m³/h a 36 m³/h",
    "Booster de alta presión 100% sin aceite",
    "Presión final 200 bar",
    "Bajas revoluciones por minuto",
    "Diseño resistente para operación continua",
    "Cuatro etapas",
  ],
}

const productFeaturesEn: Record<string, string[]> = {
  ox25: [
    "Small boost capacity from 0.5 m³/h to 2.1 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Two stages",
  ],
  ox50: [
    "Small boost capacity from 1.2 m³/h to 2.8 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Two stages",
  ],
  ox100: [
    "Boost capacity from 1.5 m³/h to 4.8 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Two stages",
  ],
  ox100plus: [
    "Boost capacity from 1.5 m³/h to 4.8 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 200 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Two stages",
  ],
  ox200: [
    "Medium boost capacity from 1.5 m³/h to 7.5 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Two stages",
  ],
  ox200plus: [
    "Medium boost capacity from 1.5 m³/h to 7.5 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 200 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Two stages",
  ],
  ox300: [
    "Medium boost capacity from 8.4 m³/h to 14 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Three stages",
  ],
  ox300plus: [
    "Medium boost capacity from 7.5 m³/h to 13.5 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 200 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Three stages",
  ],
  ox500: [
    "High boost capacity from 12 m³/h to 20.5 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Three stages",
  ],
  ox1000: [
    "High boost capacity from 20 m³/h to 44 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 150 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Four stages",
  ],
  ox1000plus: [
    "High boost capacity from 20 m³/h to 36 m³/h",
    "100% oil-free high-pressure booster",
    "Final pressure 200 bar",
    "Low RPM operation",
    "Heavy-duty design for continuous operation",
    "Four stages",
  ],
}

const dictionaries: Record<Locale, Dictionary> = {
  es: {
    meta: {
      title: "Air Products SRL | Compresores de oxígeno libres de aceite",
      description:
        "Fabricante argentino de compresores booster libres de aceite para oxígeno y gases industriales. Certificación CE/PED. Exportación internacional desde Buenos Aires.",
    },
    nav: {
      home: "Inicio",
      about: "Nosotros",
      vision: "Visión",
      products: "Productos",
      engineering: "Ingeniería",
      certifications: "Certificaciones",
      selector: "Selector",
      contact: "Contacto",
      quote: "Cotizar",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    hero: {
      badge: "Fabricante argentino desde 1992",
      title: "Compresores libres de aceite para oxígeno y gases industriales",
      subtitle:
        "Compresión sin aceite con el más alto nivel de eficiencia. Ingeniería propia, certificación europea CE/PED y exportación a mercados internacionales.",
      ctaProducts: "Ver productos",
      ctaExport: "Contacto exportación",
      imageAlt: "Gama de compresores booster OX y planta de fabricación Air Products",
    },
    stats: {
      experience: "Años de experiencia",
      facility: "Planta industrial",
      models: "Modelos serie OX",
      certification: "Certificación europea",
    },
    products: {
      series: "Serie OX",
      title: "Boosters de alta presión",
      description:
        "Sistemas de llenado de cilindros de alta presión. Llenado de 4 a 140 cilindros por día. Presión final 150 a 200 bar.",
      viewAll: "Ver todos →",
      viewProduct: "Ver producto",
      stages: "etapas",
      pageTitle: "Sistemas de llenado de cilindros de alta presión",
      pageSubtitle: "Booster de la serie OX",
      pageDescription:
        "Air Products ofrece una gama completa de sistemas de llenado de cilindros de alta presión a 150 y 200 bar. Llenado de 4 a 140 cilindros por día.",
      viewSpecs: "Ver especificaciones →",
      backToProducts: "← Volver a productos",
      specifications: "Especificaciones",
      capacity: "Capacidad",
      cylindersDay: "Cilindros/día (50 L)",
      finalPressure: "Presión final",
      features: "Características",
      downloadPdf: "Descargar catálogo PDF",
      requestQuote: "Solicitar cotización",
      category: "Alta presión 100% libre de aceite",
      categoryDescription: "Booster de la serie OX",
    },
    engineering: {
      label: "Ingeniería de alto nivel",
      title: "Compresión sin aceite con máxima eficiencia",
      subtitle: "Ingeniería de alto nivel",
      viewAll: "Conocer toda nuestra ingeniería →",
      pageTitle: "Compresión sin aceite con el más alto nivel de eficiencia",
      pageSubtitle:
        "Cada componente de nuestros compresores está diseñado y optimizado para garantizar larga vida útil, bajo ruido y máxima confiabilidad en servicio de oxígeno.",
    },
    certifications: {
      label: "Confianza internacional",
      title: "Certificaciones y normas",
      subtitle: "Cumplimiento CE, PED, ISO y estándares CGA/AIGA/EIGA para servicio de oxígeno.",
      viewAll: "Ver certificaciones completas →",
      pageTitle: "Certificaciones",
      pageSubtitle:
        "Nuestra prioridad: la innovación cualitativa. Cumplimiento de normativas europeas e internacionales para compresores de gases industriales y servicio de oxígeno.",
      main: "Certificaciones principales",
      safety: "Seguridad de la máquina",
      electrical: "Seguridad eléctrica",
      normalization: "Normalización y pruebas",
      sectorNote: "Normativas del sector",
      sectorDescription:
        "En la manufactura de equipos compresores de gases, se aplican reglamentos y requisitos de legislación nacional e internacional. La normalización internacional facilita el trabajo con especificaciones, calidad, medición y planos de fabricación.",
    },
    cta: {
      label: "Exportación",
      title: "Fabricación argentina con estándares internacionales",
      description:
        "Desde Buenos Aires proveemos al mercado global con compresores booster 100% libres de aceite, diseñados y fabricados en nuestra planta de 2200 m².",
      selectCompressor: "Seleccionar compresor",
      ourHistory: "Nuestra historia",
      imageAlt: "Gama de compresores OX en feria industrial",
    },
    about: {
      label: "Nuestra historia",
      title: "Soluciones de gas comprimido desde 1992",
      facility: "Depósito de",
      trajectory: "Trayectoria",
      imageAlt: "Stand de Air Products SRL en feria industrial",
    },
    vision: {
      label: "Visión",
      title: "Soluciones de ingeniería innovadora",
      subtitle:
        "Inspiradas en la sustentabilidad y orientadas a la producción de compresores de oxígeno de alta calidad.",
    },
    selector: {
      label: "Selector",
      title: "Encuentre su compresor OX",
      subtitle:
        "Elija por capacidad en m³/h según ISO 1217 o por cantidad de cilindros de 50 litros a recargar en 24 horas.",
      byFlow: "Por rendimiento (m³/h)",
      byCylinders: "Por cilindros/día (50 L)",
      flowLabel: "Capacidad requerida",
      flowNote: "Según ISO 1217",
      cylinderLabel: "Cilindros a recargar en 24 h",
      cylinderNote: "Cilindro vacío de 50 litros",
      matches: "modelo(s) compatible(s)",
      noMatch: "Ningún modelo exacto — modelos más cercanos",
      view: "Ver →",
    },
    contact: {
      label: "Contacto",
      title: "Hablemos de su proyecto",
      office: "Nuestra oficina",
      email: "Email",
      phones: "Teléfonos",
      formTitle: "Envíenos un mensaje",
      name: "Nombre",
      emailField: "Email",
      subject: "Asunto",
      message: "Mensaje",
      send: "Enviar mensaje",
      thanks: "¡Gracias por contactarnos!",
      thanksNote: "Se abrió tu cliente de correo. Si no se abrió, escribinos a",
    },
    footer: {
      contact: "Contacto",
      links: "Enlaces",
      rights: "Todos los derechos reservados.",
      stayInTouch: "Estemos en contacto",
    },
    timeline: {
      y1992: {
        title: "Fundación",
        description: "Inicio de operaciones en Argentina con foco en compresores de oxígeno y gas.",
      },
      y2000s: {
        title: "Expansión industrial",
        description: "Desarrollo de gama completa de equipamiento de aire comprimido y gases.",
      },
      y2010s: {
        title: "Certificación internacional",
        description: "Cumplimiento de normativas CE, PED, ISO y estándares CGA/AIGA/EIGA.",
      },
      today: {
        title: "Mercado global",
        description:
          "Fabricación en planta de 2200 m² en Avellaneda, exportación a mercados internacionales.",
      },
    },
    values: {
      values: {
        title: "Nuestros valores",
        description:
          "Ofrecer compresores de oxígeno y productos de gases de alta calidad. Eficiencia energética y rentable; brindar una experiencia personalizada excepcional y continuar generando confianza en nuestra industria.",
      },
      vision: {
        title: "Nuestra visión",
        description:
          "Liderando con soluciones innovadoras, mejoras continuas y productos de calidad en compresores de oxígeno. Soluciones individuales priorizando calidad, flexibilidad y producción orientada al cliente.",
      },
      custom: {
        title: "Soluciones personalizables",
        description:
          "Reconocemos que nuestros clientes a menudo necesitan soluciones individuales. Aparte de nuestra gama estándar, ofrecemos soluciones a medida diseñadas específicamente para cada necesidad.",
      },
      quality: {
        title: "Compromiso con la calidad",
        description:
          "La ingeniería es el corazón de nuestra identidad. Equipos CNC de última generación y herramientas especialmente desarrolladas dan como resultado eficiencia del producto y alta durabilidad.",
      },
      efficiency: {
        title: "Eficiencia energética",
        description:
          "La optimización de una red de oxígeno y gases comprimidos ofrece potenciales ahorros energéticos, reduciendo drásticamente el costo operativo y la huella de carbono.",
      },
      sustainability: {
        title: "Sustentabilidad",
        description:
          "Nos comprometemos a garantizar que todos los procesos, desde la ingeniería hasta la logística, sean coincidentes con nuestra visión de proteger el futuro.",
      },
    },
    aboutParagraphs: [
      "Air Products SRL inició su emprendimiento en 1992 con una misión de convertirnos en un fabricante líder en compresores de oxígeno y gas, secadores, filtros y generadores de oxígeno y nitrógeno.",
      "Air Products SRL se propuso inicialmente producir compresores y otros productos para nuestro mercado local. Desde entonces, ha evolucionado como fabricante, diseñando, desarrollando y fabricando un conjunto completo de equipamiento de aire comprimido y gases.",
      "Sobre la base de 30 años de experiencia, seguimos desarrollando nuestra gama de productos para satisfacer el crecimiento y las demandas del mercado. Con un enfoque innovador, nos esforzamos por mejorar continuamente las características, el rendimiento y la calidad de nuestros productos.",
      "Al día de hoy, Air Products SRL ha demostrado ser técnicamente avanzada, energéticamente eficiente y efectiva. Desde sus humildes comienzos en nuestras pequeñas instalaciones, Air Products SRL ahora provee al mercado global a través de nuestras operaciones en Buenos Aires, Argentina.",
    ],
    engineeringItems: engineeringEs,
    productFeatures: productFeaturesEs,
  },
  en: {
    meta: {
      title: "Air Products SRL | Oil-free oxygen compressors",
      description:
        "Argentine manufacturer of oil-free booster compressors for oxygen and industrial gases. CE/PED certified. International export from Buenos Aires.",
    },
    nav: {
      home: "Home",
      about: "About",
      vision: "Vision",
      products: "Products",
      engineering: "Engineering",
      certifications: "Certifications",
      selector: "Selector",
      contact: "Contact",
      quote: "Get a quote",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      badge: "Argentine manufacturer since 1992",
      title: "Oil-free compressors for oxygen and industrial gases",
      subtitle:
        "Oil-free compression with the highest level of efficiency. In-house engineering, European CE/PED certification and export to international markets.",
      ctaProducts: "View products",
      ctaExport: "Export inquiries",
      imageAlt: "OX booster compressor range and Air Products manufacturing facility",
    },
    stats: {
      experience: "Years of experience",
      facility: "Manufacturing plant",
      models: "OX series models",
      certification: "European certification",
    },
    products: {
      series: "OX Series",
      title: "High-pressure boosters",
      description:
        "High-pressure cylinder filling systems. Filling from 4 to 140 cylinders per day. Final pressure 150 to 200 bar.",
      viewAll: "View all →",
      viewProduct: "View product",
      stages: "stages",
      pageTitle: "High-pressure cylinder filling systems",
      pageSubtitle: "OX Series Booster",
      pageDescription:
        "Air Products offers a complete range of high-pressure cylinder filling systems at 150 and 200 bar. Filling from 4 to 140 cylinders per day.",
      viewSpecs: "View specifications →",
      backToProducts: "← Back to products",
      specifications: "Specifications",
      capacity: "Capacity",
      cylindersDay: "Cylinders/day (50 L)",
      finalPressure: "Final pressure",
      features: "Features",
      downloadPdf: "Download catalog PDF",
      requestQuote: "Request a quote",
      category: "100% oil-free high pressure",
      categoryDescription: "OX Series Booster",
    },
    engineering: {
      label: "High-level engineering",
      title: "Oil-free compression with maximum efficiency",
      subtitle: "High-level engineering",
      viewAll: "Explore our full engineering →",
      pageTitle: "Oil-free compression with the highest level of efficiency",
      pageSubtitle:
        "Every component of our compressors is designed and optimized to ensure long service life, low noise and maximum reliability in oxygen service.",
    },
    certifications: {
      label: "International trust",
      title: "Certifications and standards",
      subtitle: "CE, PED, ISO compliance and CGA/AIGA/EIGA standards for oxygen service.",
      viewAll: "View full certifications →",
      pageTitle: "Certifications",
      pageSubtitle:
        "Our priority: qualitative innovation. Compliance with European and international regulations for industrial gas compressors and oxygen service.",
      main: "Main certifications",
      safety: "Machine safety",
      electrical: "Electrical safety",
      normalization: "Standardization and testing",
      sectorNote: "Industry regulations",
      sectorDescription:
        "In the manufacture of gas compressor equipment, national and international regulations and requirements apply. International standardization facilitates work with specifications, quality, measurement and manufacturing drawings.",
    },
    cta: {
      label: "Export",
      title: "Argentine manufacturing with international standards",
      description:
        "From Buenos Aires we serve the global market with 100% oil-free booster compressors, designed and manufactured in our 2,200 m² facility.",
      selectCompressor: "Select compressor",
      ourHistory: "Our history",
      imageAlt: "OX compressor range at industrial trade show",
    },
    about: {
      label: "Our history",
      title: "Compressed gas solutions since 1992",
      facility: "Facility of",
      trajectory: "Our journey",
      imageAlt: "Air Products SRL booth at industrial trade show",
    },
    vision: {
      label: "Vision",
      title: "Innovative engineering solutions",
      subtitle:
        "Inspired by sustainability and focused on producing high-quality oxygen compressors.",
    },
    selector: {
      label: "Selector",
      title: "Find your OX compressor",
      subtitle:
        "Choose by capacity in m³/h per ISO 1217 or by number of 50-litre cylinders to refill in 24 hours.",
      byFlow: "By flow rate (m³/h)",
      byCylinders: "By cylinders/day (50 L)",
      flowLabel: "Required capacity",
      flowNote: "Per ISO 1217",
      cylinderLabel: "Cylinders to refill in 24 h",
      cylinderNote: "Empty 50-litre cylinder",
      matches: "matching model(s)",
      noMatch: "No exact match — closest models",
      view: "View →",
    },
    contact: {
      label: "Contact",
      title: "Let's discuss your project",
      office: "Our office",
      email: "Email",
      phones: "Phones",
      formTitle: "Send us a message",
      name: "Name",
      emailField: "Email",
      subject: "Subject",
      message: "Message",
      send: "Send message",
      thanks: "Thank you for contacting us!",
      thanksNote: "Your email client should have opened. If not, write to us at",
    },
    footer: {
      contact: "Contact",
      links: "Links",
      rights: "All rights reserved.",
      stayInTouch: "Stay in touch",
    },
    timeline: {
      y1992: {
        title: "Foundation",
        description: "Operations begin in Argentina focused on oxygen and gas compressors.",
      },
      y2000s: {
        title: "Industrial expansion",
        description: "Development of a complete range of compressed air and gas equipment.",
      },
      y2010s: {
        title: "International certification",
        description: "Compliance with CE, PED, ISO regulations and CGA/AIGA/EIGA standards.",
      },
      today: {
        title: "Global market",
        description:
          "Manufacturing in a 2,200 m² plant in Avellaneda, exporting to international markets.",
      },
    },
    values: {
      values: {
        title: "Our values",
        description:
          "Deliver high-quality oxygen compressors and gas products. Energy-efficient and cost-effective; provide an exceptional personalized experience and continue building trust in our industry.",
      },
      vision: {
        title: "Our vision",
        description:
          "Leading with innovative solutions, continuous improvements and quality products in oxygen compressors. Individual solutions prioritizing quality, flexibility and customer-oriented production.",
      },
      custom: {
        title: "Customizable solutions",
        description:
          "We recognize that our customers often need individual solutions. Beyond our standard range, we offer tailor-made solutions designed specifically for each need.",
      },
      quality: {
        title: "Commitment to quality",
        description:
          "Engineering is the heart of our identity. State-of-the-art CNC equipment and specially developed tools result in product efficiency and high durability.",
      },
      efficiency: {
        title: "Energy efficiency",
        description:
          "Optimizing an oxygen and compressed gas network offers significant energy savings, drastically reducing operating costs and carbon footprint.",
      },
      sustainability: {
        title: "Sustainability",
        description:
          "We are committed to ensuring that all processes, from engineering to logistics, align with our vision of protecting the future.",
      },
    },
    aboutParagraphs: [
      "Air Products SRL began its venture in 1992 with a mission to become a leading manufacturer of oxygen and gas compressors, dryers, filters and oxygen and nitrogen generators.",
      "Air Products SRL initially set out to produce compressors and other products for our local market. Since then, it has evolved as a manufacturer, designing, developing and manufacturing a complete range of compressed air and gas equipment.",
      "Based on 30 years of experience, we continue to develop our product range to meet market growth and demands. With an innovative approach, we strive to continuously improve the features, performance and quality of our products.",
      "Today, Air Products SRL has proven to be technically advanced, energy efficient and effective. From humble beginnings in our small facilities, Air Products SRL now serves the global market through our operations in Buenos Aires, Argentina.",
    ],
    engineeringItems: engineeringEn,
    productFeatures: productFeaturesEn,
  },
}

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]

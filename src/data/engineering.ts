export type EngineeringComponent = {
  id: string
  title: string
  description: string
  image: string
}

export const engineeringComponents: EngineeringComponent[] = [
  {
    id: "ciguenal",
    title: "Sistema de cigüeñal",
    description:
      "Diseño de base robusta con un nivel de equilibrio y velocidades lineales que no superan el metro por segundo, lo que garantiza una larga vida útil y una marcha altamente regular. Los compresores de Air Products garantizan un bajo nivel de ruido, ya que su diseño y largas pruebas en banco se han dedicado a la optimización de partes vitales de sus mecanismos y compuestos hasta alcanzar el alto nivel actual de calidad.",
    image: "/img/engineering/sistema-ciguenal.jpg",
  },
  {
    id: "cilindros",
    title: "Cilindros",
    description:
      "Cilindros de compresión de todas las etapas obtenidos a partir de una sola pieza de material inoxidable de gran superficie de disipación y mecanizados con máquinas CNC de última generación, utilajes dedicados y diseñados específicamente para obtener una superficie de deslizamiento de calidad especular superior a 0,05 Ra.",
    image: "/img/engineering/cilindros.jpg",
  },
  {
    id: "bielas",
    title: "Bielas y cojinete",
    description:
      "Bielas termotratadas y solubilizadas, de alta resistencia y dureza, que presentan un mínimo impacto y fuerzas de inercia alternativas. El cojinete de pie de biela está dimensionado, lubricado y sellado para una vida útil superior a 30.000 horas. Perno de pistón de alta dureza y resistencia, rodamiento de agujas lubricado con grasa especial para contacto con oxígeno y completo con sellos de vitón.",
    image: "/img/engineering/bielas-cojinete.jpg",
  },
  {
    id: "anillos-guia",
    title: "Anillos guía",
    description:
      "Cruzeta moldeada por inyección de aleación de alto contenido en silicio de muy bajo peso, tratada térmicamente y solubilizada, de gran resistencia y dureza. En el exterior dispone de los alojamientos para las bandas deslizantes fabricados en material PTFE homologados por las normas BAM y EIGA.",
    image: "/img/engineering/anillos-guia.jpg",
  },
  {
    id: "guia-cruceta",
    title: "Guía de cruceta",
    description:
      "Cilindro de cruceta de alta disipación. Diseño superficial construido en una pieza de extrusión, tratado térmicamente y a posteriori tratado con una gruesa capa de anodizado duro, que posee un muy bajo coeficiente de fricción y por lo tanto un funcionamiento suave y un bajo nivel sonoro.",
    image: "/img/engineering/guia-cruceta.jpg",
  },
  {
    id: "anillos-piston",
    title: "Anillos de pistón",
    description:
      "Diseñados para alta eficiencia volumétrica, con pérdidas de flujo muy limitadas debido a su construcción de dos piezas. Los materiales utilizados corresponden a diferentes aplicaciones y requisitos de compresión, como la correspondencia con los estándares BAM y EIGA.",
    image: "/img/engineering/anillos-piston.jpg",
  },
  {
    id: "intercoolers",
    title: "Intercoolers",
    description:
      "En los modelos OX300, OX500 y OX1000 se instalan intercambiadores de calor refrigerados por aire a presión. Utilizamos aluminio para las etapas de baja presión y acero inoxidable para media presión. Estos intercambiadores permiten una reducción en el diseño de los equipos así como un alto intercambio térmico.",
    image: "/img/engineering/intercoolers.jpg",
  },
]

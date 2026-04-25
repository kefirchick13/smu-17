import Image from "next/image";
import styles from "./ServicesSection.module.scss";

type ServiceItem = {
  title: string;
  imageSrc: string;
  body: string | string[];
};

const services: ServiceItem[] = [
  {
    title: "Под ключ",
    imageSrc: "/images/services/services-1.png",
    body: "Полный цикл работ: проектирование, строительство, инженерные сети и сдача объекта одному подрядчику — без размывания ответственности.",
  },
  {
    title: "Фундамент",
    imageSrc: "/images/services/services-2.png",
    body: "Столбчатые, ленточные и плитные основания, расчёт нагрузок и грунтов, устройство подушек и гидроизоляция под ваш тип здания.",
  },
  {
    title: "Металлокаркас",
    imageSrc: "/images/services/services-3.jpg",
    body: "Монтаж несущего каркаса: колонны, фермы, связи и узлы. Сварка и болтовые соединения, антикоррозийная защита и соответствие проекту.",
  },
  {
    title: "Кровля",
    imageSrc: "/images/services/services-4.jpg",
    body: "Плоские и скатные кровельные системы для промышленных зданий: гидроизоляция, утепление, водостоки и узлы примыкания.",
  },
  {
    title: "Бетонные работы",
    imageSrc: "/images/services/services-5.jpg",
    body: "Монолитный железобетон, устройство плит и покрытий, контроль геометрии и вибрирование, подготовка под технологическое оборудование.",
  },
  {
    title: "Инженерные системы",
    imageSrc: "/images/services/services-6.jpg",
    body: [
      "Вентиляция",
      "Автоматизация",
      "Водопроводы",
      "Системы пожаротушения",
      "Системы водо-, пневмо- и газоснабжения (кроме природного газа)",
      "Канализация",
      "Электроснабжение",
      "Слаботочные системы",
    ],
  },
  {
    title: "Промышленные полы",
    imageSrc: "/images/services/services-7.jpg",
    body: "Устройство стяжек, топпинг и упрочнённые покрытия, полы под нагрузку от техники и складской техники с плоскостью по допускам.",
  },
  {
    title: "Ограждающие конструкции",
    imageSrc: "/images/services/services-8.jpg",
    body: "Стены и перегородки, сэндвич-панели и навесные фасады: тепло- и шумоизоляция, герметизация узлов и монтаж по проекту.",
  },
];

export function ServicesSection() {
  return (
    <section className={styles.servicesSection} aria-label="Услуги">
      <h2 className={styles.sectionTitle}>Услуги</h2>
      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <article
            key={service.title}
            className={styles.serviceCard}
            tabIndex={0}
          >
            <div className={styles.serviceImage}>
              <Image
                src={service.imageSrc}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className={styles.serviceTitleBar}>
              <div className={styles.serviceTitle}>{service.title}</div>
              <div className={styles.serviceDescription}>
                {Array.isArray(service.body) ? (
                  <ul className={styles.serviceDescriptionList}>
                    {service.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.serviceDescriptionText}>{service.body}</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

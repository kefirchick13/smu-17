import styles from "./page.module.scss";
import { FeedBackForm } from "@/shared/ui";
import HowWeWork from "@/features/HowWeWork/HowWeWork";
import Image from "next/image";
import {
  COMPANY_EMAIL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/shared/constants/companyContacts";
import Link from "next/link";

export default function AboutPage() {
  const facts = [
    { value: "17", label: "лет на рынке строительства" },
    { value: "13", label: "компаний среди заказчиков" },
    { value: "150", label: "тысяч м2 построено" },
    { value: "30", label: "сданных проектов" },
    { value: "55", label: "сотрудников в штате" },
  ] as const;

  const services = [
    {
      title: "Под ключ",
      imageSrc: "/images/services/Rectangle 180.png",
      body: "Полный цикл работ: проектирование, строительство, инженерные сети и сдача объекта одному подрядчику — без размывания ответственности.",
    },
    {
      title: "Фундамент",
      imageSrc: "/images/services/Rectangle 180 (1).png",
      body: "Столбчатые, ленточные и плитные основания, расчёт нагрузок и грунтов, устройство подушек и гидроизоляция под ваш тип здания.",
    },
    {
      title: "Металлокаркас",
      imageSrc: "/images/services/Rectangle 180 (2).png",
      body: "Монтаж несущего каркаса: колонны, фермы, связи и узлы. Сварка и болтовые соединения, антикоррозийная защита и соответствие проекту.",
    },
    {
      title: "Кровля",
      imageSrc: "/images/services/Rectangle 180 (3).png",
      body: "Плоские и скатные кровельные системы для промышленных зданий: гидроизоляция, утепление, водостоки и узлы примыкания.",
    },
    {
      title: "Бетонные работы",
      imageSrc: "/images/services/Rectangle 180 (4).png",
      body: "Монолитный железобетон, устройство плит и покрытий, контроль геометрии и вибрирование, подготовка под технологическое оборудование.",
    },
    {
      title: "Инженерные системы",
      imageSrc: "/images/services/Rectangle 180 (5).png",
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
      imageSrc: "/images/services/Rectangle 180 (6).png",
      body: "Устройство стяжек, топпинг и упрочнённые покрытия, полы под нагрузку от техники и складской техники с плоскостью по допускам.",
    },
    {
      title: "Ограждающие конструкции",
      imageSrc: "/images/services/Rectangle 180 (7).png",
      body: "Стены и перегородки, сэндвич-панели и навесные фасады: тепло- и шумоизоляция, герметизация узлов и монтаж по проекту.",
    },
  ] as const;

  return (
    <main className={styles.aboutPage}>
      <section className={styles.aboutHero}>
        <div className={styles.aboutHeroContent}>
          <p className={styles.breadcrumbs}>Главная / О нас</p>
          <h1 className={styles.aboutHeroTitle}>
            Надёжный подрядчик
            <br />
            для промышленных задач
          </h1>
          <p className={styles.aboutHeroLead}>
            Ангары, склады, производственные здания. Генподряд и отдельные виды
            работ — от расчёта до сдачи объекта.
          </p>
          <div className={styles.aboutHeroActions}>
            <Link className={styles.primaryBtn} href="#feedbackForm">
              Оставить заявку
            </Link>
            <Link className={styles.secondaryBtn} href="/projects">
              Наши проекты
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.aboutFacts} aria-label="Факты о нас">
        <h2 className={styles.sectionTitle}>Факты о нас</h2>
        <div className={styles.factsGrid}>
          {facts.map((f) => (
            <div key={f.label} className={styles.factCard}>
              <div className={styles.factValue}>{f.value}</div>
              <div className={styles.factLabel}>{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.aboutServices} aria-label="Услуги">
        <h2 className={styles.sectionTitle}>Услуги</h2>
        <div className={styles.servicesGrid}>
          {services.map((s) => (
            <article
              key={s.title}
              className={styles.serviceCard}
              tabIndex={0}
            >
              <div className={styles.serviceImage}>
                <Image
                  src={s.imageSrc}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className={styles.serviceTitleBar}>
                <div className={styles.serviceTitle}>{s.title}</div>
                <div className={styles.serviceDescription}>
                  {Array.isArray(s.body) ? (
                    <ul className={styles.serviceDescriptionList}>
                      {s.body.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.serviceDescriptionText}>{s.body}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.aboutHow} aria-label="Как мы работаем">
        <HowWeWork />
      </section>

      <section className={styles.aboutCompanies} aria-label="О компаниях, с которыми мы реализовали проекты">
        <h2 className={styles.sectionTitle}>Компании, с которыми мы реализовали проекты</h2>
        <p className={styles.aboutText}>
          Мы реализуем проекты для компаний из промышленности, логистики и
          коммерческого сектора. Ориентируемся на задачи заказчика, технические
          требования и согласованный график. Берём ограниченное число объектов
          одновременно, поэтому сохраняем контроль на площадке и качество работ.
          На старте фиксируем этапы и объёмы, чтобы расчёт и план работ были
          прозрачными. В ходе работ регулярно информируем о статусе и
          согласовываем изменения, если они возникают. Часть реализованных
          проектов представлена на странице <Link href="/projects">Наши проекты</Link>. По запросу покажем дополнительные примеры
          по вашему типу объекта и задачам.
        </p>
      </section>
      

      <section className={styles.aboutRequisites} aria-labelledby="requisites-heading">
        <h2 id="requisites-heading" className={styles.requisitesTitle}>
          Реквизиты и контакты
        </h2>
        <div className={styles.requisitesCard}>
          <div className={styles.requisitesMain}>
            <p className={styles.requisitesOrg}>ООО «СМУ-17»</p>
            <dl className={styles.requisitesDl}>
              <div className={styles.requisitesRow}>
                <dt>ИНН / КПП</dt>
                <dd>4706034030 / 470601001</dd>
              </div>
              <div className={styles.requisitesRow}>
                <dt>ОГРН</dt>
                <dd>1134706000043</dd>
              </div>
              <div className={styles.requisitesRow}>
                <dt>Дата регистрации</dt>
                <dd>25.01.2013</dd>
              </div>
              <div className={styles.requisitesRow}>
                <dt>Юридический адрес</dt>
                <dd>
                  187341, Ленинградская область, г. Кировск, ул. Северная, д. 4,
                  ком. 48
                </dd>
              </div>
              <div className={styles.requisitesRow}>
                <dt>Фактический адрес</dt>
                <dd>
                  187341, Ленинградская область, г. Кировск, ул. Северная, д. 4,
                  ком. 48
                </dd>
              </div>
              <div className={styles.requisitesRow}>
                <dt>Генеральный директор</dt>
                <dd>Тимофеев М.В.</dd>
              </div>
            </dl>
          </div>

          <div className={styles.requisitesAside}>
            <h3 className={styles.requisitesSubheading}>Контакты</h3>
            <p className={styles.requisitesContactLine}>
              <a href={`tel:${COMPANY_PHONE_TEL}`}>{COMPANY_PHONE_DISPLAY}</a>
            </p>
            <p className={styles.requisitesContactLine}>
              <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
            </p>

            <h3 className={styles.requisitesSubheading}>Расчётный счёт</h3>
            <dl className={styles.bankDl}>
              <div className={styles.bankRow}>
                <dt>Р/с</dt>
                <dd>40702810806000036912</dd>
              </div>
              <div className={styles.bankRow}>
                <dt>Банк</dt>
                <dd>
                  Санкт-Петербургский ф-л ПАО «Промсвязьбанк», г. Санкт-Петербург
                </dd>
              </div>
              <div className={styles.bankRow}>
                <dt>К/с</dt>
                <dd>30101810000000000920</dd>
              </div>
              <div className={styles.bankRow}>
                <dt>БИК</dt>
                <dd>044030920</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <FeedBackForm id="feedbackForm" />
    </main>
  );
}
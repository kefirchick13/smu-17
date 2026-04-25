import type { Metadata } from "next";
import styles from "./page.module.scss";
import { FeedBackForm } from "@/shared/ui";
import Image from "next/image";
import {
  COMPANY_EMAIL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/shared/constants/companyContacts";
import Link from "next/link";
import { ServicesSection } from "@/features/ServicesSection/ServicesSection";
import { getSiteUrl } from "@/shared/constants/seo";

export const metadata: Metadata = {
  title: "О компании СМУ-17 — подрядчик в Санкт-Петербурге",
  description:
    "О компании СМУ-17: опыт в строительстве промышленных объектов, складов, ангаров и коттеджей в Санкт-Петербурге и Ленинградской области.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "О компании СМУ-17 — подрядчик в Санкт-Петербурге",
    description:
      "Опыт, сертификаты и реквизиты строительного подрядчика СМУ-17.",
    url: "/about",
  },
};

export default function AboutPage() {
  const facts = [
    { value: "17", label: "лет на рынке строительства" },
    { value: "13", label: "компаний среди заказчиков" },
    { value: "150", label: "тысяч м2 построено" },
    { value: "30", label: "сданных проектов" },
    { value: "55", label: "сотрудников в штате" },
  ] as const;
  const certificates = [
    {
      title: "Свидетельство СРО",
      previewSrc: "/images/sertificates/sertif1.jpg",
      pdfSrc: "/images/sertificates/01_Свидетельство СРО.pdf",
    },
    {
      title: "Свидетельство на проектирование",
      previewSrc: "/images/sertificates/sertif2.jpg",
      pdfSrc: "/images/sertificates/02_Свидетельство проектирование.pdf",
    },
    {
      title: "ИСО 9001 (проектирование)",
      previewSrc: "/images/sertificates/sertif3.jpg",
      pdfSrc: "/images/sertificates/03_ИСО 9001_Проектирование от 23г (1).pdf",
    },
    {
      title: "ИСО 9001 (строительство)",
      previewSrc: "/images/sertificates/sertif4.jpg",
      pdfSrc: "/images/sertificates/04_ИСО 9001_Строительство от 23г.pdf",
    },
  ] as const;
  const siteUrl = getSiteUrl();
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "О нас",
        item: `${siteUrl}/about`,
      },
    ],
  };

  return (
    <main className={styles.aboutPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
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

      <ServicesSection />

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

      <section
        id="certificates"
        className={styles.aboutCertificates}
        aria-label="Свидетельства и сертификаты"
      >
        <h2 className={styles.sectionTitle}>Свидетельства и сертификаты</h2>
        <div className={styles.certificatesGrid}>
          {certificates.map((certificate) => (
            <a
              key={certificate.title}
              href={certificate.pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.certificateCard}
              aria-label={`${certificate.title} (открыть PDF)`}
            >
              <div className={styles.certificatePreview}>
                <Image
                  src={certificate.previewSrc}
                  alt={certificate.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <span className={styles.certificateTitle}>{certificate.title}</span>
            </a>
          ))}
        </div>
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
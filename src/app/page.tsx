import type { Metadata } from "next";
import FeedBackForm from "@/features/FeedbackForm/FeedBackForm";
import styles from "./page.module.scss";
import { AccordionItem, AccordionList, SmuButton } from "@/shared/ui";
import Link from "next/link";
import LinkIcon from "@public/icons/link-icon.svg";
import Image from "next/image";
import { HomeProjectsCarousel } from "@/features/HomeProjectsCarousel/HomeProjectsCarousel";
import { ProjectHomeBlocks } from "@/features/ProjectHomeBlocks/ProjectHomeBlocks";
import { ServicesSection } from "@/features/ServicesSection/ServicesSection";
import { SITE_NAME, getSiteUrl } from "@/shared/constants/seo";



/** Список из БД — не кэшируем как статику (хост `db` и т.п. недоступны при `next build`). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Строительство промышленных объектов, складов, ангаров и коттеджей в СПб",
  description:
    "СМУ-17: генподряд, проектирование и строительство промышленных зданий, складов, ангаров и коттеджей в Санкт-Петербурге и ЛО.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Строительство промышленных объектов, складов, ангаров и коттеджей в СПб",
    description:
      "Генподряд, проектирование и строительство в Санкт-Петербурге и Ленинградской области.",
    url: "/",
  },
};

export default async function HomePage() {
  const siteUrl = getSiteUrl();
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: siteUrl,
    areaServed: ["Санкт-Петербург", "Ленинградская область"],
    serviceType: [
      "Строительство промышленных зданий",
      "Строительство складов",
      "Строительство ангаров",
      "Строительство коттеджей",
      "Проектирование объектов",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <div className={styles.homePage}>
        <section className={styles.homePageIntro}>
          <div className={styles.homePageIntroContent}>
            <h1 className={styles.homePageIntroTitle}>
              Строим надежно, работаем по делу
            </h1>
            <p className={styles.homePageIntroDescription}>
            СМУ 17 | Санкт Петербург и ЛО | Строим с 2008 года!
              <br /> Проектирование, строительство, реконструкция:
              <br />- ангары, склады, производственные цеха
              <br />- коттеджи, здания и сооружения другого назначения
              <br /> Инженерные системы (всё, кроме природного газа и внешнего электроснабжения):
              <br />- отопление, вентиляция, водоснабжение, канализация
              <br />- внутренние электрические сети, слаботочные системы и др.
            </p>
            <div className={styles.homePageIntroButtonsContainer}>
              <div className={styles.homePageIntroButtons}>
              <SmuButton href="/projects" variant="secondary">
                Наши проекты
              </SmuButton>
              <SmuButton href="/about#certificates" variant="secondary">
                Свидетельства и сертификаты
              </SmuButton>
              </div>
              <div className={styles.homePageIntroButtons}> 
              <SmuButton href="#feedbackForm">Оставить заявку</SmuButton>
              </div>
            </div>
          </div>
        </section>
        <ServicesSection />
        <ProjectHomeBlocks />  
        <section className={styles.ourProjects}>
          <div className={styles.ProjectsTitleContainer}>
            <h1 className={styles.ourProjectsTitle}>Наши проекты</h1>
            <Link href="/projects" className={styles.ourProjectsLink}>Смотреть все проекты <LinkIcon /></Link>
          </div>
          <HomeProjectsCarousel />
        </section>
        <FeedBackForm id="feedbackForm" />
      </div>
    </>
  );
}

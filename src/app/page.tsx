import FeedBackForm from "@/features/FeedbackForm/FeedBackForm";
import styles from "./page.module.scss";
import { AccordionItem, AccordionList, SmuButton } from "@/shared/ui";
import Link from "next/link";
import LinkIcon from "@public/icons/link-icon.svg";
import Image from "next/image";
import { HomeProjectsCarousel } from "@/features/HomeProjectsCarousel/HomeProjectsCarousel";
import { ProjectHomeBlocks } from "@/features/ProjectHomeBlocks/ProjectHomeBlocks";



/** Список из БД — не кэшируем как статику (хост `db` и т.п. недоступны при `next build`). */
export const dynamic = "force-dynamic";

export default async function HomePage() {

  return (
    <>
      <div className={styles.homePage}>
        <section className={styles.homePageIntro}>
          <div className={styles.homePageIntroContent}>
            <h1 className={styles.homePageIntroTitle}>
              Строим надежно, работаем по делу
            </h1>
            <p className={styles.homePageIntroDescription}>
              СМУ-17 — строительная компания из Санкт-Петербурга, работаем с 2008
              года. Строим ангары, склады и производственные здания под ключ или
              поэтапно, в срок и по требованиям, под ключ или поэтапно.
            </p>
            <div className={styles.homePageIntroButtonsContainer}>
              <SmuButton href="#feedbackForm">Оставить заявку</SmuButton>
              <SmuButton href="/projects" variant="secondary">
                Наши проекты
              </SmuButton>
            </div>
          </div>
        </section>
        <section className={styles.homePageTrust}>
          <div className={styles.homePageTrustFirstColumn}>
            <h1 className={styles.homePageTrustTitle}>Почему нам доверяют</h1>
            <p className={styles.homePageTrustDescription}>
              Ведём не более двух объектов одновременно — поэтому держим сроки и
              качество. Работаем по договору и фиксируем этапы в смете и графике.
              Сопровождаем проект от расчёта до сдачи объекта.
            </p>
            <SmuButton href="/about" variant="primary">
              Подробнее о нас
            </SmuButton>
          </div>
          <div className={styles.homePageTrustSecondColumn}>
            <div className={styles.homePageTrustSecondColumnItemsContainer}>
              <div className={styles.homePageTrustSecondColumnItem}>
                <div className={styles.homePageTrustSecondColumnItemTitle}>
                  Фокус <br />
                  на объекте
                </div>
                <div
                  className={styles.homePageTrustSecondColumnItemDescription}
                >
                  Не более 2 проектов
                  <br />
                  одновременно
                </div>
              </div>
              <div className={styles.homePageTrustSecondColumnItem}>
                <div className={styles.homePageTrustSecondColumnItemTitle}>
                  Смета
                  <br />и график
                </div>
                <div
                  className={styles.homePageTrustSecondColumnItemDescription}
                >
                  Этапы и объемы фиксируются
                </div>
              </div>
              <div className={styles.homePageTrustSecondColumnItem}>
                <div className={styles.homePageTrustSecondColumnItemTitle}>
                  Работа <br />
                  по договору
                </div>
                <div
                  className={styles.homePageTrustSecondColumnItemDescription}
                >
                  Порядок работ <br />и ответственность
                </div>
              </div>
              <div className={styles.homePageTrustSecondColumnItem}>
                <div className={styles.homePageTrustSecondColumnItemTitle}>
                  Сдача
                  <br />
                  объекта
                </div>
                <div
                  className={styles.homePageTrustSecondColumnItemDescription}
                >
                  Закрывающие документы
                </div>
              </div>
            </div>
          </div>
        </section>
          <ProjectHomeBlocks />
          
        <section className={styles.howWeWork}>
        <h1 className={styles.howWeWorkTitle}>Как мы работаем</h1>
          <div className={styles.howWeWorkColumnsContainer}>
          <div className={styles.firstColumn}>
            <Image
              src="/images/how-we-work.png"
              alt="Как мы работаем"
              className={styles.howWeWorkImage}
              width={1440}
              height={600}
              sizes="(max-width: 728px) 90vw, 33vw"
            />
          </div>
          <div className={styles.secondColumn}>
            <AccordionList
              className={styles.howWeWorkSteps}
            >
              <AccordionItem
                id="1"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>1</span>
                    Заявка
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  Оставьте заявку на сайте или позвоните нам
                </div>
              </AccordionItem>

              <AccordionItem
                id="2"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>2</span>
                    Консультация
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  Мы свяжемся с вами и обсудим ваши пожелания
                </div>
              </AccordionItem>

              <AccordionItem
                id="3"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>3</span>
                    Проектирование
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  Подготавливаем проектные решения и уточняем требования, чтобы
                  работа шла по согласованной логике и без сюрпризов на площадке
                </div>
              </AccordionItem>

              <AccordionItem
                id="4"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>4</span>
                    Смета и график работ
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  Мы составим смету и график работ и отправим вам на утверждение
                </div>
              </AccordionItem>

              <AccordionItem
                id="5"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>5</span>
                    Подписание договора
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  После утверждения сметы и графика мы подпишем договор и начнем
                  работы
                </div>
              </AccordionItem>

              <AccordionItem
                id="6"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>6</span>
                    Строительство
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  Мы начнем строительство объекта и будем сообщать вам о ходе
                  работ
                </div>
              </AccordionItem>

              <AccordionItem
                id="7"
                className={styles.howWeWorkStep}
                headerClassName={styles.howWeWorkStepHeader}
                toggleClassName={styles.howWeWorkStepToggle}
                header={
                  <h2 className={styles.howWeWorkStepTitle}>
                    <span className={styles.howWeWorkStepNumber}>7</span>
                    Сдача объекта
                  </h2>
                }
              >
                <div className={styles.howWeWorkStepDescription}>
                  Мы сдадим объект и выставим счет
                </div>
              </AccordionItem>
            </AccordionList>
          </div>
          </div>
        </section>
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

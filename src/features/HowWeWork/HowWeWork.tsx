"use client";

import Image from "next/image";
import { AccordionItem, AccordionList } from "@/shared/ui";
import styles from "./HowWeWork.module.scss";

export default function HowWeWork() {
  return (
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
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className={styles.secondColumn}>
          <AccordionList defaultOpenItemId="1" className={styles.howWeWorkSteps}>
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
                  Договор и подготовка к работе
                </h2>
              }
            >
              <div className={styles.howWeWorkStepDescription}>
                После утверждения сметы и графика подписываем договор и
                готовим площадку к началу работ
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
                  Строительство и контроль
                </h2>
              }
            >
              <div className={styles.howWeWorkStepDescription}>
                Ведём строительство и контролируем качество, регулярно
                информируем о статусе
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
                Сдаём объект, закрываем документы и передаём результат
              </div>
            </AccordionItem>
          </AccordionList>
        </div>
      </div>
    </section>
  );
}


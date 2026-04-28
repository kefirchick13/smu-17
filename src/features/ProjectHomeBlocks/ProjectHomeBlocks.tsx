"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import LinkIcon from "@public/icons/link-icon.svg";
import styles from "./ProjectHomeBlocks.module.scss";

export function ProjectHomeBlocks() {

  const [industrialProjectsCount, setIndustrialProjectsCount] = useState(0);
  const [warehouseProjectsCount, setWarehouseProjectsCount] = useState(0);
  const [designProjectsCount, setDesignProjectsCount] = useState(0);

  const setProjectsCount = useCallback(async () => {
    const industrialProjects = await fetch("/api/projects?type=industrial");
    const warehouseProjects = await fetch("/api/projects?type=warehouse");
    const designProjects = await fetch("/api/projects?type=design");
    setIndustrialProjectsCount((await industrialProjects.json()).projects.length);
    setWarehouseProjectsCount((await warehouseProjects.json()).projects.length);
    setDesignProjectsCount((await designProjects.json()).projects.length);
  }, []);

  useEffect(() => { 
    (async () => {
      await setProjectsCount();
    })();
  }, [setProjectsCount]);

  return (
    <section className={styles.homeProjectsTypes}>
    <div className={styles.homeProjectsTypesItemsContainer}>
            <div className={styles.firstColumn}>
              <h1 className={styles.homeProjectsTypesTitle}>
                Что мы строим
              </h1>
              <Link
                href="/projects?type=industrial"
                className={styles.projectTypeContainer}
                style={{
                  backgroundImage: "url('/images/industrial-buildings.jpg')",
                }}
              >
                <div className={styles.projectTypeContent}>
                  <div className={styles.projectTypeContentTitle}>Промышленные объекты</div>
                  <div className={styles.projectTypeContentDescription}>
                    <div className={styles.projectTypeContentAmount}>{industrialProjectsCount} объект(-ов)</div>
                    <div className={styles.projectTypeContentLink}>
                      Смотреть проекты <LinkIcon />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className={styles.secondColumn}>
              <Link href="/projects?type=warehouse" className={styles.projectTypeContainer} style={{ backgroundImage: "url('/images/warehouses.png')", }}>
                <div className={styles.projectTypeContent}>
                  <div className={styles.projectTypeContentTitle}>Складские объекты</div>
                  <div className={styles.projectTypeContentDescription}>
                    <div className={styles.projectTypeContentAmount}>{warehouseProjectsCount} объект(-ов)</div>
                    <div className={styles.projectTypeContentLink} >Смотреть проекты <LinkIcon /></div>
                  </div>
                </div>
              </Link>

              <Link href="/projects?type=design" className={styles.projectTypeContainer} style={{ backgroundImage: "url('/images/design-projects.jpg')", }}>
                <div className={styles.projectTypeContent}>
                  <div className={styles.projectTypeContentTitle}>Проектирование</div>
                  <div className={styles.projectTypeContentDescription}>
                    <div className={styles.projectTypeContentAmount}>{designProjectsCount} объект(-ов)</div>
                    <div className={styles.projectTypeContentLink} >Смотреть проекты <LinkIcon /></div>
                  </div>
                </div>
              </Link>
            </div>
        </div>
    </section>
    );
}
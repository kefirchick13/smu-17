"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import LinkIcon from "@public/icons/link-icon.svg";
import styles from "./ProjectHomeBlocks.module.scss";

export function ProjectHomeBlocks() {

  const [industrialProjectsCount, setIndustrialProjectsCount] = useState(0);
  const [warehouseProjectsCount, setWarehouseProjectsCount] = useState(0);
  const [angarProjectsCount, setAngarProjectsCount] = useState(0);

  const setProjectsCount = useCallback(async () => {
    const industrialProjects = await fetch("/api/projects?type=industrial");
    const warehouseProjects = await fetch("/api/projects?type=warehouse");
    const angarProjects = await fetch("/api/projects?type=angar");
    setIndustrialProjectsCount((await industrialProjects.json()).projects.length);
    setWarehouseProjectsCount((await warehouseProjects.json()).projects.length);
    setAngarProjectsCount((await angarProjects.json()).projects.length);
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
                  backgroundImage: "url('/images/industrial-buildings.png')",
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

              <Link href="/projects?type=angar" className={styles.projectTypeContainer} style={{ backgroundImage: "url('/images/angars.png')", }}>
                <div className={styles.projectTypeContent}>
                  <div className={styles.projectTypeContentTitle}>Ангары</div>
                  <div className={styles.projectTypeContentDescription}>
                    <div className={styles.projectTypeContentAmount}>{angarProjectsCount} объект(-ов)</div>
                    <div className={styles.projectTypeContentLink} >Смотреть проекты <LinkIcon /></div>
                  </div>
                </div>
              </Link>
            </div>
        </div>
    </section>
    );
}
import Link from "next/link";
import styles from "./Footer.module.scss";
import CompanyLogo from "@public/SMU-17.svg";
import {
  COMPANY_ADDRESS_SHORT,
  COMPANY_EMAIL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/shared/constants/companyContacts";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.frameWrapper}>
        <CompanyLogo className={styles.companyLogo} />
      </div>

      <div className={styles.info}>
        <div className={styles.links}>
          <Link className={styles.link} href="/">Главная</Link>
          <Link className={styles.link} href="/projects">Проекты</Link>
          <Link className={styles.link} href="/about">О нас</Link>
        </div>

        <div className={styles.contact}>
          <span className={styles.address}>{COMPANY_ADDRESS_SHORT}</span>
          <a className={styles.phone} href={`tel:${COMPANY_PHONE_TEL}`}>
            {COMPANY_PHONE_DISPLAY}
          </a>
          <a className={styles.email} href={`mailto:${COMPANY_EMAIL}`}>
            {COMPANY_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
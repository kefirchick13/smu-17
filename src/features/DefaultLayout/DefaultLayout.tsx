import { isAdminSession } from "@/features/auth/requireAdmin";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import styles from "./DefaultLayout.module.scss";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminSession();
  return (
    <>
      <Header isAdmin={isAdmin} />
      <div className={styles.main}>
        {children}
      </div>
      <Footer />
    </>
  );
}
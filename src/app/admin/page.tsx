import { logout } from "./actions";
import { AdminProjectsPanel } from "../../features/AdminProjectPanel/admin-projects-panel";
import { getAllProjects } from "@/features/projects/server/getProjects";
import { requireAdmin } from "@/features/auth/requireAdmin";
import { getPool } from "@/features/db/db";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const pool = getPool();
  const dbAvailable = pool !== null;
  const projects = dbAvailable ? await getAllProjects() : [];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Админ-панель</h1>
      <p className={styles.lead}>
        Управление проектами на сайте. Изменения сразу видны на странице
        «Проекты».
      </p>

      <AdminProjectsPanel projects={projects} dbAvailable={dbAvailable} />

      <form className={styles.logoutForm} action={logout}>
        <button className={styles.logoutButton} type="submit">
          Выйти
        </button>
      </form>
    </main>
  );
}

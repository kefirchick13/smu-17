import { LoginForm } from "./login-form";
import styles from "./page.module.scss";

export default async function AdminLoginPage() {


  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход для администраторов</h1>
        <p className={styles.hint}>
          Введите почту и пароль. Данные проверяются в базе.
        </p>
        <LoginForm nextPath={'/'} />
      </div>
    </main>
  );
}

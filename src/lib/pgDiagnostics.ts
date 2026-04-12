export type PgDiagnostics = {
  pgCode?: string;
  summaryRu: string;
  hintRu?: string;
};

function stripSecrets(message: string): string {
  return message.replace(/postgres(ql)?:\/\/[^\s"'<>]+/gi, "postgresql://[скрыто]");
}

/** SQLSTATE из ответа PostgreSQL (5 символов, напр. 28P01). */
function isPostgresProtocolError(
  err: unknown,
): err is { code: string; message: string } {
  if (typeof err !== "object" || err === null) return false;
  const c = (err as { code?: unknown }).code;
  return typeof c === "string" && /^[0-9A-Z]{5}$/.test(c);
}

/**
 * Безопасное описание ошибки подключения/запроса к PostgreSQL для UI и /api/health.
 * Не включает пароли и полные URL.
 */
export function safePgDiagnostics(err: unknown): PgDiagnostics {
  const nodeErr = err as NodeJS.ErrnoException & { cause?: unknown };
  const code = nodeErr?.code;
  const msg = stripSecrets(
    typeof nodeErr?.message === "string" ? nodeErr.message : String(err),
  );

  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return {
      summaryRu:
        "Хост из DATABASE_URL не резолвится (DNS). Проверьте имя сервера.",
      hintRu:
        "Supabase Session pooler: хост вида aws-…-pooler.supabase.com (раздел Connect → Session pooler).",
    };
  }

  if (code === "ECONNREFUSED") {
    return {
      summaryRu: "Подключение отклонено (ECONNREFUSED). Неверный порт или сервис не слушает.",
      hintRu:
        "Pooler Supabase: обычно порт 5432 (session) или 6543 (transaction). Сверьтесь с вкладкой Connect.",
    };
  }

  if (code === "ETIMEDOUT") {
    return {
      summaryRu: "Таймаут сети к базе (ETIMEDOUT).",
      hintRu: "Проверьте файрвол, VPN и что строка подключения скопирована из Supabase.",
    };
  }

  if (isPostgresProtocolError(err)) {
    const pgCode = err.code;
    if (pgCode === "28P01") {
      return {
        pgCode,
        summaryRu:
          "PostgreSQL отклонил логин: неверный пароль или имя пользователя в DATABASE_URL.",
        hintRu:
          "Для Session pooler пользователь должен быть другой. Пароль из Database Settings.",
      };
    }
    if (pgCode === "3D000") {
      return {
        pgCode,
        summaryRu: "Указанная в URL база данных не существует.",
        hintRu: "В Supabase в URI обычно database = postgres.",
      };
    }
    if (pgCode === "28000") {
      return {
        pgCode,
        summaryRu: "Отказ в доступе к роли (invalid authorization specification).",
        hintRu:
          "Проверьте пользователя postgres.<ref> для pooler и актуальный пароль.",
      };
    }
    return {
      pgCode,
      summaryRu: msg.length > 220 ? `${msg.slice(0, 220)}…` : msg,
    };
  }

  if (
    /self[- ]signed|UNABLE_TO_VERIFY_LEAF|SSL SYSCALL|certificate|TLS|ssl/i.test(
      msg,
    ) ||
    code === "DEPTH_ZERO_SELF_SIGNED_CERT"
  ) {
    return {
      summaryRu: "Ошибка TLS/SSL при подключении к PostgreSQL.",
      hintRu:
        "К URL должен быть добавлен ?sslmode=require (для Supabase это делается автоматически, если хост supabase). Проверьте строку в Netlify.",
    };
  }

  return {
    summaryRu: msg.length > 220 ? `${msg.slice(0, 220)}…` : msg,
    hintRu: "Смотрите логи функции и ответ.",
  };
}

/**
 * Для хостов Supabase добавляет sslmode=require, если параметра ещё нет.
 */
export function normalizeDatabaseUrlForSupabase(url: string): string {
  const t = url.trim();
  if (!/supabase\.(co|com|io)\b/i.test(t)) return t;
  if (/[?&]sslmode=/i.test(t)) return t;
  const sep = t.includes("?") ? "&" : "?";
  return `${t}${sep}sslmode=require`;
}

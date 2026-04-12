export type PgDiagnostics = {
  pgCode?: string;
  summaryRu: string;
  hintRu?: string;
};

function stripSecrets(message: string): string {
  return message.replace(/[a-z][a-z0-9+.-]*:\/\/[^\s"'<>]+/gi, "[URI]");
}

/** SQLSTATE из ответа СУБД (5 символов, напр. 28P01). */
function isPgProtocolError(
  err: unknown,
): err is { code: string; message: string } {
  if (typeof err !== "object" || err === null) return false;
  const c = (err as { code?: unknown }).code;
  return typeof c === "string" && /^[0-9A-Z]{5}$/.test(c);
}

/**
 * Безопасное описание ошибки подключения к БД для UI и /api/health.
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
        "Номер порта для session/transaction pooler смотрите в Supabase → Connect (там же готовая строка).",
    };
  }

  if (code === "ETIMEDOUT") {
    return {
      summaryRu: "Таймаут сети к базе (ETIMEDOUT).",
      hintRu: "Проверьте файрвол, VPN и что строка подключения скопирована из Supabase.",
    };
  }

  if (isPgProtocolError(err)) {
    const pgCode = err.code;
    if (pgCode === "28P01") {
      return {
        pgCode,
        summaryRu:
          "Сервер БД отклонил логин: неверный пароль или имя роли в DATABASE_URL.",
        hintRu:
          "Для Session pooler пользователь должен быть другой. Пароль из Database Settings.",
      };
    }
    if (pgCode === "3D000") {
      return {
        pgCode,
        summaryRu: "Указанная в URL база данных не существует.",
        hintRu: "Имя базы в строке подключения должно совпадать с тем, что в мастере Connect.",
      };
    }
    if (pgCode === "28000") {
      return {
        pgCode,
        summaryRu: "Отказ в доступе к роли (invalid authorization specification).",
        hintRu:
          "Сверьте роль и пароль с разделом Connect → pooler в Supabase.",
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
      summaryRu: "Ошибка TLS/SSL при подключении к базе.",
      hintRu: "Проверьте строку подключения и настройки деплоя.",
    };
  }

  return {
    summaryRu: msg.length > 220 ? `${msg.slice(0, 220)}…` : msg,
    hintRu: "Смотрите логи функции и ответ.",
  };
}

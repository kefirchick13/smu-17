"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Project } from "@/features/projects/model/types";
import {
  deleteProjectAction,
  saveProjectAction,
  type AdminProjectFormState,
} from "./project-actions";
import styles from "./admin-projects-panel.module.scss";

type Props = {
  projects: Project[];
  dbAvailable: boolean;
};

function projectToFormDefaults(p: Project) {
  return {
    name: p.name,
    description: p.description ?? "",
    type: p.type,
    status: p.status,
    tags: (p.tags ?? []).join(", "),
    areaM2: p.areaM2 != null ? String(p.areaM2) : "",
    address: p.address ?? "",
    workDateStart: p.workDateStart ?? "",
    workDateEnd: p.workDateEnd ?? "",
    imageSrc: p.imageSrc ?? "",
    galleryRaw: (p.gallerySrc ?? []).join("\n"),
    workStagesRaw: (p.workStages ?? []).join("\n"),
  };
}

export function AdminProjectsPanel({ projects, dbAvailable }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const wasPendingRef = useRef(false);

  const [state, formAction, pending] = useActionState<
    AdminProjectFormState,
    FormData
  >(saveProjectAction, undefined);

  const editingProject =
    editingId != null
      ? projects.find((x) => x.id === editingId)
      : undefined;
  const defaults = editingProject
    ? projectToFormDefaults(editingProject)
    : null;

  useEffect(() => {
    if (pending) {
      wasPendingRef.current = true;
      return;
    }
    if (wasPendingRef.current) {
      wasPendingRef.current = false;
      if (!state?.error) {
        queueMicrotask(() => {
          setEditingId(null);
          formRef.current?.reset();
        });
      }
    }
  }, [pending, state?.error]);

  useEffect(() => {
    if (editingId && !projects.some((p) => p.id === editingId)) {
      queueMicrotask(() => setEditingId(null));
    }
  }, [projects, editingId]);

  const formKey = editingId ?? "create";

  return (
    <div className={styles.wrap}>
      {!dbAvailable ? (
        <p className={styles.warn} role="alert">
          Нет подключения к базе данных — список проектов пуст, добавление и
          удаление недоступны. Проверьте DATABASE_URL.
        </p>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {editingId ? "Редактировать проект" : "Новый проект"}
        </h2>
        <form
          key={formKey}
          ref={formRef}
          className={styles.form}
          action={formAction}
        >
          {editingId ? (
            <input type="hidden" name="projectId" value={editingId} />
          ) : null}
          <label className={styles.label}>
            Название *
            <input
              className={styles.input}
              name="name"
              type="text"
              required
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.name}
            />
          </label>
          <label className={styles.label}>
            Описание
            <textarea
              className={styles.textarea}
              name="description"
              rows={3}
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.description}
            />
          </label>
          <div className={styles.row}>
            <label className={styles.label}>
              Тип *
              <select
                className={styles.select}
                name="type"
                required
                disabled={!dbAvailable || pending}
                defaultValue={defaults?.type ?? "industrial"}
              >
                <option value="industrial">Промышленное здание</option>
                <option value="angar">Ангар</option>
                <option value="warehouse">Склад</option>
              </select>
            </label>
            <label className={styles.label}>
              Статус *
              <select
                className={styles.select}
                name="status"
                required
                disabled={!dbAvailable || pending}
                defaultValue={defaults?.status ?? "in_progress"}
              >
                <option value="in_progress">В работе</option>
                <option value="done">Сдан</option>
              </select>
            </label>
          </div>
          <label className={styles.label}>
            Теги (через запятую)
            <input
              className={styles.input}
              name="tags"
              type="text"
              placeholder="Под ключ, Металлокаркас"
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.tags}
            />
          </label>
          <label className={styles.label}>
            Адрес объекта
            <input
              className={styles.input}
              name="address"
              type="text"
              placeholder="Россия, Ленинградская область, г. Кировск"
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.address}
            />
          </label>
          <label className={styles.label}>
            Площадь, м²
            <input
              className={styles.input}
              name="areaM2"
              type="text"
              inputMode="decimal"
              placeholder="3200"
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.areaM2}
            />
          </label>
          <div className={styles.row}>
            <label className={styles.label}>
              Сроки работ — начало
              <input
                className={styles.input}
                name="workDateStart"
                type="date"
                disabled={!dbAvailable || pending}
                defaultValue={defaults?.workDateStart}
              />
            </label>
            <label className={styles.label}>
              Сроки работ — окончание
              <input
                className={styles.input}
                name="workDateEnd"
                type="date"
                disabled={!dbAvailable || pending}
                defaultValue={defaults?.workDateEnd}
              />
            </label>
          </div>
          <label className={styles.label}>
            Обложка для списка (URL картинки)
            <input
              className={styles.input}
              name="imageSrc"
              type="text"
              inputMode="url"
              placeholder="https://example.com/cover.jpg"
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.imageSrc}
            />
          </label>
          <label className={styles.label}>
            Галерея карточки — несколько картинок (URL)
            <textarea
              className={styles.textarea}
              name="galleryRaw"
              rows={4}
              placeholder={
                "По одному URL на строку или через запятую:\nhttps://example.com/a.jpg\nhttps://example.com/b.jpg"
              }
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.galleryRaw}
            />
            <span className={styles.hint}>
              Если обложка пуста, первый URL из галереи станет обложкой в списке
              проектов.
            </span>
          </label>
          <label className={styles.label}>
            Этапы работы
            <textarea
              className={styles.textarea}
              name="workStagesRaw"
              rows={6}
              placeholder={
                "Один этап — одна строка, например:\nПодготовка площадки\nМонтаж каркаса"
              }
              disabled={!dbAvailable || pending}
              defaultValue={defaults?.workStagesRaw}
            />
          </label>
          {state?.error ? (
            <p className={styles.error} role="alert">
              {state.error}
            </p>
          ) : null}
          <div className={styles.formActions}>
            {editingId ? (
              <button
                type="button"
                className={styles.cancelBtn}
                disabled={!dbAvailable || pending}
                onClick={() => setEditingId(null)}
              >
                Отмена
              </button>
            ) : null}
            <button
              className={styles.submit}
              type="submit"
              disabled={!dbAvailable || pending}
            >
              {pending
                ? "Сохранение…"
                : editingId
                  ? "Сохранить изменения"
                  : "Добавить проект"}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Проекты ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className={styles.empty}>Нет проектов в базе.</p>
        ) : (
          <ul className={styles.list}>
            {projects.map((p) => (
              <li key={p.id} className={styles.listItem}>
                <div className={styles.listMain}>
                  <span className={styles.listName}>{p.name}</span>
                  <span className={styles.listMeta}>
                    {p.type} · {p.status === "done" ? "сдан" : "в работе"}
                    {p.gallerySrc && p.gallerySrc.length > 0
                      ? ` · ${p.gallerySrc.length} в галерее`
                      : ""}
                    {p.workStages && p.workStages.length > 0
                      ? ` · ${p.workStages.length} этапов`
                      : ""}
                  </span>
                </div>
                <div className={styles.listActions}>
                  <button
                    type="button"
                    className={styles.editBtn}
                    disabled={!dbAvailable}
                    onClick={() => setEditingId(p.id)}
                  >
                    Редактировать
                  </button>
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className={styles.danger}
                      disabled={!dbAvailable}
                      aria-label={`Удалить «${p.name}»`}
                    >
                      Удалить
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

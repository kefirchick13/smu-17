"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/requireAdmin";
import {
  deleteProjectById,
  insertProjectFromForm,
  updateProjectFromForm,
  type ProjectFormInput,
} from "@/features/projects/server/projectMutations";

export type AdminProjectFormState = { error?: string } | undefined;

function formDataToProjectInput(formData: FormData): ProjectFormInput {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    type: String(formData.get("type") ?? ""),
    status: String(formData.get("status") ?? ""),
    tagsRaw: String(formData.get("tags") ?? ""),
    areaM2: String(formData.get("areaM2") ?? ""),
    address: String(formData.get("address") ?? ""),
    workDateStart: String(formData.get("workDateStart") ?? ""),
    workDateEnd: String(formData.get("workDateEnd") ?? ""),
    imageSrc: String(formData.get("imageSrc") ?? ""),
    galleryRaw: String(formData.get("galleryRaw") ?? ""),
    workStagesRaw: String(formData.get("workStagesRaw") ?? ""),
  };
}

export async function saveProjectAction(
  _prev: AdminProjectFormState,
  formData: FormData,
): Promise<AdminProjectFormState> {
  await requireAdmin();

  const input = formDataToProjectInput(formData);
  const projectIdRaw = formData.get("projectId");
  const projectId =
    typeof projectIdRaw === "string" && projectIdRaw.trim()
      ? projectIdRaw.trim()
      : null;

  const result = projectId
    ? await updateProjectFromForm(projectId, input)
    : await insertProjectFromForm(input);

  if (!result.ok) {
    return { error: result.error };
  }
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath(`/projects/${result.id}`);
  return undefined;
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string" || !id.trim()) return;
  const result = await deleteProjectById(id);
  if (result.ok) {
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath(`/projects/${id.trim()}`);
  }
}

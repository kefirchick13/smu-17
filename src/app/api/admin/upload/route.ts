import { requireAdmin } from "@/features/auth/requireAdmin";
import { env } from "@/lib/env";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

function getUploadsDir(): string {
  const configured = env("UPLOADS_DIR")?.trim();
  if (configured) return configured;

  // Default: sibling folder outside the project root.
  return path.join(process.cwd(), "..", "smu-17-uploads");
}

function safeExtFromName(name: string): string {
  const ext = path.extname(name).toLowerCase();
  // Keep short common extensions only; otherwise ignore.
  if (!ext || ext.length > 10) return "";
  if (!/^\.[a-z0-9]+$/i.test(ext)) return "";
  return ext;
}

export async function POST(req: Request): Promise<Response> {
  await requireAdmin();

  // Netlify/Vercel serverless filesystems are not persistent and may not allow
  // writing outside the function sandbox. Use external storage instead.
  if (process.env.NETLIFY) {
    return Response.json(
      { error: "not_supported_on_netlify" },
      { status: 501 },
    );
  }

  const form = await req.formData();
  const files = form.getAll("files").filter((x): x is File => x instanceof File);

  if (files.length === 0) {
    return Response.json({ error: "no_files" }, { status: 400 });
  }

  const uploadsDir = getUploadsDir();
  const subdir = "projects";
  const targetDir = path.join(uploadsDir, subdir);
  await mkdir(targetDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const ext = safeExtFromName(file.name);
    const name = `${crypto.randomUUID()}${ext}`;
    const diskPath = path.join(targetDir, name);

    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(diskPath, buf);

    urls.push(`/uploads/${subdir}/${name}`);
  }

  return Response.json({ urls });
}


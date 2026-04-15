import { env } from "@/lib/env";
import { readFile } from "node:fs/promises";
import path from "node:path";

function getUploadsDir(): string {
  const configured = env("UPLOADS_DIR")?.trim();
  if (configured) return configured;
  return path.join(process.cwd(), "..", "smu-17-uploads");
}

function guessContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function isSafeSegment(seg: string): boolean {
  // No traversal, no empty, no weird separators.
  if (!seg) return false;
  if (seg === "." || seg === "..") return false;
  if (seg.includes("\\") || seg.includes("\0")) return false;
  // Keep it reasonably strict.
  return /^[a-zA-Z0-9._-]+$/.test(seg);
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path?: string[] }> },
): Promise<Response> {
  const { path: parts = [] } = await ctx.params;
  if (parts.length === 0 || parts.some((p) => !isSafeSegment(p))) {
    return new Response("Not found", { status: 404 });
  }

  const uploadsDir = getUploadsDir();
  const diskPath = path.join(uploadsDir, ...parts);

  try {
    const buf = await readFile(diskPath);
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": guessContentType(diskPath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}


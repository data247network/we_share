// Cloudflare R2 file upload helper using S3-compatible API

const R2_ENDPOINT = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

/** Upload a file to R2 and return the public URL */
export async function uploadToR2(
  file: File | Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const body = file instanceof File ? await file.arrayBuffer() : file;

  const { createHmac, createHash } = await import("crypto");

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const datetimeStr = now.toISOString().replace(/[:-]/g, "").slice(0, 15) + "Z";

  const url = `${R2_ENDPOINT}/${BUCKET}/${key}`;

  // Simple PUT request – for production, use AWS SDK v3 with @aws-sdk/client-s3
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-amz-date": datetimeStr,
    },
    body: body as BodyInit,
  });

  if (!res.ok) {
    throw new Error(`R2 upload failed: ${res.statusText}`);
  }

  return `${PUBLIC_URL}/${key}`;
}

/** Delete a file from R2 */
export async function deleteFromR2(key: string): Promise<void> {
  const url = `${R2_ENDPOINT}/${BUCKET}/${key}`;
  await fetch(url, { method: "DELETE" });
}

/** Get the public URL for a key */
export function r2Url(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

/** Generate a unique key for uploads */
export function generateKey(prefix: string, filename: string): string {
  const ext = filename.split(".").pop() ?? "jpg";
  const id = crypto.randomUUID();
  return `${prefix}/${id}.${ext}`;
}

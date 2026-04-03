globalThis.process ??= {};
globalThis.process.env ??= {};
import * as path from "node:path";
import { u as ulid } from "./index_BQQDygAS.mjs";
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, u as unwrapResult, b as apiSuccess, h as handleError } from "./error_BF6Eb6os.mjs";
import { a as parseQuery, i as isParseError } from "./parse_4YX0X0po.mjs";
import { ak as mediaListQuery } from "./redirects_BT6R8QAm.mjs";
import { M as MediaRepository } from "./media_CNuKgdRs.mjs";
import { S } from "./index_6RQ4jN5M.mjs";
async function computeContentHash(content) {
  let buf;
  if (content instanceof ArrayBuffer) {
    buf = content;
  } else {
    buf = new ArrayBuffer(content.byteLength);
    new Uint8Array(buf).set(content);
  }
  const hashBuffer = await crypto.subtle.digest("SHA-1", buf);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray, (b) => b.toString(16).padStart(2, "0")).join("");
  return `sha1:${hashHex}`;
}
const SUPPORTED_TYPES = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png"
};
const MAX_ENCODE_WIDTH = 32;
async function decodeJpeg(buffer) {
  const { decode } = await import("./index_CRrblZ-0.mjs").then((n) => n.i);
  const result = decode(buffer, { useTArray: true });
  return { width: result.width, height: result.height, data: result.data };
}
async function decodePng(buffer) {
  const UPNG = (await import("./UPNG_h1_TaUge.mjs").then((n) => n.U)).default;
  const img = UPNG.decode(buffer.buffer);
  const frames = UPNG.toRGBA8(img);
  const rgba = new Uint8Array(frames[0]);
  return { width: img.width, height: img.height, data: rgba };
}
function extractDominantColor(data, width, height) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const len = width * height * 4;
  for (let i = 0; i < len; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  if (count === 0) return "rgb(0,0,0)";
  const avgR = Math.round(r / count);
  const avgG = Math.round(g / count);
  const avgB = Math.round(b / count);
  return `rgb(${avgR},${avgG},${avgB})`;
}
async function generatePlaceholder(buffer, mimeType) {
  const format = SUPPORTED_TYPES[mimeType];
  if (!format) return null;
  try {
    const imageData = format === "jpeg" ? await decodeJpeg(buffer) : await decodePng(buffer);
    const { width, height, data } = imageData;
    if (width === 0 || height === 0) return null;
    let encodePixels;
    let encodeWidth;
    let encodeHeight;
    if (width > MAX_ENCODE_WIDTH) {
      const scale = MAX_ENCODE_WIDTH / width;
      encodeWidth = MAX_ENCODE_WIDTH;
      encodeHeight = Math.max(1, Math.round(height * scale));
      encodePixels = downsample(data, width, height, encodeWidth, encodeHeight);
    } else {
      encodeWidth = width;
      encodeHeight = height;
      encodePixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    }
    const blurhash = S(encodePixels, encodeWidth, encodeHeight, 4, 3);
    const dominantColor = extractDominantColor(data, width, height);
    return { blurhash, dominantColor };
  } catch {
    return null;
  }
}
function downsample(src, srcW, srcH, dstW, dstH) {
  const dst = new Uint8ClampedArray(dstW * dstH * 4);
  for (let y = 0; y < dstH; y++) {
    const srcY = Math.floor(y * srcH / dstH);
    for (let x = 0; x < dstW; x++) {
      const srcX = Math.floor(x * srcW / dstW);
      const srcIdx = (srcY * srcW + srcX) * 4;
      const dstIdx = (y * dstW + x) * 4;
      dst[dstIdx] = src[srcIdx];
      dst[dstIdx + 1] = src[srcIdx + 1];
      dst[dstIdx + 2] = src[srcIdx + 2];
      dst[dstIdx + 3] = src[srcIdx + 3];
    }
  }
  return dst;
}
const prerender = false;
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
function addUrlToMedia(item) {
  return {
    ...item,
    url: `/_emdash/api/media/file/${item.storageKey}`
  };
}
const GET = async ({ request, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "media:read");
  if (denied) return denied;
  if (!emdash?.handleMediaList) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  const url = new URL(request.url);
  const query = parseQuery(url, mediaListQuery);
  if (isParseError(query)) return query;
  const result = await emdash.handleMediaList({
    cursor: query.cursor,
    limit: query.limit,
    mimeType: query.mimeType
  });
  if (!result.success) {
    return unwrapResult(result);
  }
  const itemsWithUrl = result.data.items.map((item) => addUrlToMedia(item));
  return apiSuccess({ items: itemsWithUrl, nextCursor: result.data.nextCursor });
};
const POST = async ({ request, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "media:upload");
  if (denied) return denied;
  if (!emdash?.handleMediaCreate) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!emdash?.storage) {
    return apiError("NO_STORAGE", "Storage not configured", 500);
  }
  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength, 10) > MAX_UPLOAD_SIZE) {
      return apiError("PAYLOAD_TOO_LARGE", "Upload too large", 413);
    }
    const formData = await request.formData();
    const fileEntry = formData.get("file");
    const file = fileEntry instanceof File ? fileEntry : null;
    if (!file) {
      return apiError("NO_FILE", "No file provided", 400);
    }
    const allowedTypes = ["image/", "video/", "audio/", "application/pdf"];
    if (!allowedTypes.some((type) => file.type.startsWith(type))) {
      return apiError("INVALID_TYPE", "File type not allowed", 400);
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return apiError(
        "PAYLOAD_TOO_LARGE",
        `File exceeds maximum size of ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`,
        413
      );
    }
    const buffer = new Uint8Array(await file.arrayBuffer());
    const contentHash = await computeContentHash(buffer);
    const repo = new MediaRepository(emdash.db);
    const existing = await repo.findByContentHash(contentHash);
    if (existing) {
      const itemWithUrl2 = addUrlToMedia(existing);
      return apiSuccess({ item: itemWithUrl2, deduplicated: true });
    }
    const id = ulid();
    const ext = path.extname(file.name) || "";
    const storageKey = `${id}${ext}`;
    await emdash.storage.upload({
      key: storageKey,
      body: buffer,
      contentType: file.type
    });
    const widthEntry = formData.get("width");
    const widthStr = typeof widthEntry === "string" ? widthEntry : null;
    const heightEntry = formData.get("height");
    const heightStr = typeof heightEntry === "string" ? heightEntry : null;
    const width = widthStr ? parseInt(widthStr, 10) : void 0;
    const height = heightStr ? parseInt(heightStr, 10) : void 0;
    const placeholder = file.type.startsWith("image/") ? await generatePlaceholder(buffer, file.type) : null;
    const result = await emdash.handleMediaCreate({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      storageKey,
      contentHash,
      blurhash: placeholder?.blurhash,
      dominantColor: placeholder?.dominantColor,
      authorId: user?.id
    });
    if (!result.success) {
      try {
        await emdash.storage.delete(storageKey);
      } catch {
      }
      return unwrapResult(result);
    }
    const itemWithUrl = addUrlToMedia(result.data.item);
    return apiSuccess({ item: itemWithUrl }, 201);
  } catch (error) {
    return handleError(error, "Upload failed", "UPLOAD_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};

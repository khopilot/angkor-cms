globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as validatePluginIdentifier } from "./validate_Dvrjbe51.mjs";
import { p as pluginManifestSchema, n as normalizeManifestRoute } from "./manifest-schema_B2T43Ro7.mjs";
import { P as PluginStateRepository } from "./state_Doe8vYyM.mjs";
const BLOCK_SIZE = 512;
const BLOCK_SIZE_MASK = 511;
const USTAR_NAME_OFFSET = 0;
const USTAR_NAME_SIZE = 100;
const USTAR_MODE_OFFSET = 100;
const USTAR_MODE_SIZE = 8;
const USTAR_UID_OFFSET = 108;
const USTAR_UID_SIZE = 8;
const USTAR_GID_OFFSET = 116;
const USTAR_GID_SIZE = 8;
const USTAR_SIZE_OFFSET = 124;
const USTAR_SIZE_SIZE = 12;
const USTAR_MTIME_OFFSET = 136;
const USTAR_MTIME_SIZE = 12;
const USTAR_CHECKSUM_OFFSET = 148;
const USTAR_CHECKSUM_SIZE = 8;
const USTAR_TYPEFLAG_OFFSET = 156;
const USTAR_TYPEFLAG_SIZE = 1;
const USTAR_LINKNAME_OFFSET = 157;
const USTAR_LINKNAME_SIZE = 100;
const USTAR_MAGIC_OFFSET = 257;
const USTAR_MAGIC_SIZE = 6;
const USTAR_UNAME_OFFSET = 265;
const USTAR_UNAME_SIZE = 32;
const USTAR_GNAME_OFFSET = 297;
const USTAR_GNAME_SIZE = 32;
const USTAR_PREFIX_OFFSET = 345;
const USTAR_PREFIX_SIZE = 155;
const FILE = "file";
const LINK = "link";
const SYMLINK = "symlink";
const DIRECTORY = "directory";
const FLAGTYPE = {
  "0": FILE,
  "1": LINK,
  "2": SYMLINK,
  "3": "character-device",
  "4": "block-device",
  "5": DIRECTORY,
  "6": "fifo",
  x: "pax-header",
  g: "pax-global-header",
  L: "gnu-long-name",
  K: "gnu-long-link-name"
};
const EMPTY = new Uint8Array(0);
new TextEncoder();
const decoder = new TextDecoder();
function readString(view, offset, size) {
  const end = view.indexOf(0, offset);
  const sliceEnd = end === -1 || end > offset + size ? offset + size : end;
  return decoder.decode(view.subarray(offset, sliceEnd));
}
function readOctal(view, offset, size) {
  let value = 0;
  const end = offset + size;
  for (let i = offset; i < end; i++) {
    const charCode = view[i];
    if (charCode === 0) break;
    if (charCode === 32) continue;
    value = value * 8 + (charCode - 48);
  }
  return value;
}
function readNumeric(view, offset, size) {
  if (view[offset] & 128) {
    let result = 0;
    result = view[offset] & 127;
    for (let i = 1; i < size; i++) result = result * 256 + view[offset + i];
    if (!Number.isSafeInteger(result)) throw new Error("TAR number too large");
    return result;
  }
  return readOctal(view, offset, size);
}
const isBodyless = (header) => header.type === DIRECTORY || header.type === SYMLINK || header.type === LINK || header.type === "character-device" || header.type === "block-device" || header.type === "fifo";
const stripPath = (p, n) => {
  const parts = p.split("/").filter(Boolean);
  return n >= parts.length ? "" : parts.slice(n).join("/");
};
function transformHeader(header, options) {
  const { strip, filter, map } = options;
  if (!strip && !filter && !map) return header;
  const h = { ...header };
  if (strip && strip > 0) {
    const newName = stripPath(h.name, strip);
    if (!newName) return null;
    h.name = h.type === DIRECTORY && !newName.endsWith("/") ? `${newName}/` : newName;
    if (h.linkname) {
      const isAbsolute = h.linkname.startsWith("/");
      if (isAbsolute || h.type === LINK) {
        const stripped = stripPath(h.linkname, strip);
        h.linkname = isAbsolute ? `/${stripped}` || "/" : stripped;
      }
    }
  }
  if (filter?.(h) === false) return null;
  const result = map ? map(h) : h;
  if (result && (!result.name || !result.name.trim() || result.name === "." || result.name === "/")) return null;
  return result;
}
const CHECKSUM_SPACE = 32;
function validateChecksum(block) {
  const stored = readOctal(block, USTAR_CHECKSUM_OFFSET, USTAR_CHECKSUM_SIZE);
  let sum = 0;
  for (let i = 0; i < block.length; i++) if (i >= USTAR_CHECKSUM_OFFSET && i < USTAR_CHECKSUM_OFFSET + USTAR_CHECKSUM_SIZE) sum += CHECKSUM_SPACE;
  else sum += block[i];
  return stored === sum;
}
function parseUstarHeader(block, strict) {
  if (strict && !validateChecksum(block)) throw new Error("Invalid tar header checksum.");
  const typeflag = readString(block, USTAR_TYPEFLAG_OFFSET, USTAR_TYPEFLAG_SIZE);
  const header = {
    name: readString(block, USTAR_NAME_OFFSET, USTAR_NAME_SIZE),
    mode: readOctal(block, USTAR_MODE_OFFSET, USTAR_MODE_SIZE),
    uid: readNumeric(block, USTAR_UID_OFFSET, USTAR_UID_SIZE),
    gid: readNumeric(block, USTAR_GID_OFFSET, USTAR_GID_SIZE),
    size: readNumeric(block, USTAR_SIZE_OFFSET, USTAR_SIZE_SIZE),
    mtime: /* @__PURE__ */ new Date(readNumeric(block, USTAR_MTIME_OFFSET, USTAR_MTIME_SIZE) * 1e3),
    type: FLAGTYPE[typeflag] || FILE,
    linkname: readString(block, USTAR_LINKNAME_OFFSET, USTAR_LINKNAME_SIZE)
  };
  const magic = readString(block, USTAR_MAGIC_OFFSET, USTAR_MAGIC_SIZE);
  if (isBodyless(header)) header.size = 0;
  if (magic.trim() === "ustar") {
    header.uname = readString(block, USTAR_UNAME_OFFSET, USTAR_UNAME_SIZE);
    header.gname = readString(block, USTAR_GNAME_OFFSET, USTAR_GNAME_SIZE);
  }
  if (magic === "ustar") header.prefix = readString(block, USTAR_PREFIX_OFFSET, USTAR_PREFIX_SIZE);
  return header;
}
const PAX_MAPPING = {
  path: ["name", (v) => v],
  linkpath: ["linkname", (v) => v],
  size: ["size", (v) => parseInt(v, 10)],
  mtime: ["mtime", parseFloat],
  uid: ["uid", (v) => parseInt(v, 10)],
  gid: ["gid", (v) => parseInt(v, 10)],
  uname: ["uname", (v) => v],
  gname: ["gname", (v) => v]
};
function parsePax(buffer) {
  const decoder$1 = new TextDecoder("utf-8");
  const overrides = /* @__PURE__ */ Object.create(null);
  const pax = /* @__PURE__ */ Object.create(null);
  let offset = 0;
  while (offset < buffer.length) {
    const spaceIndex = buffer.indexOf(32, offset);
    if (spaceIndex === -1) break;
    const length = parseInt(decoder$1.decode(buffer.subarray(offset, spaceIndex)), 10);
    if (Number.isNaN(length) || length === 0) break;
    const recordEnd = offset + length;
    const [key, value] = decoder$1.decode(buffer.subarray(spaceIndex + 1, recordEnd - 1)).split("=", 2);
    if (key && value !== void 0) {
      pax[key] = value;
      if (Object.hasOwn(PAX_MAPPING, key)) {
        const [targetKey, parser] = PAX_MAPPING[key];
        const parsedValue = parser(value);
        if (typeof parsedValue === "string" || !Number.isNaN(parsedValue)) overrides[targetKey] = parsedValue;
      }
    }
    offset = recordEnd;
  }
  if (Object.keys(pax).length > 0) overrides.pax = pax;
  return overrides;
}
function applyOverrides(header, overrides) {
  if (overrides.name !== void 0) header.name = overrides.name;
  if (overrides.linkname !== void 0) header.linkname = overrides.linkname;
  if (overrides.size !== void 0) header.size = overrides.size;
  if (overrides.mtime !== void 0) header.mtime = /* @__PURE__ */ new Date(overrides.mtime * 1e3);
  if (overrides.uid !== void 0) header.uid = overrides.uid;
  if (overrides.gid !== void 0) header.gid = overrides.gid;
  if (overrides.uname !== void 0) header.uname = overrides.uname;
  if (overrides.gname !== void 0) header.gname = overrides.gname;
  if (overrides.pax) header.pax = Object.assign({}, header.pax ?? {}, overrides.pax);
}
function getMetaParser(type) {
  switch (type) {
    case "pax-global-header":
    case "pax-header":
      return parsePax;
    case "gnu-long-name":
      return (data) => ({ name: readString(data, 0, data.length) });
    case "gnu-long-link-name":
      return (data) => ({ linkname: readString(data, 0, data.length) });
    default:
      return;
  }
}
const INITIAL_CAPACITY = 256;
function createChunkQueue() {
  let chunks = new Array(INITIAL_CAPACITY);
  let capacityMask = chunks.length - 1;
  let head = 0;
  let tail = 0;
  let totalAvailable = 0;
  const consumeFromHead = (count) => {
    const chunk = chunks[head];
    if (count === chunk.length) {
      chunks[head] = EMPTY;
      head = head + 1 & capacityMask;
    } else chunks[head] = chunk.subarray(count);
    totalAvailable -= count;
    if (totalAvailable === 0 && chunks.length > INITIAL_CAPACITY) {
      chunks = new Array(INITIAL_CAPACITY);
      capacityMask = INITIAL_CAPACITY - 1;
      head = 0;
      tail = 0;
    }
  };
  function pull(bytes, callback) {
    if (callback) {
      let fed = 0;
      let remaining$1 = Math.min(bytes, totalAvailable);
      while (remaining$1 > 0) {
        const chunk = chunks[head];
        const toFeed = Math.min(remaining$1, chunk.length);
        const segment = toFeed === chunk.length ? chunk : chunk.subarray(0, toFeed);
        consumeFromHead(toFeed);
        remaining$1 -= toFeed;
        fed += toFeed;
        if (!callback(segment)) break;
      }
      return fed;
    }
    if (totalAvailable < bytes) return null;
    if (bytes === 0) return EMPTY;
    const firstChunk = chunks[head];
    if (firstChunk.length >= bytes) {
      const view = firstChunk.length === bytes ? firstChunk : firstChunk.subarray(0, bytes);
      consumeFromHead(bytes);
      return view;
    }
    const result = new Uint8Array(bytes);
    let copied = 0;
    let remaining = bytes;
    while (remaining > 0) {
      const chunk = chunks[head];
      const toCopy = Math.min(remaining, chunk.length);
      result.set(toCopy === chunk.length ? chunk : chunk.subarray(0, toCopy), copied);
      copied += toCopy;
      remaining -= toCopy;
      consumeFromHead(toCopy);
    }
    return result;
  }
  return {
    push: (chunk) => {
      if (chunk.length === 0) return;
      let nextTail = tail + 1 & capacityMask;
      if (nextTail === head) {
        const oldLen = chunks.length;
        const newLen = oldLen * 2;
        const newChunks = new Array(newLen);
        const count = tail - head + oldLen & oldLen - 1;
        if (head < tail) for (let i = 0; i < count; i++) newChunks[i] = chunks[head + i];
        else if (count > 0) {
          const firstPart = oldLen - head;
          for (let i = 0; i < firstPart; i++) newChunks[i] = chunks[head + i];
          for (let i = 0; i < tail; i++) newChunks[firstPart + i] = chunks[i];
        }
        chunks = newChunks;
        capacityMask = newLen - 1;
        head = 0;
        tail = count;
        nextTail = tail + 1 & capacityMask;
      }
      chunks[tail] = chunk;
      tail = nextTail;
      totalAvailable += chunk.length;
    },
    available: () => totalAvailable,
    peek: (bytes) => {
      if (totalAvailable < bytes) return null;
      if (bytes === 0) return EMPTY;
      const firstChunk = chunks[head];
      if (firstChunk.length >= bytes) return firstChunk.length === bytes ? firstChunk : firstChunk.subarray(0, bytes);
      const result = new Uint8Array(bytes);
      let copied = 0;
      let index = head;
      while (copied < bytes) {
        const chunk = chunks[index];
        const toCopy = Math.min(bytes - copied, chunk.length);
        if (toCopy === chunk.length) result.set(chunk, copied);
        else result.set(chunk.subarray(0, toCopy), copied);
        copied += toCopy;
        index = index + 1 & capacityMask;
      }
      return result;
    },
    discard: (bytes) => {
      if (bytes > totalAvailable) throw new Error("Too many bytes consumed");
      if (bytes === 0) return;
      let remaining = bytes;
      while (remaining > 0) {
        const chunk = chunks[head];
        const toConsume = Math.min(remaining, chunk.length);
        consumeFromHead(toConsume);
        remaining -= toConsume;
      }
    },
    pull
  };
}
const STATE_HEADER = 0;
const STATE_BODY = 1;
const truncateErr = /* @__PURE__ */ new Error("Tar archive is truncated.");
function createUnpacker(options = {}) {
  const strict = options.strict ?? false;
  const { available, peek, push, discard, pull } = createChunkQueue();
  let state = STATE_HEADER;
  let ended = false;
  let done = false;
  let eof = false;
  let currentEntry = null;
  const paxGlobals = {};
  let nextEntryOverrides = {};
  const unpacker = {
    isEntryActive: () => state === STATE_BODY,
    isBodyComplete: () => !currentEntry || currentEntry.remaining === 0,
    write(chunk) {
      if (ended) throw new Error("Archive already ended.");
      push(chunk);
    },
    end() {
      ended = true;
    },
    readHeader() {
      if (state !== STATE_HEADER) throw new Error("Cannot read header while an entry is active");
      if (done) return void 0;
      while (!done) {
        if (available() < BLOCK_SIZE) {
          if (ended) {
            if (available() > 0 && strict) throw truncateErr;
            done = true;
            return;
          }
          return null;
        }
        const headerBlock = peek(BLOCK_SIZE);
        if (isZeroBlock(headerBlock)) {
          if (available() < BLOCK_SIZE * 2) {
            if (ended) {
              if (strict) throw truncateErr;
              done = true;
              return;
            }
            return null;
          }
          if (isZeroBlock(peek(BLOCK_SIZE * 2).subarray(BLOCK_SIZE))) {
            discard(BLOCK_SIZE * 2);
            done = true;
            eof = true;
            return;
          }
          if (strict) throw new Error("Invalid tar header.");
          discard(BLOCK_SIZE);
          continue;
        }
        let internalHeader;
        try {
          internalHeader = parseUstarHeader(headerBlock, strict);
        } catch (err) {
          if (strict) throw err;
          discard(BLOCK_SIZE);
          continue;
        }
        const metaParser = getMetaParser(internalHeader.type);
        if (metaParser) {
          const paddedSize = internalHeader.size + BLOCK_SIZE_MASK & ~BLOCK_SIZE_MASK;
          if (available() < BLOCK_SIZE + paddedSize) {
            if (ended && strict) throw truncateErr;
            return null;
          }
          discard(BLOCK_SIZE);
          const overrides = metaParser(pull(paddedSize).subarray(0, internalHeader.size));
          const target = internalHeader.type === "pax-global-header" ? paxGlobals : nextEntryOverrides;
          for (const key in overrides) target[key] = overrides[key];
          continue;
        }
        discard(BLOCK_SIZE);
        const header = internalHeader;
        if (internalHeader.prefix) header.name = `${internalHeader.prefix}/${header.name}`;
        applyOverrides(header, paxGlobals);
        applyOverrides(header, nextEntryOverrides);
        if (header.name.endsWith("/") && header.type === FILE) header.type = DIRECTORY;
        nextEntryOverrides = {};
        currentEntry = {
          header,
          remaining: header.size,
          padding: -header.size & BLOCK_SIZE_MASK
        };
        state = STATE_BODY;
        return header;
      }
    },
    streamBody(callback) {
      if (state !== STATE_BODY || !currentEntry || currentEntry.remaining === 0) return 0;
      const bytesToFeed = Math.min(currentEntry.remaining, available());
      if (bytesToFeed === 0) return 0;
      const fed = pull(bytesToFeed, callback);
      currentEntry.remaining -= fed;
      return fed;
    },
    skipPadding() {
      if (state !== STATE_BODY || !currentEntry) return true;
      if (currentEntry.remaining > 0) throw new Error("Body not fully consumed");
      if (available() < currentEntry.padding) return false;
      discard(currentEntry.padding);
      currentEntry = null;
      state = STATE_HEADER;
      return true;
    },
    skipEntry() {
      if (state !== STATE_BODY || !currentEntry) return true;
      const toDiscard = Math.min(currentEntry.remaining, available());
      if (toDiscard > 0) {
        discard(toDiscard);
        currentEntry.remaining -= toDiscard;
      }
      if (currentEntry.remaining > 0) return false;
      return unpacker.skipPadding();
    },
    validateEOF() {
      if (strict) {
        if (!eof) throw truncateErr;
        if (available() > 0) {
          if (pull(available()).some((byte) => byte !== 0)) throw new Error("Invalid EOF.");
        }
      }
    }
  };
  return unpacker;
}
function isZeroBlock(block) {
  if (block.byteOffset % 8 === 0) {
    const view = new BigUint64Array(block.buffer, block.byteOffset, block.length / 8);
    for (let i = 0; i < view.length; i++) if (view[i] !== 0n) return false;
    return true;
  }
  for (let i = 0; i < block.length; i++) if (block[i] !== 0) return false;
  return true;
}
function createGzipDecoder() {
  return new DecompressionStream("gzip");
}
async function streamToBuffer(stream) {
  const chunks = [];
  const reader = stream.getReader();
  let totalLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalLength += value.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  } finally {
    reader.releaseLock();
  }
}
const drain = (stream) => stream.pipeTo(new WritableStream());
function createTarDecoder(options = {}) {
  const unpacker = createUnpacker(options);
  let bodyController = null;
  let pumping = false;
  const pump = (controller) => {
    if (pumping) return;
    pumping = true;
    try {
      while (true) if (unpacker.isEntryActive()) {
        if (bodyController) {
          if (unpacker.streamBody((c) => (bodyController.enqueue(c), true)) === 0 && !unpacker.isBodyComplete()) break;
        } else if (!unpacker.skipEntry()) break;
        if (unpacker.isBodyComplete()) {
          try {
            bodyController?.close();
          } catch {
          }
          bodyController = null;
          if (!unpacker.skipPadding()) break;
        }
      } else {
        const header = unpacker.readHeader();
        if (header === null || header === void 0) break;
        controller.enqueue({
          header,
          body: new ReadableStream({
            start(c) {
              if (header.size === 0) c.close();
              else bodyController = c;
            },
            pull: () => pump(controller),
            cancel() {
              bodyController = null;
              pump(controller);
            }
          })
        });
      }
    } catch (error) {
      try {
        bodyController?.error(error);
      } catch {
      }
      bodyController = null;
      throw error;
    } finally {
      pumping = false;
    }
  };
  return new TransformStream({
    transform(chunk, controller) {
      try {
        unpacker.write(chunk);
        pump(controller);
      } catch (error) {
        try {
          bodyController?.error(error);
        } catch {
        }
        throw error;
      }
    },
    flush(controller) {
      try {
        unpacker.end();
        pump(controller);
        unpacker.validateEOF();
        if (unpacker.isEntryActive() && !unpacker.isBodyComplete()) try {
          bodyController?.close();
        } catch {
        }
      } catch (error) {
        try {
          bodyController?.error(error);
        } catch {
        }
        throw error;
      }
    }
  }, void 0, { highWaterMark: 1 });
}
async function unpackTar(archive, options = {}) {
  const sourceStream = archive instanceof ReadableStream ? archive : new ReadableStream({ start(controller) {
    controller.enqueue(archive instanceof Uint8Array ? archive : new Uint8Array(archive));
    controller.close();
  } });
  const results = [];
  const entryStream = sourceStream.pipeThrough(createTarDecoder(options));
  for await (const entry of entryStream) {
    let processedHeader;
    try {
      processedHeader = transformHeader(entry.header, options);
    } catch (error) {
      await entry.body.cancel();
      throw error;
    }
    if (processedHeader === null) {
      await drain(entry.body);
      continue;
    }
    if (isBodyless(processedHeader)) {
      await drain(entry.body);
      results.push({ header: processedHeader });
    } else results.push({
      header: processedHeader,
      data: await streamToBuffer(entry.body)
    });
  }
  return results;
}
const TRAILING_SLASHES = /\/+$/;
const LEADING_DOT_SLASH = /^\.\//;
class MarketplaceError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "MarketplaceError";
  }
}
class MarketplaceUnavailableError extends MarketplaceError {
  constructor(cause) {
    super("Plugin marketplace is unavailable", void 0, "MARKETPLACE_UNAVAILABLE");
    if (cause) this.cause = cause;
  }
}
class MarketplaceClientImpl {
  baseUrl;
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(TRAILING_SLASHES, "");
  }
  async search(query, opts) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (opts?.category) params.set("category", opts.category);
    if (opts?.capability) params.set("capability", opts.capability);
    if (opts?.sort) params.set("sort", opts.sort);
    if (opts?.cursor) params.set("cursor", opts.cursor);
    if (opts?.limit) params.set("limit", String(opts.limit));
    const qs = params.toString();
    const url = `${this.baseUrl}/api/v1/plugins${qs ? `?${qs}` : ""}`;
    const data = await this.fetchJson(url);
    return data;
  }
  async getPlugin(id) {
    const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}`;
    return this.fetchJson(url);
  }
  async getVersions(id) {
    const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/versions`;
    const data = await this.fetchJson(url);
    return data.items;
  }
  async downloadBundle(id, version) {
    const bundleUrl = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}/bundle`;
    let response;
    try {
      response = await fetch(bundleUrl, {
        redirect: "follow"
      });
    } catch (err) {
      throw new MarketplaceUnavailableError(err);
    }
    if (!response.ok) {
      throw new MarketplaceError(
        `Failed to download bundle: ${response.status} ${response.statusText}`,
        response.status,
        "BUNDLE_DOWNLOAD_FAILED"
      );
    }
    const tarballBytes = new Uint8Array(await response.arrayBuffer());
    try {
      return await extractBundle(tarballBytes);
    } catch (err) {
      if (err instanceof MarketplaceError) throw err;
      throw new MarketplaceError(
        "Failed to extract plugin bundle",
        void 0,
        "BUNDLE_EXTRACT_FAILED"
      );
    }
  }
  async reportInstall(id, version) {
    const siteHash = await generateSiteHash();
    const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/installs`;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteHash, version })
      });
    } catch {
    }
  }
  async searchThemes(query, opts) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (opts?.keyword) params.set("keyword", opts.keyword);
    if (opts?.sort) params.set("sort", opts.sort);
    if (opts?.cursor) params.set("cursor", opts.cursor);
    if (opts?.limit) params.set("limit", String(opts.limit));
    const qs = params.toString();
    const url = `${this.baseUrl}/api/v1/themes${qs ? `?${qs}` : ""}`;
    return this.fetchJson(url);
  }
  async getTheme(id) {
    const url = `${this.baseUrl}/api/v1/themes/${encodeURIComponent(id)}`;
    return this.fetchJson(url);
  }
  async fetchJson(url) {
    let response;
    try {
      response = await fetch(url, {
        headers: { Accept: "application/json" }
      });
    } catch (err) {
      throw new MarketplaceUnavailableError(err);
    }
    if (!response.ok) {
      let errorMessage = `Marketplace request failed: ${response.status}`;
      try {
        const body = await response.json();
        if (body.error) errorMessage = body.error;
      } catch {
      }
      throw new MarketplaceError(errorMessage, response.status);
    }
    const data = await response.json();
    return data;
  }
}
async function extractBundle(tarballBytes) {
  const decompressedStream = new ReadableStream({
    start(controller) {
      controller.enqueue(tarballBytes);
      controller.close();
    }
  }).pipeThrough(createGzipDecoder());
  const decompressedBuf = await new Response(decompressedStream).arrayBuffer();
  const decompressedBytes = new Uint8Array(decompressedBuf);
  const decompressed = new ReadableStream({
    start(controller) {
      controller.enqueue(decompressedBytes);
      controller.close();
    }
  });
  const entries = await unpackTar(decompressed);
  const decoder2 = new TextDecoder();
  const files = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (entry.data && entry.header.type === "file") {
      const name = entry.header.name.replace(LEADING_DOT_SLASH, "");
      files.set(name, decoder2.decode(entry.data));
    }
  }
  const manifestJson = files.get("manifest.json");
  const backendCode = files.get("backend.js");
  if (!manifestJson) {
    throw new MarketplaceError(
      "Invalid bundle: missing manifest.json",
      void 0,
      "INVALID_BUNDLE"
    );
  }
  if (!backendCode) {
    throw new MarketplaceError("Invalid bundle: missing backend.js", void 0, "INVALID_BUNDLE");
  }
  let manifest;
  try {
    const parsed = JSON.parse(manifestJson);
    const result = pluginManifestSchema.safeParse(parsed);
    if (!result.success) {
      throw new MarketplaceError(
        "Invalid bundle: manifest.json failed validation",
        void 0,
        "INVALID_BUNDLE"
      );
    }
    manifest = result.data;
  } catch (err) {
    if (err instanceof MarketplaceError) throw err;
    throw new MarketplaceError(
      "Invalid bundle: malformed manifest.json",
      void 0,
      "INVALID_BUNDLE"
    );
  }
  const hashBuffer = await crypto.subtle.digest("SHA-256", tarballBytes);
  const hashArray = new Uint8Array(hashBuffer);
  const checksum = Array.from(hashArray, (b) => b.toString(16).padStart(2, "0")).join("");
  return {
    manifest,
    backendCode,
    adminCode: files.get("admin.js"),
    checksum
  };
}
async function generateSiteHash() {
  const seed = `emdash-${Date.now()}`;
  try {
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
    const arr = new Uint8Array(hash);
    return Array.from(arr.slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return Math.random().toString(36).slice(2, 18);
  }
}
function createMarketplaceClient(baseUrl) {
  return new MarketplaceClientImpl(baseUrl);
}
class EmDashStorageError extends Error {
  constructor(message, code, cause) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "EmDashStorageError";
  }
}
const VERSION_PATTERN = /^[a-z0-9][a-z0-9._+-]*$/i;
function validateVersion(version) {
  if (version.includes("..")) throw new Error("Invalid version format");
  if (!VERSION_PATTERN.test(version)) {
    throw new Error("Invalid version format");
  }
}
function getClient(marketplaceUrl) {
  if (!marketplaceUrl) return null;
  return createMarketplaceClient(marketplaceUrl);
}
function diffCapabilities(oldCaps, newCaps) {
  const oldSet = new Set(oldCaps);
  const newSet = new Set(newCaps);
  return {
    added: newCaps.filter((c) => !oldSet.has(c)),
    removed: oldCaps.filter((c) => !newSet.has(c))
  };
}
function diffRouteVisibility(oldManifest, newManifest) {
  const oldPublicRoutes = /* @__PURE__ */ new Set();
  if (oldManifest) {
    for (const entry of oldManifest.routes) {
      const normalized = normalizeManifestRoute(entry);
      if (normalized.public === true) {
        oldPublicRoutes.add(normalized.name);
      }
    }
  }
  const newlyPublic = [];
  for (const entry of newManifest.routes) {
    const normalized = normalizeManifestRoute(entry);
    if (normalized.public === true && !oldPublicRoutes.has(normalized.name)) {
      newlyPublic.push(normalized.name);
    }
  }
  return { newlyPublic };
}
async function resolveVersionMetadata(client, pluginId, pluginDetail, version) {
  if (pluginDetail.latestVersion?.version === version) {
    return {
      version: pluginDetail.latestVersion.version,
      minEmDashVersion: pluginDetail.latestVersion.minEmDashVersion,
      bundleSize: pluginDetail.latestVersion.bundleSize,
      checksum: pluginDetail.latestVersion.checksum,
      changelog: pluginDetail.latestVersion.changelog,
      capabilities: pluginDetail.latestVersion.capabilities,
      status: pluginDetail.latestVersion.status,
      auditVerdict: pluginDetail.latestVersion.audit?.verdict ?? null,
      imageAuditVerdict: pluginDetail.latestVersion.imageAudit?.verdict ?? null,
      publishedAt: pluginDetail.latestVersion.publishedAt
    };
  }
  const versions = await client.getVersions(pluginId);
  return versions.find((v) => v.version === version) ?? null;
}
function validateBundleIdentity(bundle, pluginId, version) {
  if (bundle.manifest.id !== pluginId) {
    return {
      success: false,
      error: {
        code: "MANIFEST_MISMATCH",
        message: `Bundle manifest ID (${bundle.manifest.id}) does not match requested plugin (${pluginId})`
      }
    };
  }
  if (bundle.manifest.version !== version) {
    return {
      success: false,
      error: {
        code: "MANIFEST_VERSION_MISMATCH",
        message: `Bundle manifest version (${bundle.manifest.version}) does not match requested version (${version})`
      }
    };
  }
  return null;
}
async function storeBundleInR2(storage, pluginId, version, bundle) {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = `marketplace/${pluginId}/${version}`;
  await storage.upload({
    key: `${prefix}/manifest.json`,
    body: new TextEncoder().encode(JSON.stringify(bundle.manifest)),
    contentType: "application/json"
  });
  await storage.upload({
    key: `${prefix}/backend.js`,
    body: new TextEncoder().encode(bundle.backendCode),
    contentType: "application/javascript"
  });
  if (bundle.adminCode) {
    await storage.upload({
      key: `${prefix}/admin.js`,
      body: new TextEncoder().encode(bundle.adminCode),
      contentType: "application/javascript"
    });
  }
}
async function streamToText(stream) {
  return new Response(stream).text();
}
async function loadBundleFromR2(storage, pluginId, version) {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = `marketplace/${pluginId}/${version}`;
  try {
    const manifestResult = await storage.download(`${prefix}/manifest.json`);
    const backendResult = await storage.download(`${prefix}/backend.js`);
    const manifestText = await streamToText(manifestResult.body);
    const backendCode = await streamToText(backendResult.body);
    const parsed = JSON.parse(manifestText);
    const result = pluginManifestSchema.safeParse(parsed);
    if (!result.success) return null;
    const manifest = result.data;
    let adminCode;
    try {
      const adminResult = await storage.download(`${prefix}/admin.js`);
      adminCode = await streamToText(adminResult.body);
    } catch {
    }
    return { manifest, backendCode, adminCode };
  } catch {
    return null;
  }
}
async function deleteBundleFromR2(storage, pluginId, version) {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = `marketplace/${pluginId}/${version}`;
  const files = ["manifest.json", "backend.js", "admin.js"];
  for (const file of files) {
    try {
      await storage.delete(`${prefix}/${file}`);
    } catch {
    }
  }
}
async function handleMarketplaceInstall(db, storage, sandboxRunner, marketplaceUrl, pluginId, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: {
        code: "MARKETPLACE_NOT_CONFIGURED",
        message: "Marketplace is not configured"
      }
    };
  }
  if (!storage) {
    return {
      success: false,
      error: {
        code: "STORAGE_NOT_CONFIGURED",
        message: "Storage is required for marketplace plugin installation"
      }
    };
  }
  if (!sandboxRunner || !sandboxRunner.isAvailable()) {
    return {
      success: false,
      error: {
        code: "SANDBOX_NOT_AVAILABLE",
        message: "Sandbox runner is required for marketplace plugins"
      }
    };
  }
  try {
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (existing && existing.source === "marketplace") {
      return {
        success: false,
        error: {
          code: "ALREADY_INSTALLED",
          message: `Plugin ${pluginId} is already installed`
        }
      };
    }
    if (opts?.configuredPluginIds?.has(pluginId)) {
      return {
        success: false,
        error: {
          code: "PLUGIN_ID_CONFLICT",
          message: `Cannot install marketplace plugin "${pluginId}" — a configured plugin with the same ID already exists`
        }
      };
    }
    const pluginDetail = await client.getPlugin(pluginId);
    const version = opts?.version ?? pluginDetail.latestVersion?.version;
    if (!version) {
      return {
        success: false,
        error: {
          code: "NO_VERSION",
          message: `No published versions found for plugin ${pluginId}`
        }
      };
    }
    const versionMetadata = await resolveVersionMetadata(client, pluginId, pluginDetail, version);
    if (!versionMetadata) {
      return {
        success: false,
        error: {
          code: "NO_VERSION",
          message: `Version ${version} was not found for plugin ${pluginId}`
        }
      };
    }
    if (versionMetadata.auditVerdict === "fail" || versionMetadata.auditVerdict === "warn") {
      return {
        success: false,
        error: {
          code: "AUDIT_FAILED",
          message: versionMetadata.auditVerdict === "fail" ? "Plugin failed security audit and cannot be installed" : "Plugin audit was inconclusive and cannot be installed until reviewed"
        }
      };
    }
    const bundle = await client.downloadBundle(pluginId, version);
    if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) {
      return {
        success: false,
        error: {
          code: "CHECKSUM_MISMATCH",
          message: "Bundle checksum does not match marketplace record. Download may be corrupted."
        }
      };
    }
    const bundleIdentityError = validateBundleIdentity(bundle, pluginId, version);
    if (bundleIdentityError) return bundleIdentityError;
    await storeBundleInR2(storage, pluginId, version, bundle);
    await stateRepo.upsert(pluginId, version, "active", {
      source: "marketplace",
      marketplaceVersion: version,
      displayName: pluginDetail.name,
      description: pluginDetail.description ?? void 0
    });
    client.reportInstall(pluginId, version).catch(() => {
    });
    return {
      success: true,
      data: {
        pluginId,
        version,
        capabilities: bundle.manifest.capabilities
      }
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: {
          code: "MARKETPLACE_UNAVAILABLE",
          message: "Plugin marketplace is currently unavailable"
        }
      };
    }
    if (err instanceof MarketplaceError) {
      return {
        success: false,
        error: {
          code: err.code ?? "MARKETPLACE_ERROR",
          message: err.message
        }
      };
    }
    if (err instanceof EmDashStorageError) {
      return {
        success: false,
        error: {
          code: err.code ?? "STORAGE_ERROR",
          message: "Storage error while installing plugin"
        }
      };
    }
    if (err && typeof err === "object" && "code" in err) {
      const code = err.code;
      if (typeof code === "string" && code.trim()) {
        return {
          success: false,
          error: {
            code,
            message: "Failed to install plugin from marketplace"
          }
        };
      }
    }
    console.error("Failed to install marketplace plugin:", err);
    return {
      success: false,
      error: {
        code: "INSTALL_FAILED",
        message: "Failed to install plugin from marketplace"
      }
    };
  }
}
async function handleMarketplaceUpdate(db, storage, sandboxRunner, marketplaceUrl, pluginId, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" }
    };
  }
  if (!storage) {
    return {
      success: false,
      error: { code: "STORAGE_NOT_CONFIGURED", message: "Storage is required" }
    };
  }
  if (!sandboxRunner || !sandboxRunner.isAvailable()) {
    return {
      success: false,
      error: { code: "SANDBOX_NOT_AVAILABLE", message: "Sandbox runner is required" }
    };
  }
  try {
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (!existing || existing.source !== "marketplace") {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `No marketplace plugin found: ${pluginId}`
        }
      };
    }
    const oldVersion = existing.marketplaceVersion ?? existing.version;
    const pluginDetail = await client.getPlugin(pluginId);
    const newVersion = opts?.version ?? pluginDetail.latestVersion?.version;
    if (!newVersion) {
      return {
        success: false,
        error: { code: "NO_VERSION", message: "No newer version available" }
      };
    }
    if (newVersion === oldVersion) {
      return {
        success: false,
        error: { code: "ALREADY_UP_TO_DATE", message: "Plugin is already up to date" }
      };
    }
    const versionMetadata = await resolveVersionMetadata(
      client,
      pluginId,
      pluginDetail,
      newVersion
    );
    if (!versionMetadata) {
      return {
        success: false,
        error: {
          code: "NO_VERSION",
          message: `Version ${newVersion} was not found for plugin ${pluginId}`
        }
      };
    }
    const bundle = await client.downloadBundle(pluginId, newVersion);
    if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) {
      return {
        success: false,
        error: {
          code: "CHECKSUM_MISMATCH",
          message: "Bundle checksum does not match marketplace record. Download may be corrupted."
        }
      };
    }
    const bundleIdentityError = validateBundleIdentity(bundle, pluginId, newVersion);
    if (bundleIdentityError) return bundleIdentityError;
    const oldBundle = await loadBundleFromR2(storage, pluginId, oldVersion);
    const oldCaps = oldBundle?.manifest.capabilities ?? [];
    const capabilityChanges = diffCapabilities(oldCaps, bundle.manifest.capabilities);
    const hasEscalation = capabilityChanges.added.length > 0;
    if (hasEscalation && !opts?.confirmCapabilityChanges) {
      return {
        success: false,
        error: {
          code: "CAPABILITY_ESCALATION",
          message: "Plugin update requires new capabilities",
          details: { capabilityChanges }
        }
      };
    }
    const routeVisibilityChanges = diffRouteVisibility(oldBundle?.manifest, bundle.manifest);
    const hasNewPublicRoutes = routeVisibilityChanges.newlyPublic.length > 0;
    if (hasNewPublicRoutes && !opts?.confirmRouteVisibilityChanges) {
      return {
        success: false,
        error: {
          code: "ROUTE_VISIBILITY_ESCALATION",
          message: "Plugin update exposes new public (unauthenticated) routes",
          details: { routeVisibilityChanges, capabilityChanges }
        }
      };
    }
    await storeBundleInR2(storage, pluginId, newVersion, bundle);
    await stateRepo.upsert(pluginId, newVersion, "active", {
      source: "marketplace",
      marketplaceVersion: newVersion,
      displayName: pluginDetail.name,
      description: pluginDetail.description ?? void 0
    });
    deleteBundleFromR2(storage, pluginId, oldVersion).catch(() => {
    });
    return {
      success: true,
      data: {
        pluginId,
        oldVersion,
        newVersion,
        capabilityChanges,
        routeVisibilityChanges: hasNewPublicRoutes ? routeVisibilityChanges : void 0
      }
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" }
      };
    }
    if (err instanceof MarketplaceError) {
      return {
        success: false,
        error: { code: err.code ?? "MARKETPLACE_ERROR", message: err.message }
      };
    }
    console.error("Failed to update marketplace plugin:", err);
    return {
      success: false,
      error: { code: "UPDATE_FAILED", message: "Failed to update plugin" }
    };
  }
}
async function handleMarketplaceUninstall(db, storage, pluginId, opts) {
  try {
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (!existing || existing.source !== "marketplace") {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `No marketplace plugin found: ${pluginId}`
        }
      };
    }
    const version = existing.marketplaceVersion ?? existing.version;
    if (storage) {
      await deleteBundleFromR2(storage, pluginId, version);
    }
    let dataDeleted = false;
    if (opts?.deleteData) {
      try {
        await db.deleteFrom("_plugin_storage").where("plugin_id", "=", pluginId).execute();
        dataDeleted = true;
      } catch {
      }
    }
    await stateRepo.delete(pluginId);
    return {
      success: true,
      data: { pluginId, dataDeleted }
    };
  } catch (err) {
    console.error("Failed to uninstall marketplace plugin:", err);
    return {
      success: false,
      error: {
        code: "UNINSTALL_FAILED",
        message: "Failed to uninstall plugin"
      }
    };
  }
}
async function handleMarketplaceUpdateCheck(db, marketplaceUrl) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" }
    };
  }
  try {
    const stateRepo = new PluginStateRepository(db);
    const marketplacePlugins = await stateRepo.getMarketplacePlugins();
    const items = [];
    for (const plugin of marketplacePlugins) {
      try {
        const detail = await client.getPlugin(plugin.pluginId);
        const latest = detail.latestVersion?.version;
        const installed = plugin.marketplaceVersion ?? plugin.version;
        if (!latest) continue;
        const hasUpdate = latest !== installed;
        let capabilityChanges;
        let hasCapabilityChanges = false;
        if (hasUpdate && detail.latestVersion) {
          const oldCaps = detail.capabilities ?? [];
          const newCaps = detail.latestVersion.capabilities ?? [];
          capabilityChanges = diffCapabilities(oldCaps, newCaps);
          hasCapabilityChanges = capabilityChanges.added.length > 0 || capabilityChanges.removed.length > 0;
        }
        items.push({
          pluginId: plugin.pluginId,
          installed,
          latest: latest ?? installed,
          hasUpdate,
          hasCapabilityChanges,
          capabilityChanges: hasCapabilityChanges ? capabilityChanges : void 0,
          // Route visibility changes require downloading both bundles to compare
          // manifests, which is too expensive for a preview check. The actual
          // enforcement happens at update time in handleMarketplaceUpdate.
          hasRouteVisibilityChanges: false
        });
      } catch (err) {
        console.warn(`Failed to check updates for ${plugin.pluginId}:`, err);
      }
    }
    return { success: true, data: { items } };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" }
      };
    }
    console.error("Failed to check marketplace updates:", err);
    return {
      success: false,
      error: { code: "UPDATE_CHECK_FAILED", message: "Failed to check for updates" }
    };
  }
}
async function handleMarketplaceSearch(marketplaceUrl, query, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" }
    };
  }
  try {
    const result = await client.search(query, opts);
    return { success: true, data: result };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" }
      };
    }
    console.error("Failed to search marketplace:", err);
    return {
      success: false,
      error: { code: "SEARCH_FAILED", message: "Failed to search marketplace" }
    };
  }
}
async function handleMarketplaceGetPlugin(marketplaceUrl, pluginId) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" }
    };
  }
  try {
    const result = await client.getPlugin(pluginId);
    return { success: true, data: result };
  } catch (err) {
    if (err instanceof MarketplaceError && err.status === 404) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Plugin not found: ${pluginId}` }
      };
    }
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" }
      };
    }
    console.error("Failed to get marketplace plugin:", err);
    return {
      success: false,
      error: { code: "GET_PLUGIN_FAILED", message: "Failed to get plugin details" }
    };
  }
}
async function handleThemeSearch(marketplaceUrl, query, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" }
    };
  }
  try {
    const result = await client.searchThemes(query, opts);
    return { success: true, data: result };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" }
      };
    }
    console.error("Failed to search themes:", err);
    return {
      success: false,
      error: { code: "THEME_SEARCH_FAILED", message: "Failed to search themes" }
    };
  }
}
async function handleThemeGetDetail(marketplaceUrl, themeId) {
  const client = getClient(marketplaceUrl);
  if (!client) {
    return {
      success: false,
      error: { code: "MARKETPLACE_NOT_CONFIGURED", message: "Marketplace is not configured" }
    };
  }
  try {
    const result = await client.getTheme(themeId);
    return { success: true, data: result };
  } catch (err) {
    if (err instanceof MarketplaceError && err.status === 404) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Theme not found: ${themeId}` }
      };
    }
    if (err instanceof MarketplaceUnavailableError) {
      return {
        success: false,
        error: { code: "MARKETPLACE_UNAVAILABLE", message: "Marketplace is unavailable" }
      };
    }
    console.error("Failed to get marketplace theme:", err);
    return {
      success: false,
      error: { code: "GET_THEME_FAILED", message: "Failed to get theme details" }
    };
  }
}
export {
  handleMarketplaceGetPlugin as a,
  handleMarketplaceSearch as b,
  handleMarketplaceUpdateCheck as c,
  handleMarketplaceUninstall as d,
  handleMarketplaceUpdate as e,
  handleThemeGetDetail as f,
  handleThemeSearch as g,
  handleMarketplaceInstall as h
};

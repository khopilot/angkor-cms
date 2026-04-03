globalThis.process ??= {};
globalThis.process.env ??= {};
import { Q as decodeBase64urlIgnorePadding$1, j as encodeBase64urlNoPadding } from "./sequence_DzjOVBrG.mjs";
class BigEndian {
  uint8(data, offset) {
    if (data.byteLength < offset + 1) {
      throw new TypeError("Insufficient bytes");
    }
    return data[offset];
  }
  uint16(data, offset) {
    if (data.byteLength < offset + 2) {
      throw new TypeError("Insufficient bytes");
    }
    return data[offset] << 8 | data[offset + 1];
  }
  uint32(data, offset) {
    if (data.byteLength < offset + 4) {
      throw new TypeError("Insufficient bytes");
    }
    let result = 0;
    for (let i = 0; i < 4; i++) {
      result |= data[offset + i] << 24 - i * 8;
    }
    return result;
  }
  uint64(data, offset) {
    if (data.byteLength < offset + 8) {
      throw new TypeError("Insufficient bytes");
    }
    let result = 0n;
    for (let i = 0; i < 8; i++) {
      result |= BigInt(data[offset + i]) << BigInt(56 - i * 8);
    }
    return result;
  }
  putUint8(target, value, offset) {
    if (target.length < offset + 1) {
      throw new TypeError("Not enough space");
    }
    if (value < 0 || value > 255) {
      throw new TypeError("Invalid uint8 value");
    }
    target[offset] = value;
  }
  putUint16(target, value, offset) {
    if (target.length < offset + 2) {
      throw new TypeError("Not enough space");
    }
    if (value < 0 || value > 65535) {
      throw new TypeError("Invalid uint16 value");
    }
    target[offset] = value >> 8;
    target[offset + 1] = value & 255;
  }
  putUint32(target, value, offset) {
    if (target.length < offset + 4) {
      throw new TypeError("Not enough space");
    }
    if (value < 0 || value > 4294967295) {
      throw new TypeError("Invalid uint32 value");
    }
    for (let i = 0; i < 4; i++) {
      target[offset + i] = value >> (3 - i) * 8 & 255;
    }
  }
  putUint64(target, value, offset) {
    if (target.length < offset + 8) {
      throw new TypeError("Not enough space");
    }
    if (value < 0 || value > 18446744073709551615n) {
      throw new TypeError("Invalid uint64 value");
    }
    for (let i = 0; i < 8; i++) {
      target[offset + i] = Number(value >> BigInt((7 - i) * 8) & 0xffn);
    }
  }
}
const bigEndian = new BigEndian();
function compareBytes(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  for (let i = 0; i < b.byteLength; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
class DynamicBuffer {
  value;
  capacity;
  length = 0;
  constructor(capacity) {
    this.value = new Uint8Array(capacity);
    this.capacity = capacity = capacity;
  }
  write(bytes) {
    if (this.length + bytes.byteLength <= this.capacity) {
      this.value.set(bytes, this.length);
      this.length += bytes.byteLength;
      return;
    }
    while (this.length + bytes.byteLength > this.capacity) {
      if (this.capacity === 0) {
        this.capacity = 1;
      } else {
        this.capacity = this.capacity * 2;
      }
    }
    const newValue = new Uint8Array(this.capacity);
    newValue.set(this.value.subarray(0, this.length));
    newValue.set(bytes, this.length);
    this.value = newValue;
    this.length += bytes.byteLength;
  }
  writeByte(byte) {
    if (this.length + 1 <= this.capacity) {
      this.value[this.length] = byte;
      this.length += 1;
      return;
    }
    if (this.capacity === 0) {
      this.capacity = 1;
    } else {
      this.capacity = this.capacity * 2;
    }
    const newValue = new Uint8Array(this.capacity);
    newValue.set(this.value.subarray(0, this.length));
    newValue[this.length] = byte;
    this.value = newValue;
    this.length += 1;
  }
  readInto(target) {
    if (target.byteLength < this.length) {
      throw new TypeError("Not enough space");
    }
    target.set(this.value.subarray(0, this.length));
  }
  bytes() {
    return this.value.slice(0, this.length);
  }
  clear() {
    this.length = 0;
  }
}
function rotr32(x, n) {
  return (x << 32 - n | x >>> n) >>> 0;
}
function bigIntBytes(value) {
  if (value < 0n) {
    value = value * -1n;
  }
  let byteLength = 1;
  while (value > 2n ** BigInt(byteLength * 8) - 1n) {
    byteLength++;
  }
  const encoded = new Uint8Array(byteLength);
  for (let i = 0; i < encoded.byteLength; i++) {
    encoded[i] = Number(value >> BigInt((encoded.byteLength - i - 1) * 8) & 0xffn);
  }
  return encoded;
}
function bigIntFromBytes(bytes) {
  if (bytes.byteLength < 1) {
    throw new TypeError("Empty Uint8Array");
  }
  let decoded = 0n;
  for (let i = 0; i < bytes.byteLength; i++) {
    decoded += BigInt(bytes[i]) << BigInt((bytes.byteLength - 1 - i) * 8);
  }
  return decoded;
}
function sha256$1(data) {
  const hash = new SHA256$1();
  hash.update(data);
  return hash.digest();
}
let SHA256$1 = class SHA256 {
  blockSize = 64;
  size = 32;
  blocks = new Uint8Array(64);
  currentBlockSize = 0;
  H = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  l = 0n;
  w = new Uint32Array(64);
  update(data) {
    this.l += BigInt(data.byteLength) * 8n;
    if (this.currentBlockSize + data.byteLength < 64) {
      this.blocks.set(data, this.currentBlockSize);
      this.currentBlockSize += data.byteLength;
      return;
    }
    let processed = 0;
    if (this.currentBlockSize > 0) {
      const next = data.slice(0, 64 - this.currentBlockSize);
      this.blocks.set(next, this.currentBlockSize);
      this.process();
      processed += next.byteLength;
      this.currentBlockSize = 0;
    }
    while (processed + 64 <= data.byteLength) {
      const next = data.slice(processed, processed + 64);
      this.blocks.set(next);
      this.process();
      processed += 64;
    }
    if (data.byteLength - processed > 0) {
      const remaining = data.slice(processed);
      this.blocks.set(remaining);
      this.currentBlockSize = remaining.byteLength;
    }
  }
  digest() {
    this.blocks[this.currentBlockSize] = 128;
    this.currentBlockSize += 1;
    if (64 - this.currentBlockSize < 8) {
      this.blocks.fill(0, this.currentBlockSize);
      this.process();
      this.currentBlockSize = 0;
    }
    this.blocks.fill(0, this.currentBlockSize);
    bigEndian.putUint64(this.blocks, this.l, this.blockSize - 8);
    this.process();
    const result = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
      bigEndian.putUint32(result, this.H[i], i * 4);
    }
    return result;
  }
  process() {
    for (let t = 0; t < 16; t++) {
      this.w[t] = (this.blocks[t * 4] << 24 | this.blocks[t * 4 + 1] << 16 | this.blocks[t * 4 + 2] << 8 | this.blocks[t * 4 + 3]) >>> 0;
    }
    for (let t = 16; t < 64; t++) {
      const sigma1 = (rotr32(this.w[t - 2], 17) ^ rotr32(this.w[t - 2], 19) ^ this.w[t - 2] >>> 10) >>> 0;
      const sigma0 = (rotr32(this.w[t - 15], 7) ^ rotr32(this.w[t - 15], 18) ^ this.w[t - 15] >>> 3) >>> 0;
      this.w[t] = sigma1 + this.w[t - 7] + sigma0 + this.w[t - 16] | 0;
    }
    let a = this.H[0];
    let b = this.H[1];
    let c = this.H[2];
    let d = this.H[3];
    let e = this.H[4];
    let f = this.H[5];
    let g = this.H[6];
    let h = this.H[7];
    for (let t = 0; t < 64; t++) {
      const sigma1 = (rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)) >>> 0;
      const ch = (e & f ^ ~e & g) >>> 0;
      const t1 = h + sigma1 + ch + K$1[t] + this.w[t] | 0;
      const sigma0 = (rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)) >>> 0;
      const maj = (a & b ^ a & c ^ b & c) >>> 0;
      const t2 = sigma0 + maj | 0;
      h = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    this.H[0] = a + this.H[0] | 0;
    this.H[1] = b + this.H[1] | 0;
    this.H[2] = c + this.H[2] | 0;
    this.H[3] = d + this.H[3] | 0;
    this.H[4] = e + this.H[4] | 0;
    this.H[5] = f + this.H[5] | 0;
    this.H[6] = g + this.H[6] | 0;
    this.H[7] = h + this.H[7] | 0;
  }
};
const K$1 = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
new BigUint64Array([
  0x428a2f98d728ae22n,
  0x7137449123ef65cdn,
  0xb5c0fbcfec4d3b2fn,
  0xe9b5dba58189dbbcn,
  0x3956c25bf348b538n,
  0x59f111f1b605d019n,
  0x923f82a4af194f9bn,
  0xab1c5ed5da6d8118n,
  0xd807aa98a3030242n,
  0x12835b0145706fben,
  0x243185be4ee4b28cn,
  0x550c7dc3d5ffb4e2n,
  0x72be5d74f27b896fn,
  0x80deb1fe3b1696b1n,
  0x9bdc06a725c71235n,
  0xc19bf174cf692694n,
  0xe49b69c19ef14ad2n,
  0xefbe4786384f25e3n,
  0x0fc19dc68b8cd5b5n,
  0x240ca1cc77ac9c65n,
  0x2de92c6f592b0275n,
  0x4a7484aa6ea6e483n,
  0x5cb0a9dcbd41fbd4n,
  0x76f988da831153b5n,
  0x983e5152ee66dfabn,
  0xa831c66d2db43210n,
  0xb00327c898fb213fn,
  0xbf597fc7beef0ee4n,
  0xc6e00bf33da88fc2n,
  0xd5a79147930aa725n,
  0x06ca6351e003826fn,
  0x142929670a0e6e70n,
  0x27b70a8546d22ffcn,
  0x2e1b21385c26c926n,
  0x4d2c6dfc5ac42aedn,
  0x53380d139d95b3dfn,
  0x650a73548baf63den,
  0x766a0abb3c77b2a8n,
  0x81c2c92e47edaee6n,
  0x92722c851482353bn,
  0xa2bfe8a14cf10364n,
  0xa81a664bbc423001n,
  0xc24b8b70d0f89791n,
  0xc76c51a30654be30n,
  0xd192e819d6ef5218n,
  0xd69906245565a910n,
  0xf40e35855771202an,
  0x106aa07032bbd1b8n,
  0x19a4c116b8d2d0c8n,
  0x1e376c085141ab53n,
  0x2748774cdf8eeb99n,
  0x34b0bcb5e19b48a8n,
  0x391c0cb3c5c95a63n,
  0x4ed8aa4ae3418acbn,
  0x5b9cca4f7763e373n,
  0x682e6ff3d6b2b8a3n,
  0x748f82ee5defb2fcn,
  0x78a5636f43172f60n,
  0x84c87814a1f0ab72n,
  0x8cc702081a6439ecn,
  0x90befffa23631e28n,
  0xa4506cebde82bde9n,
  0xbef9a3f7b2c67915n,
  0xc67178f2e372532bn,
  0xca273eceea26619cn,
  0xd186b8c721c0c207n,
  0xeada7dd6cde0eb1en,
  0xf57d4f7fee6ed178n,
  0x06f067aa72176fban,
  0x0a637dc5a2c898a6n,
  0x113f9804bef90daen,
  0x1b710b35131c471bn,
  0x28db77f523047d84n,
  0x32caab7b40c72493n,
  0x3c9ebe0a15c9bebcn,
  0x431d67c49c100d4cn,
  0x4cc5d4becb3e42b6n,
  0x597f299cfc657e2an,
  0x5fcb6fab3ad6faecn,
  0x6c44198c4a475817n
]);
function euclideanMod(x, y) {
  const r = x % y;
  if (r < 0n) {
    return r + y;
  }
  return r;
}
function inverseMod(a, n) {
  if (n < 0) {
    n = n * -1n;
  }
  if (a < 0) {
    a = euclideanMod(a, n);
  }
  let dividend = a;
  let divisor = n;
  let remainder = dividend % divisor;
  let quotient = dividend / divisor;
  let s1 = 1n;
  let s2 = 0n;
  let s3 = s1 - quotient * s2;
  while (remainder !== 0n) {
    dividend = divisor;
    divisor = remainder;
    s1 = s2;
    s2 = s3;
    remainder = dividend % divisor;
    quotient = dividend / divisor;
    s3 = s1 - quotient * s2;
  }
  if (divisor !== 1n) {
    throw new Error("a and n is not relatively prime");
  }
  if (s2 < 0) {
    return s2 + n;
  }
  return s2;
}
function powmod(x, y, p) {
  let res = 1n;
  x = x % p;
  while (y > 0) {
    if (y % 2n === 1n) {
      res = euclideanMod(res * x, p);
    }
    y = y >> 1n;
    x = euclideanMod(x * x, p);
  }
  return res;
}
function tonelliShanks(n, p) {
  if (p % 4n === 3n) {
    return powmod(n, (p + 1n) / 4n, p);
  }
  if (powmod(n, (p - 1n) / 2n, p) === p - 1n) {
    throw new Error("Cannot find square root");
  }
  let q = p - 1n;
  let s = 0n;
  while (q % 2n === 0n) {
    q = q / 2n;
    s++;
  }
  let z = 2n;
  while (powmod(z, (p - 1n) / 2n, p) !== p - 1n) {
    z++;
  }
  let r = powmod(n, (q + 1n) / 2n, p);
  let t = powmod(n, q, p);
  let c = powmod(z, q, p);
  let m = s;
  while (true) {
    if (t === 1n) {
      return r;
    }
    let i = 1n;
    while (i <= m) {
      if (i === m) {
        throw new Error("Cannot find square root");
      }
      if (powmod(t, 2n ** i, p) === 1n) {
        break;
      }
      i++;
    }
    const b = c ** 2n ** (m - i - 1n);
    m = i;
    c = b ** 2n % p;
    t = t * b ** 2n % p;
    r = r * b % p;
  }
}
class ECDSAPoint {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class JacobianPoint {
  x;
  y;
  z;
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  isAtInfinity() {
    return this.x === 0n && this.y === 1n && this.z === 0n;
  }
}
class ECDSANamedCurve {
  p;
  a;
  b;
  g;
  n;
  cofactor;
  size;
  objectIdentifier;
  constructor(p, a, b, gx, gy, n, cofactor, size, objectIdentifier) {
    this.p = p;
    this.a = a;
    this.b = b;
    this.g = new ECDSAPoint(gx, gy);
    this.n = n;
    this.cofactor = cofactor;
    this.size = size;
    this.objectIdentifier = objectIdentifier;
  }
  add(point1, point2) {
    const jacobian1 = this.fromAffine(point1);
    const jacobian2 = this.fromAffine(point2);
    return this.toAffine(this.addJacobian(jacobian1, jacobian2));
  }
  addJacobian(point1, point2) {
    if (point1.isAtInfinity()) {
      return point2;
    }
    if (point2.isAtInfinity()) {
      return point1;
    }
    const point1zz = point1.z ** 2n;
    const point2zz = point2.z ** 2n;
    const u1 = euclideanMod(point1.x * point2zz, this.p);
    const u2 = euclideanMod(point2.x * point1zz, this.p);
    const s1 = euclideanMod(point1.y * point2zz * point2.z, this.p);
    const s2 = euclideanMod(point2.y * point1zz * point1.z, this.p);
    if (u1 === u2) {
      if (s1 !== s2) {
        return pointAtInfinity();
      }
      return this.doubleJacobian(point1);
    }
    const h = u2 - u1;
    const r = s2 - s1;
    const point3x = euclideanMod(r ** 2n - h ** 3n - 2n * u1 * h ** 2n, this.p);
    const point3 = new JacobianPoint(point3x, euclideanMod(r * (u1 * h ** 2n - point3x) - s1 * h ** 3n, this.p), euclideanMod(h * point1.z * point2.z, this.p));
    return point3;
  }
  double(point) {
    const jacobian = this.fromAffine(point);
    return this.toAffine(this.doubleJacobian(jacobian));
  }
  doubleJacobian(point) {
    if (point.isAtInfinity()) {
      return point;
    }
    if (point.y === 0n) {
      return pointAtInfinity();
    }
    const s = euclideanMod(4n * point.x * point.y ** 2n, this.p);
    const m = euclideanMod(3n * point.x ** 2n + this.a * point.z ** 4n, this.p);
    const resultx = euclideanMod(m ** 2n - 2n * s, this.p);
    const result = new JacobianPoint(resultx, euclideanMod(m * (s - resultx) - 8n * point.y ** 4n, this.p), euclideanMod(2n * point.y * point.z, this.p));
    return result;
  }
  toAffine(point) {
    if (point.isAtInfinity()) {
      return null;
    }
    const inverseZ = inverseMod(point.z, this.p);
    const inverseZ2 = inverseZ ** 2n;
    const affine = new ECDSAPoint(euclideanMod(point.x * inverseZ2, this.p), euclideanMod(point.y * inverseZ2 * inverseZ, this.p));
    return affine;
  }
  fromAffine(point) {
    return new JacobianPoint(point.x, point.y, 1n);
  }
  // Assumes the point is already on the curve
  multiply(k, point) {
    const kBytes = bigIntBytes(k);
    const bitLength = k.toString(2).length;
    let res = pointAtInfinity();
    let temp = new JacobianPoint(point.x, point.y, 1n);
    for (let i = 0; i < bitLength; i++) {
      const byte = kBytes[kBytes.byteLength - 1 - Math.floor(i / 8)];
      if (byte >> i % 8 & 1) {
        res = this.addJacobian(res, temp);
      }
      temp = this.doubleJacobian(temp);
    }
    return this.toAffine(res);
  }
  isOnCurve(point) {
    if (this.cofactor !== 1n && this.multiply(this.n, point) !== null) {
      return false;
    }
    return euclideanMod(point.y ** 2n, this.p) === euclideanMod(point.x ** 3n + this.a * point.x + this.b, this.p);
  }
}
function pointAtInfinity() {
  return new JacobianPoint(0n, 1n, 0n);
}
function bigIntTwosComplementBytes(value) {
  if (value === 0n) {
    return new Uint8Array(1);
  }
  let byteLength = 1;
  if (value > 0n) {
    while (value > (1n << BigInt(byteLength * 8 - 1)) - 1n) {
      byteLength++;
    }
  } else {
    while (value < -1n << BigInt(byteLength * 8 - 1)) {
      byteLength++;
    }
  }
  const encoded = new Uint8Array(byteLength);
  for (let i = 0; i < encoded.byteLength; i++) {
    encoded[i] = Number(value >> BigInt((encoded.byteLength - i - 1) * 8) & 0xffn);
  }
  return encoded;
}
function bigIntFromTwosComplementBytes(bytes) {
  if (bytes.byteLength < 1) {
    throw new TypeError("Empty Uint8Array");
  }
  let decoded = 0n;
  for (let i = 0; i < bytes.byteLength; i++) {
    decoded += BigInt(bytes[i]) << BigInt((bytes.byteLength - 1 - i) * 8);
  }
  if (bytes[0] >> 7 === 0) {
    return decoded;
  }
  return decoded - (1n << BigInt(bytes.byteLength * 8));
}
function variableLengthQuantityBytes(value) {
  let bitLength = 7;
  while (value > (1 << bitLength) - 1) {
    bitLength += 7;
  }
  const encoded = new Uint8Array(Math.ceil(bitLength / 8));
  for (let i = 0; i < encoded.byteLength; i++) {
    if (i === encoded.byteLength - 1) {
      encoded[i] = Number(value >> BigInt((encoded.byteLength - i - 1) * 7) & 0x7fn);
    } else {
      encoded[i] = Number(value >> BigInt((encoded.byteLength - i - 1) * 7) & 0x7fn) | 128;
    }
  }
  return encoded;
}
function variableLengthQuantityFromBytes(bytes, maxBytes) {
  let value = 0n;
  for (let i = 0; i < bytes.byteLength; i++) {
    value = value << 7n | BigInt(bytes[i] & 127);
    if (bytes[i] >> 7 === 0) {
      return [value, i + 1];
    }
    if (i + 1 > maxBytes) {
      throw new Error("Data too large");
    }
  }
  throw new TypeError("Invalid variable length quantity");
}
function decodeASCII(encoded) {
  for (let i = 0; i < encoded.byteLength; i++) {
    if (encoded[i] > 127) {
      throw new TypeError("Invalid ASCII");
    }
  }
  return new TextDecoder().decode(encoded);
}
function parseASN1NoLeftoverBytes(data) {
  const [decoded, size] = parseASN1(data);
  if (data.byteLength !== size) {
    throw new ASN1LeftoverBytesError(data.byteLength - size);
  }
  return decoded;
}
function parseASN1(data) {
  if (data.byteLength < 2) {
    throw new ASN1ParseError();
  }
  let asn1Class;
  if (data[0] >> 6 === 0) {
    asn1Class = ASN1Class.Universal;
  } else if (data[0] >> 6 === 1) {
    asn1Class = ASN1Class.Application;
  } else if (data[0] >> 6 === 2) {
    asn1Class = ASN1Class.ContextSpecific;
  } else if (data[0] >> 6 === 3) {
    asn1Class = ASN1Class.Private;
  } else {
    throw new ASN1ParseError();
  }
  let encodingForm;
  if ((data[0] >> 5 & 1) === 0) {
    encodingForm = ASN1Form.Primitive;
  } else if ((data[0] >> 5 & 1) === 1) {
    encodingForm = ASN1Form.Constructed;
  } else {
    throw new ASN1ParseError();
  }
  let offset = 0;
  let tag;
  if ((data[0] & 31) < 31) {
    tag = data[0] & 31;
    offset++;
  } else {
    offset++;
    let decodedTag;
    let tagSize;
    try {
      [decodedTag, tagSize] = variableLengthQuantityFromBytes(data.slice(offset), 2);
    } catch {
      throw new ASN1ParseError();
    }
    if (decodedTag > 16384n) {
      throw new ASN1ParseError();
    }
    tag = Number(decodedTag);
    offset += tagSize;
  }
  if (data.byteLength < offset) {
    throw new ASN1ParseError();
  }
  if (data[offset] === 128) {
    throw new ASN1ParseError();
  }
  let contentLength = 0;
  if (data[offset] >> 7 === 0) {
    contentLength = data[offset] & 127;
    offset++;
  } else {
    const contentLengthSize = data[offset] & 127;
    offset++;
    if (contentLengthSize < 1 || data.byteLength < offset + contentLengthSize) {
      throw new ASN1ParseError();
    }
    const decodedContentLength = bigIntFromBytes(data.slice(offset, offset + contentLengthSize));
    offset += contentLengthSize;
    contentLength = Number(decodedContentLength);
  }
  if (data.length < offset + contentLength) {
    throw new ASN1ParseError();
  }
  const value = data.slice(offset, offset + contentLength);
  const result = new ASN1Value(asn1Class, encodingForm, tag, value);
  return [result, offset + contentLength];
}
function encodeASN1(value) {
  const encodedContents = value.contents();
  let firstByte = 0;
  if (value.class === ASN1Class.Universal) {
    firstByte |= 0;
  } else if (value.class === ASN1Class.Application) {
    firstByte |= 64;
  } else if (value.class === ASN1Class.ContextSpecific) {
    firstByte |= 128;
  } else if (value.class === ASN1Class.Private) {
    firstByte |= 192;
  }
  if (value.form === ASN1Form.Primitive) {
    firstByte |= 0;
  } else if (value.form === ASN1Form.Constructed) {
    firstByte |= 32;
  }
  const buffer = new DynamicBuffer(1);
  if (value.tag < 31) {
    firstByte |= value.tag;
    buffer.writeByte(firstByte);
  } else {
    firstByte |= 31;
    buffer.writeByte(firstByte);
    const encodedTagNumber = variableLengthQuantityBytes(BigInt(value.tag));
    buffer.write(encodedTagNumber);
  }
  if (encodedContents.byteLength < 128) {
    buffer.writeByte(encodedContents.byteLength);
  } else {
    const encodedContentsLength = bigIntBytes(BigInt(encodedContents.byteLength));
    if (encodedContentsLength.byteLength > 126) {
      throw new ASN1EncodeError();
    }
    buffer.writeByte(encodedContentsLength.byteLength | 128);
    buffer.write(encodedContentsLength);
  }
  buffer.write(encodedContents);
  return buffer.bytes();
}
class ASN1Value {
  class;
  form;
  tag;
  _contents;
  constructor(asn1Class, form, tag, value) {
    this.class = asn1Class;
    this.form = form;
    this.tag = tag;
    this._contents = value;
  }
  universalType() {
    if (this.class === ASN1Class.Universal && this.tag in ASN1_UNIVERSAL_TAG_MAP) {
      return ASN1_UNIVERSAL_TAG_MAP[this.tag];
    }
    throw new ASN1DecodeError();
  }
  contents() {
    return this._contents;
  }
  boolean() {
    if (this.universalType() !== ASN1UniversalType.Boolean) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.byteLength !== 1) {
      throw new ASN1DecodeError();
    }
    if (this._contents[0] === 0) {
      return new ASN1Boolean(false);
    }
    if (this._contents[0] === 255) {
      return new ASN1Boolean(true);
    }
    throw new ASN1DecodeError();
  }
  integer() {
    if (this.universalType() !== ASN1UniversalType.Integer) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.byteLength < 1) {
      throw new ASN1DecodeError();
    }
    return new ASN1Integer(bigIntFromTwosComplementBytes(this._contents));
  }
  bitString() {
    if (this.universalType() !== ASN1UniversalType.BitString) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.byteLength < 1) {
      throw new ASN1DecodeError();
    }
    const unusedBits = this._contents[0];
    if (unusedBits > 7) {
      throw new ASN1DecodeError();
    }
    const value = this._contents.slice(1);
    if (unusedBits > 0 && value.byteLength === 0) {
      throw new ASN1DecodeError();
    }
    return new ASN1BitString(value, value.byteLength * 8 - unusedBits);
  }
  octetString() {
    if (this.universalType() !== ASN1UniversalType.OctetString) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    return new ASN1OctetString(this._contents);
  }
  null() {
    if (this.universalType() !== ASN1UniversalType.Null) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.byteLength > 0) {
      throw new ASN1DecodeError();
    }
    return new ASN1Null();
  }
  objectIdentifier() {
    if (this.universalType() !== ASN1UniversalType.ObjectIdentifier) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.byteLength < 1) {
      throw new ASN1DecodeError();
    }
    return new ASN1ObjectIdentifier(this._contents);
  }
  real() {
    if (this.universalType() !== ASN1UniversalType.Real) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.length === 0) {
      return new ASN1RealZero();
    }
    if (this._contents[0] >> 7 === 1) {
      let base;
      if ((this._contents[0] >> 4 & 3) === 0) {
        base = RealBinaryEncodingBase.Base2;
      } else if ((this._contents[0] >> 4 & 3) === 1) {
        base = RealBinaryEncodingBase.Base8;
      } else if ((this._contents[0] >> 4 & 3) === 2) {
        base = RealBinaryEncodingBase.Base16;
      } else {
        throw new ASN1DecodeError();
      }
      const scalingFactor = this._contents[0] >> 2 & 3;
      let exponent;
      let encodedExponentSize;
      if ((this._contents[0] & 3) === 0) {
        if (this._contents.byteLength < 2) {
          throw new ASN1DecodeError();
        }
        exponent = bigIntFromTwosComplementBytes(this._contents.slice(1, 2));
        encodedExponentSize = 1;
      } else if ((this._contents[0] & 3) === 1) {
        if (this._contents.byteLength < 3) {
          throw new ASN1DecodeError();
        }
        exponent = bigIntFromTwosComplementBytes(this._contents.slice(1, 3));
        encodedExponentSize = 2;
      } else if ((this._contents[0] & 3) === 2) {
        if (this._contents.byteLength < 4) {
          throw new ASN1DecodeError();
        }
        exponent = bigIntFromTwosComplementBytes(this._contents.slice(1, 4));
        encodedExponentSize = 3;
      } else if ((this._contents[0] & 3) === 3) {
        if (this._contents.byteLength < 2) {
          throw new ASN1DecodeError();
        }
        const exponentSize = this._contents[1];
        if (exponentSize < 1) {
          throw new ASN1DecodeError();
        }
        if (this._contents.byteLength < 2 + exponentSize) {
          throw new ASN1DecodeError();
        }
        exponent = bigIntFromTwosComplementBytes(this._contents.slice(2, 2 + exponentSize));
        encodedExponentSize = 1 + exponentSize;
      } else {
        throw new ASN1DecodeError();
      }
      if (this._contents.byteLength === 1 + encodedExponentSize) {
        throw new ASN1DecodeError();
      }
      const N = bigIntFromBytes(this._contents.slice(1 + encodedExponentSize));
      let mantissa = N * BigInt(2 ** scalingFactor);
      if ((this._contents[0] >> 6 & 1) === 1) {
        mantissa = mantissa * -1n;
      }
      return new ASN1RealBinaryEncoding(mantissa, base, exponent);
    }
    if (this._contents[0] == 1) {
      return new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR1, this._contents.slice(1));
    }
    if (this._contents[0] == 2) {
      return new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR2, this._contents.slice(1));
    }
    if (this._contents[0] == 3) {
      return new ASN1RealDecimalEncoding(RealDecimalEncodingFormat.ISO6093NR3, this._contents.slice(1));
    }
    if (this._contents[0] === 64) {
      return new ASN1SpecialReal(SpecialReal.PlusInfinity);
    }
    if (this._contents[0] === 65) {
      return new ASN1SpecialReal(SpecialReal.MinusInfinity);
    }
    throw new ASN1DecodeError();
  }
  enumerated() {
    if (this.universalType() !== ASN1UniversalType.Enumerated) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    if (this._contents.byteLength < 1) {
      throw new ASN1DecodeError();
    }
    return new ASN1Enumerated(bigIntFromTwosComplementBytes(this._contents));
  }
  utf8String() {
    if (this.universalType() !== ASN1UniversalType.UTF8String) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    return new ASN1UTF8String(this._contents);
  }
  sequence() {
    if (this.universalType() !== ASN1UniversalType.Sequence) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Constructed) {
      throw new ASN1DecodeError();
    }
    const elements = [];
    let readBytes = 0;
    while (readBytes !== this._contents.byteLength) {
      const [parsedElement, parsedElementSize] = parseASN1(this._contents.slice(readBytes));
      elements.push(parsedElement);
      readBytes += parsedElementSize;
    }
    return new ASN1Sequence(elements);
  }
  set() {
    if (this.universalType() !== ASN1UniversalType.Set) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Constructed) {
      throw new ASN1DecodeError();
    }
    const elements = [];
    let readBytes = 0;
    while (readBytes !== this._contents.byteLength) {
      const [parsedElement, parsedElementSize] = parseASN1(this._contents.slice(readBytes));
      elements.push(parsedElement);
      readBytes += parsedElementSize;
    }
    return new ASN1Set(elements);
  }
  numericString() {
    if (this.universalType() !== ASN1UniversalType.NumericString) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    return new ASN1NumericString(this._contents);
  }
  printableString() {
    if (this.universalType() !== ASN1UniversalType.PrintableString) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    return new ASN1PrintableString(this._contents);
  }
  ia5String() {
    if (this.universalType() !== ASN1UniversalType.IA5String) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    return new ASN1IA5String(this._contents);
  }
  utcTime() {
    if (this.universalType() !== ASN1UniversalType.UTCTime) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    let decodedString = decodeASCII(this._contents);
    if (decodedString.length !== 13 || !decodedString.endsWith("Z")) {
      throw new ASN1DecodeError();
    }
    decodedString = decodedString.replace("Z", "");
    return new ASN1UTCTime(Number(decodedString.slice(0, 2)), Number(decodedString.slice(2, 4)), Number(decodedString.slice(4, 6)), Number(decodedString.slice(6, 8)), Number(decodedString.slice(8, 10)), Number(decodedString.slice(10, 12)));
  }
  generalizedTime() {
    if (this.universalType() !== ASN1UniversalType.GeneralizedTime) {
      throw new ASN1DecodeError();
    }
    if (this.form !== ASN1Form.Primitive) {
      throw new ASN1DecodeError();
    }
    let decodedString = decodeASCII(this._contents);
    if (!decodedString.endsWith("Z")) {
      throw new ASN1DecodeError();
    }
    decodedString = decodedString.replace("Z", "");
    let wholePart;
    let decimalPart = null;
    if (decodedString.includes(".")) {
      [wholePart, decimalPart] = decodedString.split(".");
    } else {
      wholePart = decodedString;
    }
    if (wholePart.length !== 14) {
      throw new ASN1DecodeError();
    }
    let milliseconds = 0;
    if (decimalPart !== null) {
      if (decimalPart.length > 3) {
        throw new ASN1DecodeError();
      }
      milliseconds = Number(decimalPart.padEnd(3, "0"));
    }
    return new ASN1GeneralizedTime(Number(wholePart.slice(0, 4)), Number(wholePart.slice(4, 6)), Number(wholePart.slice(6, 8)), Number(wholePart.slice(8, 10)), Number(wholePart.slice(10, 12)), Number(wholePart.slice(12, 14)), milliseconds);
  }
}
class ASN1Boolean {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.BOOLEAN;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    if (this.value) {
      return new Uint8Array([255]);
    }
    return new Uint8Array([0]);
  }
}
class ASN1Integer {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.INTEGER;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return bigIntTwosComplementBytes(this.value);
  }
}
class ASN1BitString {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.BIT_STRING;
  bytes;
  length;
  constructor(bytes, length) {
    if (length > bytes.byteLength * 8) {
      throw new TypeError("Data too small");
    }
    if (length <= (bytes.byteLength - 1) * 8) {
      throw new TypeError("Data too large");
    }
    this.bytes = bytes;
    this.length = length;
  }
  contents() {
    let remainingBitsInLastByte = 8 - this.length % 8;
    if (remainingBitsInLastByte === 8) {
      remainingBitsInLastByte = 0;
    }
    const encoded = new Uint8Array(this.bytes.byteLength + 1);
    encoded[0] = remainingBitsInLastByte;
    encoded.set(this.bytes, 1);
    return encoded;
  }
}
class ASN1Enumerated {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.ENUMERATED;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return bigIntTwosComplementBytes(this.value);
  }
}
class ASN1RealBinaryEncoding {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.REAL;
  mantissa;
  base;
  exponent;
  constructor(mantissa, base, exponent) {
    if (mantissa === 0n) {
      throw new TypeError("The mantissa cannot be zero");
    }
    this.mantissa = mantissa;
    this.base = base;
    this.exponent = exponent;
  }
  contents() {
    let N, scalingFactor;
    if (this.mantissa % 8n === 0n) {
      N = absBigInt(this.mantissa) / 8n;
      scalingFactor = 3;
    } else if (this.mantissa % 4n === 0n) {
      N = absBigInt(this.mantissa) / 4n;
      scalingFactor = 2;
    } else if (this.mantissa % 2n === 0n) {
      N = absBigInt(this.mantissa) / 2n;
      scalingFactor = 1;
    } else {
      N = absBigInt(this.mantissa);
      scalingFactor = 0;
    }
    let firstByte = 128;
    if (this.mantissa < 0) {
      firstByte |= 64;
    }
    if (this.base === RealBinaryEncodingBase.Base8) {
      firstByte |= 16;
    } else if (this.base === RealBinaryEncodingBase.Base16) {
      firstByte |= 32;
    }
    firstByte |= scalingFactor << 2;
    let encodedExponent;
    const exponentBytes = bigIntTwosComplementBytes(this.exponent);
    if (exponentBytes.byteLength === 1) {
      encodedExponent = new Uint8Array(1);
      encodedExponent.set(exponentBytes);
    } else if (exponentBytes.byteLength === 2) {
      firstByte |= 1;
      encodedExponent = new Uint8Array(2);
      encodedExponent.set(exponentBytes);
    } else if (exponentBytes.byteLength === 3) {
      firstByte |= 2;
      encodedExponent = new Uint8Array(3);
      encodedExponent.set(exponentBytes);
    } else {
      if (exponentBytes.byteLength > 255) {
        throw new ASN1DecodeError();
      }
      firstByte |= 3;
      encodedExponent = new Uint8Array(exponentBytes.byteLength + 1);
      encodedExponent[0] = exponentBytes.byteLength;
      encodedExponent.set(exponentBytes, 1);
    }
    const nBytes = bigIntBytes(N);
    const encoded = new Uint8Array(1 + encodedExponent.byteLength + nBytes.byteLength);
    encoded[0] = firstByte;
    encoded.set(encodedExponent, 1);
    encoded.set(nBytes, 1 + encodedExponent.byteLength);
    return encoded;
  }
}
function absBigInt(value) {
  if (value < 0) {
    return value * -1n;
  }
  return value;
}
var RealBinaryEncodingBase;
(function(RealBinaryEncodingBase2) {
  RealBinaryEncodingBase2[RealBinaryEncodingBase2["Base2"] = 0] = "Base2";
  RealBinaryEncodingBase2[RealBinaryEncodingBase2["Base8"] = 1] = "Base8";
  RealBinaryEncodingBase2[RealBinaryEncodingBase2["Base16"] = 2] = "Base16";
})(RealBinaryEncodingBase || (RealBinaryEncodingBase = {}));
class ASN1RealDecimalEncoding {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.REAL;
  encodingFormat;
  value;
  constructor(encodingFormat, value) {
    this.encodingFormat = encodingFormat;
    this.value = value;
  }
  contents() {
    const encoded = new Uint8Array(1 + this.value.byteLength);
    if (this.encodingFormat === RealDecimalEncodingFormat.ISO6093NR1) {
      encoded[0] = 1;
    } else if (this.encodingFormat === RealDecimalEncodingFormat.ISO6093NR2) {
      encoded[0] = 2;
    } else if (this.encodingFormat === RealDecimalEncodingFormat.ISO6093NR3) {
      encoded[0] = 3;
    }
    encoded.set(this.value, 1);
    return encoded;
  }
  decodeText() {
    return new TextDecoder().decode(this.value);
  }
  decodeNumber() {
    return Number(this.decodeText());
  }
}
var RealDecimalEncodingFormat;
(function(RealDecimalEncodingFormat2) {
  RealDecimalEncodingFormat2[RealDecimalEncodingFormat2["ISO6093NR1"] = 0] = "ISO6093NR1";
  RealDecimalEncodingFormat2[RealDecimalEncodingFormat2["ISO6093NR2"] = 1] = "ISO6093NR2";
  RealDecimalEncodingFormat2[RealDecimalEncodingFormat2["ISO6093NR3"] = 2] = "ISO6093NR3";
})(RealDecimalEncodingFormat || (RealDecimalEncodingFormat = {}));
class ASN1SpecialReal {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.REAL;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    switch (this.value) {
      case SpecialReal.PlusInfinity:
        return new Uint8Array([64]);
      case SpecialReal.MinusInfinity:
        return new Uint8Array([65]);
    }
  }
}
var SpecialReal;
(function(SpecialReal2) {
  SpecialReal2[SpecialReal2["PlusInfinity"] = 0] = "PlusInfinity";
  SpecialReal2[SpecialReal2["MinusInfinity"] = 1] = "MinusInfinity";
})(SpecialReal || (SpecialReal = {}));
class ASN1RealZero {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.REAL;
  value = 0;
  contents() {
    return new Uint8Array(0);
  }
}
class ASN1OctetString {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.OCTET_STRING;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return this.value;
  }
}
class ASN1Null {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.NULL;
  contents() {
    return new Uint8Array(0);
  }
}
class ASN1Sequence {
  class = ASN1Class.Universal;
  form = ASN1Form.Constructed;
  tag = ASN1_UNIVERSAL_TAG.SEQUENCE;
  elements;
  constructor(elements) {
    this.elements = elements;
  }
  contents() {
    const buffer = new DynamicBuffer(0);
    for (const element of this.elements) {
      buffer.write(encodeASN1(element));
    }
    return buffer.bytes();
  }
  isSequenceOfSingleType(asn1Class, form, tag) {
    for (const element of this.elements) {
      if (element.class !== asn1Class || element.form !== form || element.tag !== tag) {
        return false;
      }
    }
    return true;
  }
  at(index) {
    if (index < this.elements.length) {
      return this.elements[index];
    }
    throw new Error("Invalid index");
  }
}
class ASN1EncodableSequence {
  class = ASN1Class.Universal;
  form = ASN1Form.Constructed;
  tag = ASN1_UNIVERSAL_TAG.SEQUENCE;
  elements;
  constructor(elements) {
    this.elements = elements;
  }
  contents() {
    const buffer = new DynamicBuffer(0);
    for (const element of this.elements) {
      buffer.write(encodeASN1(element));
    }
    return buffer.bytes();
  }
}
class ASN1Set {
  class = ASN1Class.Universal;
  form = ASN1Form.Constructed;
  tag = ASN1_UNIVERSAL_TAG.SET;
  elements;
  constructor(elements) {
    this.elements = elements;
  }
  contents() {
    const buffer = new DynamicBuffer(0);
    for (const element of this.elements) {
      buffer.write(encodeASN1(element));
    }
    return buffer.bytes();
  }
  isSetOfSingleType(asn1Class, form, tag) {
    for (const element of this.elements) {
      if (element.class !== asn1Class || element.form !== form || element.tag !== tag) {
        return false;
      }
    }
    return true;
  }
  at(index) {
    if (index < this.elements.length) {
      return this.elements[index];
    }
    throw new Error("Invalid index");
  }
}
class ASN1ObjectIdentifier {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.OBJECT_IDENTIFIER;
  encoded;
  constructor(encoded) {
    this.encoded = encoded;
  }
  contents() {
    return this.encoded;
  }
  is(objectIdentifier) {
    return compareBytes(encodeObjectIdentifier(objectIdentifier), this.encoded);
  }
}
class ASN1NumericString {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.NUMERIC_STRING;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return this.value;
  }
  decodeText() {
    for (let i = 0; i < this.value.byteLength; i++) {
      if (this.value[i] === 32) {
        continue;
      }
      if (this.value[i] >= 48 && this.value[i] <= 57) {
        continue;
      }
      throw new TypeError("Invalid numeric string");
    }
    return new TextDecoder().decode(this.value);
  }
}
class ASN1PrintableString {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.PRINTABLE_STRING;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return this.value;
  }
  decodeText() {
    for (let i = 0; i < this.value.byteLength; i++) {
      if (this.value[i] === 32) {
        continue;
      }
      if (this.value[i] >= 39 && this.value[i] >= 41) {
        continue;
      }
      if (this.value[i] >= 43 && this.value[i] >= 47) {
        continue;
      }
      if (this.value[i] >= 48 && this.value[i] <= 57) {
        continue;
      }
      if (this.value[i] === 61) {
        continue;
      }
      if (this.value[i] === 63) {
        continue;
      }
      if (this.value[i] >= 65 && this.value[i] <= 90) {
        continue;
      }
      if (this.value[i] >= 97 && this.value[i] <= 122) {
        continue;
      }
      throw new TypeError("Invalid printable string");
    }
    return new TextDecoder().decode(this.value);
  }
}
class ASN1UTF8String {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.UTF8_STRING;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return this.value;
  }
  decodeText() {
    return new TextDecoder().decode(this.value);
  }
}
class ASN1IA5String {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.IA5_STRING;
  value;
  constructor(value) {
    this.value = value;
  }
  contents() {
    return this.value;
  }
  decodeText() {
    return decodeASCII(this.value);
  }
}
class ASN1GeneralizedTime {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.GENERALIZED_TIME;
  year;
  month;
  date;
  hours;
  minutes;
  seconds;
  milliseconds;
  constructor(year, month, date, hours, minutes, seconds, milliseconds) {
    if (!Number.isInteger(year) || year < 0 || year > 9999) {
      throw new TypeError("Invalid year");
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new TypeError("Invalid month");
    }
    if (!Number.isInteger(date) || date < 1 || date > 99) {
      throw new TypeError("Invalid date");
    }
    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      throw new TypeError("Invalid hours");
    }
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
      throw new TypeError("Invalid minutes");
    }
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
      throw new TypeError("Invalid seconds");
    }
    if (!Number.isInteger(milliseconds) || milliseconds < 0 || milliseconds > 999) {
      throw new TypeError("Invalid milliseconds");
    }
    this.year = year;
    this.month = month;
    this.date = date;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.milliseconds = milliseconds;
  }
  contents() {
    let text = this.year.toString().padStart(4, "0");
    text += this.month.toString().padStart(2, "0");
    text += this.date.toString().padStart(2, "0");
    text += this.hours.toString().padStart(2, "0");
    text += this.minutes.toString().padStart(2, "0");
    text += this.seconds.toString().padStart(2, "0");
    if (this.milliseconds > 0) {
      text += (this.milliseconds / 1e3).toString().replace("0", "");
    }
    text += "Z";
    return new TextEncoder().encode(text);
  }
  toDate() {
    const date = /* @__PURE__ */ new Date();
    date.setUTCFullYear(this.year);
    date.setUTCMonth(this.month - 1);
    date.setUTCDate(this.date);
    date.setUTCHours(this.hours);
    date.setUTCMinutes(this.minutes);
    date.setUTCSeconds(this.seconds);
    date.setUTCMilliseconds(this.milliseconds);
    return date;
  }
}
class ASN1UTCTime {
  class = ASN1Class.Universal;
  form = ASN1Form.Primitive;
  tag = ASN1_UNIVERSAL_TAG.UTC_TIME;
  year;
  month;
  date;
  hours;
  minutes;
  seconds;
  constructor(year, month, date, hours, minutes, seconds) {
    if (!Number.isInteger(year) || year < 0 || year > 99) {
      throw new TypeError("Invalid year");
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new TypeError("Invalid month");
    }
    if (!Number.isInteger(date) || date < 1 || date > 99) {
      throw new TypeError("Invalid date");
    }
    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      throw new TypeError("Invalid hours");
    }
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
      throw new TypeError("Invalid minutes");
    }
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
      throw new TypeError("Invalid seconds");
    }
    this.year = year;
    this.month = month;
    this.date = date;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
  contents() {
    let text = this.year.toString().padStart(2, "0");
    text += this.month.toString().padStart(2, "0");
    text += this.date.toString().padStart(2, "0");
    text += this.hours.toString().padStart(2, "0");
    text += this.minutes.toString().padStart(2, "0");
    text += this.seconds.toString().padStart(2, "0");
    text += "Z";
    return new TextEncoder().encode(text);
  }
  toDate(century) {
    if (century < 0 || century > 99) {
      throw new TypeError("Invalid century");
    }
    const date = /* @__PURE__ */ new Date();
    date.setUTCFullYear(century * 100 + this.year);
    date.setUTCMonth(this.month - 1);
    date.setUTCDate(this.date);
    date.setUTCHours(this.hours);
    date.setUTCMinutes(this.minutes);
    date.setUTCSeconds(this.seconds);
    date.setUTCMilliseconds(0);
    return date;
  }
}
function encodeObjectIdentifier(oid) {
  const parts = oid.split(".");
  const components = [];
  for (let i = 0; i < parts.length; i++) {
    const parsed = Number(parts[i]);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new TypeError("Invalid object identifier");
    }
    components[i] = parsed;
  }
  if (components.length < 2) {
    throw new TypeError("Invalid object identifier");
  }
  const firstSubidentifier = components[0] * 40 + components[1];
  const buffer = new DynamicBuffer(0);
  buffer.write(variableLengthQuantityBytes(BigInt(firstSubidentifier)));
  for (let i = 2; i < components.length; i++) {
    buffer.write(variableLengthQuantityBytes(BigInt(components[i])));
  }
  return buffer.bytes();
}
var ASN1UniversalType;
(function(ASN1UniversalType2) {
  ASN1UniversalType2[ASN1UniversalType2["Boolean"] = 0] = "Boolean";
  ASN1UniversalType2[ASN1UniversalType2["Integer"] = 1] = "Integer";
  ASN1UniversalType2[ASN1UniversalType2["BitString"] = 2] = "BitString";
  ASN1UniversalType2[ASN1UniversalType2["OctetString"] = 3] = "OctetString";
  ASN1UniversalType2[ASN1UniversalType2["Null"] = 4] = "Null";
  ASN1UniversalType2[ASN1UniversalType2["ObjectIdentifier"] = 5] = "ObjectIdentifier";
  ASN1UniversalType2[ASN1UniversalType2["ObjectDescriptor"] = 6] = "ObjectDescriptor";
  ASN1UniversalType2[ASN1UniversalType2["External"] = 7] = "External";
  ASN1UniversalType2[ASN1UniversalType2["Real"] = 8] = "Real";
  ASN1UniversalType2[ASN1UniversalType2["Enumerated"] = 9] = "Enumerated";
  ASN1UniversalType2[ASN1UniversalType2["EmbeddedPDV"] = 10] = "EmbeddedPDV";
  ASN1UniversalType2[ASN1UniversalType2["UTF8String"] = 11] = "UTF8String";
  ASN1UniversalType2[ASN1UniversalType2["RelativeObjectIdentifier"] = 12] = "RelativeObjectIdentifier";
  ASN1UniversalType2[ASN1UniversalType2["Time"] = 13] = "Time";
  ASN1UniversalType2[ASN1UniversalType2["Sequence"] = 14] = "Sequence";
  ASN1UniversalType2[ASN1UniversalType2["Set"] = 15] = "Set";
  ASN1UniversalType2[ASN1UniversalType2["NumericString"] = 16] = "NumericString";
  ASN1UniversalType2[ASN1UniversalType2["PrintableString"] = 17] = "PrintableString";
  ASN1UniversalType2[ASN1UniversalType2["TeletexString"] = 18] = "TeletexString";
  ASN1UniversalType2[ASN1UniversalType2["VideotextString"] = 19] = "VideotextString";
  ASN1UniversalType2[ASN1UniversalType2["IA5String"] = 20] = "IA5String";
  ASN1UniversalType2[ASN1UniversalType2["UTCTime"] = 21] = "UTCTime";
  ASN1UniversalType2[ASN1UniversalType2["GeneralizedTime"] = 22] = "GeneralizedTime";
  ASN1UniversalType2[ASN1UniversalType2["GraphicString"] = 23] = "GraphicString";
  ASN1UniversalType2[ASN1UniversalType2["VisibleString"] = 24] = "VisibleString";
  ASN1UniversalType2[ASN1UniversalType2["GeneralString"] = 25] = "GeneralString";
  ASN1UniversalType2[ASN1UniversalType2["UniversalString"] = 26] = "UniversalString";
  ASN1UniversalType2[ASN1UniversalType2["CharacterString"] = 27] = "CharacterString";
  ASN1UniversalType2[ASN1UniversalType2["BMPString"] = 28] = "BMPString";
})(ASN1UniversalType || (ASN1UniversalType = {}));
var ASN1Class;
(function(ASN1Class2) {
  ASN1Class2[ASN1Class2["Universal"] = 0] = "Universal";
  ASN1Class2[ASN1Class2["Application"] = 1] = "Application";
  ASN1Class2[ASN1Class2["ContextSpecific"] = 2] = "ContextSpecific";
  ASN1Class2[ASN1Class2["Private"] = 3] = "Private";
})(ASN1Class || (ASN1Class = {}));
var ASN1Form;
(function(ASN1Form2) {
  ASN1Form2[ASN1Form2["Primitive"] = 0] = "Primitive";
  ASN1Form2[ASN1Form2["Constructed"] = 1] = "Constructed";
})(ASN1Form || (ASN1Form = {}));
const ASN1_UNIVERSAL_TAG = {
  BOOLEAN: 1,
  INTEGER: 2,
  BIT_STRING: 3,
  OCTET_STRING: 4,
  NULL: 5,
  OBJECT_IDENTIFIER: 6,
  REAL: 9,
  ENUMERATED: 10,
  UTF8_STRING: 12,
  SEQUENCE: 16,
  SET: 17,
  NUMERIC_STRING: 18,
  PRINTABLE_STRING: 19,
  IA5_STRING: 22,
  UTC_TIME: 23,
  GENERALIZED_TIME: 24
};
const ASN1_UNIVERSAL_TAG_MAP = {
  1: ASN1UniversalType.Boolean,
  2: ASN1UniversalType.Integer,
  3: ASN1UniversalType.BitString,
  4: ASN1UniversalType.OctetString,
  5: ASN1UniversalType.Null,
  6: ASN1UniversalType.ObjectIdentifier,
  7: ASN1UniversalType.ObjectDescriptor,
  8: ASN1UniversalType.External,
  9: ASN1UniversalType.Real,
  10: ASN1UniversalType.Enumerated,
  11: ASN1UniversalType.EmbeddedPDV,
  12: ASN1UniversalType.UTF8String,
  13: ASN1UniversalType.RelativeObjectIdentifier,
  14: ASN1UniversalType.Time,
  16: ASN1UniversalType.Sequence,
  17: ASN1UniversalType.Set,
  18: ASN1UniversalType.NumericString,
  19: ASN1UniversalType.PrintableString,
  20: ASN1UniversalType.TeletexString,
  21: ASN1UniversalType.VideotextString,
  22: ASN1UniversalType.IA5String,
  23: ASN1UniversalType.UTCTime,
  24: ASN1UniversalType.GeneralizedTime,
  25: ASN1UniversalType.GraphicString,
  26: ASN1UniversalType.VisibleString,
  27: ASN1UniversalType.GeneralString,
  28: ASN1UniversalType.UniversalString,
  29: ASN1UniversalType.CharacterString,
  30: ASN1UniversalType.BMPString
};
class ASN1ParseError extends Error {
  constructor() {
    super("Failed to parse ASN.1");
  }
}
class ASN1DecodeError extends Error {
  constructor() {
    super("Failed to decode ASN.1");
  }
}
class ASN1EncodeError extends Error {
  constructor() {
    super("Failed to encode ASN.1");
  }
}
class ASN1LeftoverBytesError extends Error {
  constructor(count) {
    super(`ASN.1 leftover bytes: ${count}`);
  }
}
function verifyECDSASignature(publicKey, hash, signature) {
  const q = new ECDSAPoint(publicKey.x, publicKey.y);
  if (!publicKey.curve.isOnCurve(q)) {
    return false;
  }
  if (publicKey.curve.multiply(publicKey.curve.n, q) !== null) {
    return false;
  }
  const e = hash.slice(0, publicKey.curve.size);
  const u1 = euclideanMod(bigIntFromBytes(e) * inverseMod(signature.s, publicKey.curve.n), publicKey.curve.n);
  const u1G = publicKey.curve.multiply(u1, publicKey.curve.g);
  if (u1G === null) {
    return false;
  }
  const u2 = euclideanMod(signature.r * inverseMod(signature.s, publicKey.curve.n), publicKey.curve.n);
  const u2Q = publicKey.curve.multiply(u2, q);
  if (u2Q === null) {
    return false;
  }
  const coord1 = publicKey.curve.add(u1G, u2Q);
  if (coord1 === null) {
    return false;
  }
  return euclideanMod(signature.r, publicKey.curve.n) === coord1.x;
}
class ECDSAPublicKey {
  curve;
  x;
  y;
  constructor(curve, x, y) {
    this.curve = curve;
    this.x = x;
    this.y = y;
  }
  isCurve(curve) {
    return this.curve.objectIdentifier === curve.objectIdentifier;
  }
  encodeSEC1Uncompressed() {
    const bytes = new Uint8Array(1 + this.curve.size * 2);
    bytes[0] = 4;
    const xBytes = bigIntBytes(this.x);
    const yBytes = bigIntBytes(this.y);
    bytes.set(xBytes, 1 + this.curve.size - xBytes.byteLength);
    bytes.set(yBytes, 1 + this.curve.size);
    return bytes;
  }
  encodeSEC1Compressed() {
    const bytes = new Uint8Array(1 + this.curve.size);
    if (this.y % 2n === 0n) {
      bytes[0] = 2;
    } else {
      bytes[0] = 3;
    }
    const xBytes = bigIntBytes(this.x);
    bytes.set(xBytes, 1 + this.curve.size - xBytes.byteLength);
    return bytes;
  }
  encodePKIXUncompressed() {
    const algorithmIdentifier = new ASN1EncodableSequence([
      new ASN1ObjectIdentifier(encodeObjectIdentifier("1.2.840.10045.2.1")),
      new ASN1ObjectIdentifier(encodeObjectIdentifier(this.curve.objectIdentifier))
    ]);
    const encoded = this.encodeSEC1Uncompressed();
    const subjectPublicKey = new ASN1BitString(encoded, encoded.byteLength * 8);
    const subjectPublicKeyInfo = new ASN1EncodableSequence([algorithmIdentifier, subjectPublicKey]);
    return encodeASN1(subjectPublicKeyInfo);
  }
  encodePKIXCompressed() {
    const algorithmIdentifier = new ASN1EncodableSequence([
      new ASN1ObjectIdentifier(encodeObjectIdentifier("1.2.840.10045.2.1")),
      new ASN1ObjectIdentifier(encodeObjectIdentifier(this.curve.objectIdentifier))
    ]);
    const encoded = this.encodeSEC1Compressed();
    const subjectPublicKey = new ASN1BitString(encoded, encoded.byteLength * 8);
    const subjectPublicKeyInfo = new ASN1EncodableSequence([algorithmIdentifier, subjectPublicKey]);
    return encodeASN1(subjectPublicKeyInfo);
  }
}
function decodeSEC1PublicKey(curve, bytes) {
  if (bytes.byteLength < 1) {
    throw new Error("Invalid public key");
  }
  if (bytes[0] === 4) {
    if (bytes.byteLength !== curve.size * 2 + 1) {
      throw new Error("Invalid public key");
    }
    const x = bigIntFromBytes(bytes.slice(1, curve.size + 1));
    const y = bigIntFromBytes(bytes.slice(curve.size + 1));
    return new ECDSAPublicKey(curve, x, y);
  }
  if (bytes[0] === 2) {
    if (bytes.byteLength !== curve.size + 1) {
      throw new Error("Invalid public key");
    }
    const x = bigIntFromBytes(bytes.slice(1));
    const y2 = euclideanMod(x ** 3n + curve.a * x + curve.b, curve.p);
    const y = tonelliShanks(y2, curve.p);
    if (y % 2n === 0n) {
      return new ECDSAPublicKey(curve, x, y);
    }
    return new ECDSAPublicKey(curve, x, curve.p - y);
  }
  if (bytes[0] === 3) {
    if (bytes.byteLength !== curve.size + 1) {
      throw new Error("Invalid public key");
    }
    const x = bigIntFromBytes(bytes.slice(1));
    const y2 = euclideanMod(x ** 3n + curve.a * x + curve.b, curve.p);
    const y = tonelliShanks(y2, curve.p);
    if (y % 2n === 1n) {
      return new ECDSAPublicKey(curve, x, y);
    }
    return new ECDSAPublicKey(curve, x, curve.p - y);
  }
  throw new Error("Unknown encoding format");
}
class ECDSASignature {
  r;
  s;
  constructor(r, s) {
    if (r < 1n || s < 1n) {
      throw new TypeError("Invalid signature");
    }
    this.r = r;
    this.s = s;
  }
  encodeIEEEP1363(curve) {
    const rs = new Uint8Array(curve.size * 2);
    const rBytes = bigIntBytes(this.r);
    if (rBytes.byteLength > curve.size) {
      throw new Error("'r' is too large");
    }
    const sBytes = bigIntBytes(this.s);
    if (rBytes.byteLength > curve.size) {
      throw new Error("'s' is too large");
    }
    rs.set(rBytes, curve.size - rBytes.byteLength);
    rs.set(sBytes, rs.byteLength - sBytes.byteLength);
    return rs;
  }
  encodePKIX() {
    const asn1 = new ASN1EncodableSequence([new ASN1Integer(this.r), new ASN1Integer(this.s)]);
    return encodeASN1(asn1);
  }
}
function decodePKIXECDSASignature(der) {
  try {
    const sequence = parseASN1NoLeftoverBytes(der).sequence();
    return new ECDSASignature(sequence.at(0).integer().value, sequence.at(1).integer().value);
  } catch {
    throw new Error("Failed to decode signature");
  }
}
const secp256r1 = new ECDSANamedCurve(0xffffffff00000001000000000000000000000000ffffffffffffffffffffffffn, 0xffffffff00000001000000000000000000000000fffffffffffffffffffffffcn, 0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn, 0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296n, 0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5n, 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n, 1n, 32, "1.2.840.10045.3.1.7");
function toFloat16(data) {
  if (data.byteLength !== 2) {
    throw new TypeError();
  }
  const sign = (-1) ** (data[0] >> 7);
  let fraction = 0;
  fraction += 2 ** -1 * (data[0] >> 1 & 1);
  fraction += 2 ** -2 * (data[0] & 1);
  for (let i = 0; i < 8; i++) {
    if ((data[1] >> 7 - i & 1) === 1) {
      fraction += 2 ** -(3 + i);
    }
  }
  const exponent = data[0] >> 2 & 31;
  if (exponent === 0) {
    return sign * 2 ** -14 * fraction;
  }
  if (exponent === 31 && fraction === 0) {
    return sign * Infinity;
  }
  if (exponent === 31 && fraction !== 0) {
    return NaN;
  }
  return sign * 2 ** (exponent - 15) * (1 + fraction);
}
function toFloat32(data) {
  if (data.byteLength !== 4) {
    throw new TypeError();
  }
  const sign = (-1) ** (data[0] >> 7);
  const exponent = ((data[0] & 127) << 1) + (data[1] >> 7);
  let fractionPart = data[1] & 127;
  for (let i = 0; i < 3; i++) {
    fractionPart |= data[2 + i];
  }
  if (exponent === 255 && fractionPart === 0) {
    return sign * Infinity;
  }
  if (exponent === 255 && fractionPart !== 0) {
    return NaN;
  }
  let bias;
  let result;
  if (exponent === 0) {
    bias = 126;
    result = 0;
  } else {
    bias = 127;
    result = 2 ** (exponent - bias);
  }
  for (let i = 0; i < 7; i++) {
    if ((data[1] >> 6 - i & 1) === 1) {
      result += 2 ** (-1 - i + exponent - bias);
    }
  }
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 8; j++) {
      if ((data[2 + i] >> 7 - j & 1) === 1) {
        const position = 8 + i * 8 + j;
        result += 2 ** (exponent - bias - position);
      }
    }
  }
  return sign * result;
}
function toFloat64(data) {
  if (data.byteLength !== 8) {
    throw new TypeError();
  }
  const sign = (-1) ** (data[0] >> 7);
  const exponent = ((data[0] & 127) << 4) + (data[1] >> 4);
  let fractionPart = data[1] & 15;
  for (let i = 0; i < 6; i++) {
    fractionPart |= data[2 + i];
  }
  if (exponent === 2047 && fractionPart === 0) {
    return sign * Infinity;
  }
  if (exponent === 2047 && fractionPart !== 0) {
    return NaN;
  }
  let bias;
  let result;
  if (exponent === 0) {
    bias = 1022;
    result = 0;
  } else {
    bias = 1023;
    result = 2 ** (exponent - bias);
  }
  for (let i = 0; i < 4; i++) {
    if ((data[1] >> 3 - i & 1) === 1) {
      result += 2 ** (-1 - i + exponent - bias);
    }
  }
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 8; j++) {
      if ((data[2 + i] >> 7 - j & 1) === 1) {
        const position = 5 + i * 8 + j;
        result += 2 ** (exponent - bias - position);
      }
    }
  }
  return sign * result;
}
class CBORPositiveInteger {
  value;
  constructor(value) {
    if (value < 0) {
      throw new TypeError();
    }
    this.value = value;
  }
  isNumber() {
    return BigInt(Number(this.value)) === this.value;
  }
}
class CBORNegativeInteger {
  value;
  constructor(value) {
    if (value > -1) {
      throw new TypeError();
    }
    this.value = value;
  }
  isNumber() {
    return BigInt(Number(this.value)) === this.value;
  }
}
class CBORByteString {
  value;
  constructor(value) {
    this.value = value;
  }
}
class CBORTextString {
  value;
  constructor(value) {
    this.value = value;
  }
  decodeText() {
    try {
      return new TextDecoder("utf-8", {
        fatal: true
      }).decode(this.value);
    } catch {
      throw new CBORInvalidError();
    }
  }
}
class CBORArray {
  elements;
  constructor(elements) {
    this.elements = elements;
  }
}
class CBORMap {
  entries;
  constructor(entries) {
    this.entries = entries;
  }
  has(key) {
    for (const [entryKey] of this.entries) {
      if (compareCBORValues(key, entryKey)) {
        return true;
      }
    }
    return false;
  }
  get(key) {
    for (const [entryKey, entryValue] of this.entries) {
      if (compareCBORValues(key, entryKey)) {
        return entryValue;
      }
    }
    return null;
  }
  getAll(key) {
    const result = [];
    for (const [entryKey, entryValue] of this.entries) {
      if (compareCBORValues(key, entryKey)) {
        result.push(entryValue);
      }
    }
    return result;
  }
  hasDuplicateKeys() {
    for (let i = 0; i < this.entries.length; i++) {
      for (let j = i + 1; j < this.entries.length; j++) {
        if (compareCBORValues(this.entries[i][0], this.entries[j][0])) {
          return true;
        }
      }
    }
    return false;
  }
}
class CBORFloat16 {
  value;
  constructor(value) {
    if (value.byteLength !== 2) {
      throw new TypeError();
    }
    this.value = value;
  }
  toNumber() {
    return toFloat16(this.value);
  }
}
class CBORFloat32 {
  value;
  constructor(value) {
    if (value.byteLength !== 4) {
      throw new TypeError();
    }
    this.value = value;
  }
  toNumber() {
    return toFloat32(this.value);
  }
}
class CBORFloat64 {
  value;
  constructor(value) {
    if (value.byteLength !== 8) {
      throw new TypeError();
    }
    this.value = value;
  }
  toNumber() {
    return toFloat64(this.value);
  }
}
class CBORTagged {
  tagNumber;
  value;
  constructor(tagNumber, value) {
    this.tagNumber = tagNumber;
    this.value = value;
  }
}
class CBORSimple {
  value;
  constructor(value) {
    this.value = value;
  }
}
class CBORBreak {
  value = null;
}
function compareCBORValues(a, b) {
  if (a instanceof CBORPositiveInteger && b instanceof CBORPositiveInteger) {
    return a.value === b.value;
  }
  if (a instanceof CBORNegativeInteger && b instanceof CBORNegativeInteger) {
    return a.value === b.value;
  }
  if (a instanceof CBORByteString && b instanceof CBORByteString) {
    return compareBytes(a.value, b.value);
  }
  if (a instanceof CBORTextString && b instanceof CBORTextString) {
    return a.value === b.value;
  }
  if (a instanceof CBORSimple && b instanceof CBORSimple) {
    return a.value === b.value;
  }
  if (a instanceof CBORTagged && b instanceof CBORTagged) {
    return a.tagNumber === b.tagNumber && compareCBORValues(a.value, b.value);
  }
  if (a instanceof CBORFloat16 && b instanceof CBORFloat16) {
    return compareBytes(a.value, b.value);
  }
  if (a instanceof CBORFloat32 && b instanceof CBORFloat32) {
    return compareBytes(a.value, b.value);
  }
  if (a instanceof CBORFloat64 && b instanceof CBORFloat64) {
    return compareBytes(a.value, b.value);
  }
  if (a instanceof CBORArray && b instanceof CBORArray) {
    if (a.elements.length !== b.elements.length) {
      return false;
    }
    for (let i = 0; i < a.elements.length; i++) {
      if (!compareCBORValues(a.elements[i], b.elements[i])) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof CBORMap && b instanceof CBORMap) {
    if (a.entries.length !== b.entries.length) {
      return false;
    }
    const checkedIndexes = [];
    for (let i = 0; i < a.entries.length; i++) {
      for (let j = 0; j < b.entries.length; j++) {
        if (!checkedIndexes.includes(i)) {
          if (!compareCBORValues(a.entries[i][0], b.entries[j][0])) {
            continue;
          }
          if (!compareCBORValues(a.entries[i][1], b.entries[j][1])) {
            continue;
          }
          checkedIndexes.push(j);
          break;
        }
      }
      if (checkedIndexes.length !== i + 1) {
        return false;
      }
    }
    return true;
  }
  return false;
}
class CBORNotWellFormedError extends Error {
  constructor() {
    super("CBOR is not well-formed");
  }
}
class CBORLeftoverBytesError extends Error {
  constructor(count) {
    super(`Leftover bytes: ${count}`);
  }
}
class CBORTooDeepError extends Error {
  constructor() {
    super("Exceeds maximum depth");
  }
}
class CBORInvalidError extends Error {
  constructor() {
    super("Invalid CBOR");
  }
}
function transformCBORValueToNative(cbor) {
  if (cbor instanceof CBORPositiveInteger || cbor instanceof CBORNegativeInteger) {
    if (cbor.isNumber()) {
      return Number(cbor.value);
    }
    return cbor.value;
  }
  if (cbor instanceof CBORTextString) {
    return cbor.decodeText();
  }
  if (cbor instanceof CBORByteString) {
    return cbor.value;
  }
  if (cbor instanceof CBORFloat16 || cbor instanceof CBORFloat32 || cbor instanceof CBORFloat64) {
    return cbor.toNumber();
  }
  if (cbor instanceof CBORSimple) {
    if (cbor.value === 20) {
      return false;
    }
    if (cbor.value === 21) {
      return true;
    }
    if (cbor.value === 22) {
      return null;
    }
    if (cbor.value === 23) {
      return void 0;
    }
    throw new CBORInvalidError();
  }
  if (cbor instanceof CBORArray) {
    const result = new Array(cbor.elements.length);
    for (let i = 0; i < cbor.elements.length; i++) {
      result[i] = transformCBORValueToNative(cbor.elements[i]);
    }
    return result;
  }
  if (cbor instanceof CBORMap) {
    const result = {};
    for (let i = 0; i < cbor.entries.length; i++) {
      const [entryKey, entryValue] = cbor.entries[i];
      let stringifiedKey;
      if (entryKey instanceof CBORTextString) {
        stringifiedKey = entryKey.decodeText();
      } else if (entryKey instanceof CBORPositiveInteger || entryKey instanceof CBORNegativeInteger) {
        stringifiedKey = entryKey.value.toString();
      } else if (entryKey instanceof CBORFloat16 || entryKey instanceof CBORFloat32 || entryKey instanceof CBORFloat64) {
        const valueNumber = entryKey.toNumber();
        if (Number.isNaN(valueNumber)) {
          throw new CBORInvalidError();
        }
        stringifiedKey = valueNumber.toString();
      } else {
        throw new CBORInvalidError();
      }
      if (stringifiedKey === "__proto__") {
        throw new CBORInvalidError();
      }
      if (stringifiedKey in result) {
        throw new CBORInvalidError();
      }
      result[stringifiedKey] = transformCBORValueToNative(entryValue);
    }
    return result;
  }
  if (cbor instanceof CBORTagged) {
    return transformCBORValueToNative(cbor.value);
  }
  throw new CBORInvalidError();
}
function decodeCBORToNativeValueNoLeftoverBytes(data, maxDepth) {
  const decoded = decodeCBORNoLeftoverBytes(data, maxDepth);
  return transformCBORValueToNative(decoded);
}
function decodeCBORToNativeValue(data, maxDepth) {
  const [decoded, size] = decodeCBOR(data, maxDepth);
  return [transformCBORValueToNative(decoded), size];
}
function decodeCBORNoLeftoverBytes(data, maxDepth) {
  const [result, size] = decodeCBOR(data, maxDepth);
  if (size !== data.byteLength) {
    throw new CBORLeftoverBytesError(data.byteLength - size);
  }
  return result;
}
function decodeCBOR(data, maxDepth) {
  const [value, size] = decodeCBORIncludingBreaks(data, maxDepth, 0);
  if (value instanceof CBORBreak) {
    throw new CBORNotWellFormedError();
  }
  return [value, size];
}
function decodeCBORIncludingBreaks(data, maxDepth, currentDepth) {
  if (currentDepth > maxDepth) {
    throw new CBORTooDeepError();
  }
  if (data.byteLength < 1) {
    throw new CBORNotWellFormedError();
  }
  const majorType = data[0] >> 5;
  if (majorType === 0) {
    const additionalInformation = data[0] & 31;
    if (additionalInformation < 24) {
      return [new CBORPositiveInteger(BigInt(additionalInformation)), 1];
    }
    const argumentSize = getArgumentSize(additionalInformation);
    const value = getVariableUint(data, argumentSize, 1);
    return [new CBORPositiveInteger(value), 1 + argumentSize];
  }
  if (majorType === 1) {
    const additionalInformation = data[0] & 31;
    if (additionalInformation < 24) {
      return [new CBORNegativeInteger(BigInt(-1 - additionalInformation)), 1];
    }
    const argumentSize = getArgumentSize(additionalInformation);
    const value = getVariableUint(data, argumentSize, 1);
    return [new CBORNegativeInteger(-1n - BigInt(value)), 1 + argumentSize];
  }
  if (majorType === 2) {
    const additionalInformation = data[0] & 31;
    if (additionalInformation === 31) {
      let offset2 = 1;
      let size = offset2;
      const buffer = new DynamicBuffer(0);
      while (true) {
        if (data.byteLength < offset2 + 1) {
          throw new CBORNotWellFormedError();
        }
        const innerMajorType = data[offset2] >> 5;
        const innerAdditionalInformation = data[offset2] & 31;
        if (innerMajorType === 7 && innerAdditionalInformation === 31) {
          size += 1;
          break;
        }
        if (innerMajorType !== 2) {
          throw new CBORNotWellFormedError();
        }
        let innerByteSize;
        let innerOffset;
        if (innerAdditionalInformation < 24) {
          innerByteSize = innerAdditionalInformation;
          innerOffset = 1;
        } else {
          const innerArgumentSize = getArgumentSize(innerAdditionalInformation);
          innerByteSize = Number(getVariableUint(data, innerArgumentSize, offset2 + 1));
          innerOffset = 1 + innerArgumentSize;
        }
        if (data.byteLength < offset2 + innerByteSize) {
          throw new CBORNotWellFormedError();
        }
        buffer.write(data.subarray(offset2 + innerOffset, offset2 + innerOffset + innerByteSize));
        size += innerOffset + innerByteSize;
        offset2 += innerOffset + innerByteSize;
      }
      return [new CBORByteString(buffer.bytes()), size];
    }
    let offset;
    let byteSize;
    if (additionalInformation < 24) {
      byteSize = additionalInformation;
      offset = 1;
    } else {
      const argumentSize = getArgumentSize(additionalInformation);
      byteSize = Number(getVariableUint(data, argumentSize, 1));
      offset = 1 + argumentSize;
    }
    if (data.byteLength < offset + byteSize) {
      throw new CBORNotWellFormedError();
    }
    const value = data.slice(offset, offset + byteSize);
    return [new CBORByteString(value), offset + byteSize];
  }
  if (majorType === 3) {
    const additionalInformation = data[0] & 31;
    let offset;
    if (additionalInformation === 31) {
      offset = 1;
      let size = offset;
      const buffer = new DynamicBuffer(0);
      while (true) {
        if (data.byteLength < offset + 1) {
          throw new CBORNotWellFormedError();
        }
        const innerMajorType = data[offset] >> 5;
        const innerAdditionalInformation = data[offset] & 31;
        if (innerMajorType === 7 && innerAdditionalInformation === 31) {
          offset += 1;
          size += 1;
          break;
        }
        if (innerMajorType !== 3) {
          throw new CBORNotWellFormedError();
        }
        let innerByteSize;
        let innerOffset;
        if (innerAdditionalInformation < 24) {
          innerByteSize = innerAdditionalInformation;
          innerOffset = 1;
        } else {
          const innerArgumentSize = getArgumentSize(innerAdditionalInformation);
          innerByteSize = Number(getVariableUint(data, innerArgumentSize, offset + 1));
          innerOffset = 1 + innerArgumentSize;
        }
        if (data.byteLength < offset + innerByteSize) {
          throw new CBORNotWellFormedError();
        }
        buffer.write(data.subarray(offset + innerOffset, offset + innerOffset + innerByteSize));
        size += innerOffset + innerByteSize;
        offset += innerOffset + innerByteSize;
      }
      return [new CBORTextString(buffer.bytes()), size];
    }
    let byteSize;
    if (additionalInformation < 24) {
      byteSize = additionalInformation;
      offset = 1;
    } else {
      const argumentSize = getArgumentSize(additionalInformation);
      byteSize = Number(getVariableUint(data, argumentSize, 1));
      offset = 1 + argumentSize;
    }
    if (data.byteLength < offset + byteSize) {
      throw new CBORNotWellFormedError();
    }
    const value = data.slice(offset, offset + byteSize);
    return [new CBORTextString(value), offset + byteSize];
  }
  if (majorType === 4) {
    const additionalInformation = data[0] & 31;
    let offset = 1;
    if (additionalInformation === 31) {
      let size2 = offset;
      const elements2 = [];
      while (true) {
        const [element, elementByteSize] = decodeCBORIncludingBreaks(data.subarray(offset), maxDepth, currentDepth + 1);
        size2 += elementByteSize;
        if (element instanceof CBORBreak) {
          break;
        }
        offset += elementByteSize;
        elements2.push(element);
      }
      return [new CBORArray(elements2), size2];
    }
    let arraySize;
    if (additionalInformation < 24) {
      arraySize = additionalInformation;
    } else {
      const argumentSize = getArgumentSize(additionalInformation);
      arraySize = Number(getVariableUint(data, argumentSize, 1));
      offset += argumentSize;
    }
    const elements = new Array(arraySize);
    let size = offset;
    for (let i = 0; i < arraySize; i++) {
      const [element, elementByteSize] = decodeCBORIncludingBreaks(data.subarray(offset), maxDepth, currentDepth + 1);
      if (element instanceof CBORBreak) {
        throw new CBORNotWellFormedError();
      }
      offset += elementByteSize;
      size += elementByteSize;
      elements[i] = element;
    }
    return [new CBORArray(elements), size];
  }
  if (majorType === 5) {
    const additionalInformation = data[0] & 31;
    let offset = 1;
    if (additionalInformation === 31) {
      let size2 = offset;
      const entries = [];
      while (true) {
        const [entryKey, keyByteSize] = decodeCBORIncludingBreaks(data.subarray(offset), maxDepth, currentDepth + 1);
        if (entryKey instanceof CBORBreak) {
          size2 += keyByteSize;
          break;
        }
        offset += keyByteSize;
        size2 += keyByteSize;
        const [entryValue, valueByteSize] = decodeCBORIncludingBreaks(data.subarray(offset), maxDepth, currentDepth + 1);
        if (entryValue instanceof CBORBreak) {
          throw new CBORNotWellFormedError();
        }
        entries.push([entryKey, entryValue]);
        offset += valueByteSize;
        size2 += valueByteSize;
      }
      return [new CBORMap(entries), size2];
    }
    let pairCount;
    if (additionalInformation < 24) {
      pairCount = additionalInformation;
    } else {
      const argumentSize = getArgumentSize(additionalInformation);
      pairCount = Number(getVariableUint(data, argumentSize, 1));
      offset += argumentSize;
    }
    if (pairCount > data.byteLength) {
      throw new CBORNotWellFormedError();
    }
    const value = new Array(pairCount);
    let size = offset;
    for (let i = 0; i < pairCount; i++) {
      const [entryKey, keyByteSize] = decodeCBORIncludingBreaks(data.subarray(offset), maxDepth, currentDepth + 1);
      if (entryKey instanceof CBORBreak) {
        throw new CBORNotWellFormedError();
      }
      offset += keyByteSize;
      size += keyByteSize;
      const [entryValue, valueByteSize] = decodeCBORIncludingBreaks(data.subarray(offset), maxDepth, currentDepth + 1);
      if (entryValue instanceof CBORBreak) {
        throw new CBORNotWellFormedError();
      }
      value[i] = [entryKey, entryValue];
      offset += valueByteSize;
      size += valueByteSize;
    }
    return [new CBORMap(value), size];
  }
  if (majorType === 6) {
    const additionalInformation = data[0] & 31;
    let tagNumber;
    let headSize;
    if (additionalInformation < 24) {
      tagNumber = BigInt(additionalInformation);
      headSize = 1;
    } else {
      const argumentSize = getArgumentSize(additionalInformation);
      tagNumber = getVariableUint(data, argumentSize, 1);
      headSize = 1 + argumentSize;
    }
    const [value, valueSize] = decodeCBORIncludingBreaks(data.subarray(headSize), maxDepth, currentDepth + 1);
    return [new CBORTagged(tagNumber, value), headSize + valueSize];
  }
  if (majorType === 7) {
    const additionalInformation = data[0] & 31;
    if (additionalInformation < 24) {
      return [new CBORSimple(additionalInformation), 1];
    }
    if (additionalInformation === 24) {
      if (data.byteLength < 2) {
        throw new CBORNotWellFormedError();
      }
      if (data[1] < 24) {
        throw new CBORNotWellFormedError();
      }
      return [new CBORSimple(data[1]), 2];
    }
    if (additionalInformation === 25) {
      if (data.byteLength < 2) {
        throw new CBORNotWellFormedError();
      }
      return [new CBORFloat16(data.subarray(1, 3)), 3];
    }
    if (additionalInformation === 26) {
      if (data.byteLength < 4) {
        throw new CBORNotWellFormedError();
      }
      return [new CBORFloat32(data.subarray(1, 5)), 5];
    }
    if (additionalInformation === 27) {
      if (data.byteLength < 8) {
        throw new CBORNotWellFormedError();
      }
      return [new CBORFloat64(data.subarray(1, 9)), 9];
    }
    if (additionalInformation === 31) {
      return [new CBORBreak(), 1];
    }
    throw new CBORNotWellFormedError();
  }
  throw new CBORNotWellFormedError();
}
function getArgumentSize(additionalInformation) {
  if (additionalInformation === 24) {
    return 1;
  } else if (additionalInformation === 25) {
    return 2;
  } else if (additionalInformation === 26) {
    return 4;
  } else if (additionalInformation === 27) {
    return 8;
  } else {
    throw new CBORNotWellFormedError();
  }
}
function getVariableUint(data, size, offset) {
  if (data.byteLength < size + offset) {
    throw new Error();
  }
  if (size === 1) {
    return BigInt(data[offset]);
  }
  if (size === 2) {
    return BigInt(bigEndian.uint16(data, offset));
  }
  if (size === 4) {
    return BigInt(bigEndian.uint32(data, offset));
  }
  if (size === 8) {
    return bigEndian.uint64(data, offset);
  }
  throw new TypeError("Invalid size");
}
var EncodingPadding$1;
(function(EncodingPadding2) {
  EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
  EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
})(EncodingPadding$1 || (EncodingPadding$1 = {}));
var DecodingPadding$1;
(function(DecodingPadding2) {
  DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
  DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
})(DecodingPadding$1 || (DecodingPadding$1 = {}));
function decodeBase64urlIgnorePadding(encoded) {
  return decodeBase64_internal(encoded, base64urlDecodeMap, DecodingPadding.Ignore);
}
function decodeBase64_internal(encoded, decodeMap, padding) {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i = 0; i < encoded.length; i += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j = 0; j < 4; j++) {
      if (padding === DecodingPadding.Required && encoded[i + j] === "=") {
        continue;
      }
      if (padding === DecodingPadding.Ignore && (i + j >= encoded.length || encoded[i + j] === "=")) {
        continue;
      }
      if (j > 0 && encoded[i + j - 1] === "=") {
        throw new Error("Invalid padding");
      }
      if (!(encoded[i + j] in decodeMap)) {
        throw new Error("Invalid character");
      }
      chunk |= decodeMap[encoded[i + j]] << (3 - j) * 6;
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused;
      if (bitsRead === 12) {
        unused = chunk & 65535;
      } else if (bitsRead === 18) {
        unused = chunk & 255;
      } else {
        throw new Error("Invalid padding");
      }
      if (unused !== 0) {
        throw new Error("Invalid padding");
      }
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i2 = 0; i2 < byteLength; i2++) {
      result[totalBytes] = chunk >> 16 - i2 * 8 & 255;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}
var EncodingPadding;
(function(EncodingPadding2) {
  EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
  EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
})(EncodingPadding || (EncodingPadding = {}));
var DecodingPadding;
(function(DecodingPadding2) {
  DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
  DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
})(DecodingPadding || (DecodingPadding = {}));
const base64urlDecodeMap = {
  "0": 52,
  "1": 53,
  "2": 54,
  "3": 55,
  "4": 56,
  "5": 57,
  "6": 58,
  "7": 59,
  "8": 60,
  "9": 61,
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  a: 26,
  b: 27,
  c: 28,
  d: 29,
  e: 30,
  f: 31,
  g: 32,
  h: 33,
  i: 34,
  j: 35,
  k: 36,
  l: 37,
  m: 38,
  n: 39,
  o: 40,
  p: 41,
  q: 42,
  r: 43,
  s: 44,
  t: 45,
  u: 46,
  v: 47,
  w: 48,
  x: 49,
  y: 50,
  z: 51,
  "-": 62,
  _: 63
};
function decodeCOSEPublicKey(data) {
  let decoded;
  let size;
  try {
    [decoded, size] = decodeCBORToNativeValue(data, 4);
  } catch {
    throw new Error("Failed to decode CBOR");
  }
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid CBOR map");
  }
  return [new COSEPublicKey(decoded), size];
}
class COSEPublicKey {
  decoded;
  constructor(decoded) {
    this.decoded = decoded;
  }
  type() {
    if (!(1 in this.decoded) || typeof this.decoded[1] !== "number") {
      throw new Error("Invalid or missing parameter 'kty'");
    }
    const typeId = this.decoded[1];
    if (typeId in COSE_KEY_ID_MAP) {
      return COSE_KEY_ID_MAP[typeId];
    }
    throw new Error(`Unknown 'kty' value '${typeId}'`);
  }
  isAlgorithmDefined() {
    if (!(3 in this.decoded)) {
      return false;
    }
    if (typeof this.decoded[3] !== "number") {
      throw new Error("Invalid parameter 'alg'");
    }
    return true;
  }
  algorithm() {
    if (!(3 in this.decoded) || typeof this.decoded[3] !== "number") {
      throw new Error("Invalid or missing parameter 'alg'");
    }
    return this.decoded[3];
  }
  ec2() {
    if (this.type() !== COSEKeyType.EC2) {
      throw new Error("Expected an elliptic curve public key");
    }
    if (!("-1" in this.decoded) || typeof this.decoded["-1"] !== "number") {
      throw new Error("Invalid or missing parameter 'crv'");
    }
    const curve = this.decoded["-1"];
    if (!("-2" in this.decoded) || !(this.decoded["-2"] instanceof Uint8Array)) {
      throw new Error("Invalid or missing parameter 'x'");
    }
    const xBytes = this.decoded["-2"];
    if (xBytes.byteLength !== 32) {
      throw new Error("Invalid or missing parameter 'x'");
    }
    if (!("-3" in this.decoded) || !(this.decoded["-3"] instanceof Uint8Array)) {
      throw new Error("Invalid or missing parameter 'y'");
    }
    const yBytes = this.decoded["-3"];
    if (yBytes.byteLength !== 32) {
      throw new Error("Invalid or missing parameter 'y'");
    }
    const publicKey = {
      curve,
      x: bigIntFromBytes(xBytes),
      y: bigIntFromBytes(yBytes)
    };
    return publicKey;
  }
  rsa() {
    if (this.type() !== COSEKeyType.RSA) {
      throw new Error("Expected an RSA public key");
    }
    if (!("-1" in this.decoded) || !(this.decoded["-1"] instanceof Uint8Array)) {
      throw new Error("Invalid or missing parameter 'n'");
    }
    const nBytes = this.decoded["-1"];
    if (nBytes.byteLength !== 256) {
      throw new Error("Invalid or missing parameter 'n'");
    }
    if (!("-2" in this.decoded) || !(this.decoded["-2"] instanceof Uint8Array)) {
      throw new Error("Invalid or missing parameter 'e'");
    }
    const eBytes = this.decoded["-2"];
    if (eBytes.byteLength !== 3) {
      throw new Error("Invalid or missing parameter 'e'");
    }
    const publicKey = {
      n: bigIntFromBytes(nBytes),
      e: bigIntFromBytes(eBytes)
    };
    return publicKey;
  }
  okp() {
    if (this.type() !== COSEKeyType.OKP) {
      throw new Error("Expected an octet key pair public key");
    }
    if (!("-1" in this.decoded) || typeof this.decoded["-1"] !== "number") {
      throw new Error("Invalid or missing parameter 'curve'");
    }
    const curve = this.decoded["-1"];
    if (!("-2" in this.decoded) || !(this.decoded["-2"] instanceof Uint8Array)) {
      throw new Error("Invalid or missing parameter 'x'");
    }
    const x = this.decoded["-2"];
    if ("-4" in this.decoded) {
      throw new Error("Unexpected parameter 'd'");
    }
    const publicKey = {
      curve,
      x
    };
    return publicKey;
  }
  symmetric() {
    if (this.type() !== COSEKeyType.Symmetric) {
      throw new Error("Expected an symmetric key");
    }
    if (!("-1" in this.decoded) || !(this.decoded["-1"] instanceof Uint8Array)) {
      throw new Error("Invalid or missing parameter 'k'");
    }
    const k = this.decoded["-1"];
    return k;
  }
}
const coseAlgorithmES256 = -7;
const coseAlgorithmRS256 = -257;
const coseEllipticCurveP256 = 1;
var COSEKeyType;
(function(COSEKeyType2) {
  COSEKeyType2[COSEKeyType2["OKP"] = 0] = "OKP";
  COSEKeyType2[COSEKeyType2["EC2"] = 1] = "EC2";
  COSEKeyType2[COSEKeyType2["RSA"] = 2] = "RSA";
  COSEKeyType2[COSEKeyType2["Symmetric"] = 3] = "Symmetric";
  COSEKeyType2[COSEKeyType2["HSSLMS"] = 4] = "HSSLMS";
  COSEKeyType2[COSEKeyType2["WalnutDSA"] = 5] = "WalnutDSA";
})(COSEKeyType || (COSEKeyType = {}));
const COSE_KEY_ID_MAP = {
  1: COSEKeyType.OKP,
  2: COSEKeyType.EC2,
  3: COSEKeyType.RSA,
  4: COSEKeyType.Symmetric,
  5: COSEKeyType.HSSLMS,
  6: COSEKeyType.WalnutDSA
};
function sha256(data) {
  const hash = new SHA2562();
  hash.update(data);
  return hash.digest();
}
class SHA2562 {
  blockSize = 64;
  size = 32;
  blocks = new Uint8Array(64);
  currentBlockSize = 0;
  H = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  l = 0n;
  w = new Uint32Array(64);
  update(data) {
    this.l += BigInt(data.byteLength) * 8n;
    if (this.currentBlockSize + data.byteLength < 64) {
      this.blocks.set(data, this.currentBlockSize);
      this.currentBlockSize += data.byteLength;
      return;
    }
    let processed = 0;
    if (this.currentBlockSize > 0) {
      const next = data.slice(0, 64 - this.currentBlockSize);
      this.blocks.set(next, this.currentBlockSize);
      this.process();
      processed += next.byteLength;
      this.currentBlockSize = 0;
    }
    while (processed + 64 <= data.byteLength) {
      const next = data.slice(processed, processed + 64);
      this.blocks.set(next);
      this.process();
      processed += 64;
    }
    if (data.byteLength - processed > 0) {
      const remaining = data.slice(processed);
      this.blocks.set(remaining);
      this.currentBlockSize = remaining.byteLength;
    }
  }
  digest() {
    this.blocks[this.currentBlockSize] = 128;
    this.currentBlockSize += 1;
    if (64 - this.currentBlockSize < 8) {
      this.blocks.fill(0, this.currentBlockSize);
      this.process();
      this.currentBlockSize = 0;
    }
    this.blocks.fill(0, this.currentBlockSize);
    bigEndian.putUint64(this.blocks, this.l, this.blockSize - 8);
    this.process();
    const result = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
      bigEndian.putUint32(result, this.H[i], i * 4);
    }
    return result;
  }
  process() {
    for (let t = 0; t < 16; t++) {
      this.w[t] = (this.blocks[t * 4] << 24 | this.blocks[t * 4 + 1] << 16 | this.blocks[t * 4 + 2] << 8 | this.blocks[t * 4 + 3]) >>> 0;
    }
    for (let t = 16; t < 64; t++) {
      const sigma1 = (rotr32(this.w[t - 2], 17) ^ rotr32(this.w[t - 2], 19) ^ this.w[t - 2] >>> 10) >>> 0;
      const sigma0 = (rotr32(this.w[t - 15], 7) ^ rotr32(this.w[t - 15], 18) ^ this.w[t - 15] >>> 3) >>> 0;
      this.w[t] = sigma1 + this.w[t - 7] + sigma0 + this.w[t - 16] | 0;
    }
    let a = this.H[0];
    let b = this.H[1];
    let c = this.H[2];
    let d = this.H[3];
    let e = this.H[4];
    let f = this.H[5];
    let g = this.H[6];
    let h = this.H[7];
    for (let t = 0; t < 64; t++) {
      const sigma1 = (rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)) >>> 0;
      const ch = (e & f ^ ~e & g) >>> 0;
      const t1 = h + sigma1 + ch + K[t] + this.w[t] | 0;
      const sigma0 = (rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)) >>> 0;
      const maj = (a & b ^ a & c ^ b & c) >>> 0;
      const t2 = sigma0 + maj | 0;
      h = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    this.H[0] = a + this.H[0] | 0;
    this.H[1] = b + this.H[1] | 0;
    this.H[2] = c + this.H[2] | 0;
    this.H[3] = d + this.H[3] | 0;
    this.H[4] = e + this.H[4] | 0;
    this.H[5] = f + this.H[5] | 0;
    this.H[6] = g + this.H[6] | 0;
    this.H[7] = h + this.H[7] | 0;
  }
}
const K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
new BigUint64Array([
  0x428a2f98d728ae22n,
  0x7137449123ef65cdn,
  0xb5c0fbcfec4d3b2fn,
  0xe9b5dba58189dbbcn,
  0x3956c25bf348b538n,
  0x59f111f1b605d019n,
  0x923f82a4af194f9bn,
  0xab1c5ed5da6d8118n,
  0xd807aa98a3030242n,
  0x12835b0145706fben,
  0x243185be4ee4b28cn,
  0x550c7dc3d5ffb4e2n,
  0x72be5d74f27b896fn,
  0x80deb1fe3b1696b1n,
  0x9bdc06a725c71235n,
  0xc19bf174cf692694n,
  0xe49b69c19ef14ad2n,
  0xefbe4786384f25e3n,
  0x0fc19dc68b8cd5b5n,
  0x240ca1cc77ac9c65n,
  0x2de92c6f592b0275n,
  0x4a7484aa6ea6e483n,
  0x5cb0a9dcbd41fbd4n,
  0x76f988da831153b5n,
  0x983e5152ee66dfabn,
  0xa831c66d2db43210n,
  0xb00327c898fb213fn,
  0xbf597fc7beef0ee4n,
  0xc6e00bf33da88fc2n,
  0xd5a79147930aa725n,
  0x06ca6351e003826fn,
  0x142929670a0e6e70n,
  0x27b70a8546d22ffcn,
  0x2e1b21385c26c926n,
  0x4d2c6dfc5ac42aedn,
  0x53380d139d95b3dfn,
  0x650a73548baf63den,
  0x766a0abb3c77b2a8n,
  0x81c2c92e47edaee6n,
  0x92722c851482353bn,
  0xa2bfe8a14cf10364n,
  0xa81a664bbc423001n,
  0xc24b8b70d0f89791n,
  0xc76c51a30654be30n,
  0xd192e819d6ef5218n,
  0xd69906245565a910n,
  0xf40e35855771202an,
  0x106aa07032bbd1b8n,
  0x19a4c116b8d2d0c8n,
  0x1e376c085141ab53n,
  0x2748774cdf8eeb99n,
  0x34b0bcb5e19b48a8n,
  0x391c0cb3c5c95a63n,
  0x4ed8aa4ae3418acbn,
  0x5b9cca4f7763e373n,
  0x682e6ff3d6b2b8a3n,
  0x748f82ee5defb2fcn,
  0x78a5636f43172f60n,
  0x84c87814a1f0ab72n,
  0x8cc702081a6439ecn,
  0x90befffa23631e28n,
  0xa4506cebde82bde9n,
  0xbef9a3f7b2c67915n,
  0xc67178f2e372532bn,
  0xca273eceea26619cn,
  0xd186b8c721c0c207n,
  0xeada7dd6cde0eb1en,
  0xf57d4f7fee6ed178n,
  0x06f067aa72176fban,
  0x0a637dc5a2c898a6n,
  0x113f9804bef90daen,
  0x1b710b35131c471bn,
  0x28db77f523047d84n,
  0x32caab7b40c72493n,
  0x3c9ebe0a15c9bebcn,
  0x431d67c49c100d4cn,
  0x4cc5d4becb3e42b6n,
  0x597f299cfc657e2an,
  0x5fcb6fab3ad6faecn,
  0x6c44198c4a475817n
]);
function parseClientDataJSON(encoded) {
  let parsed;
  try {
    parsed = JSON.parse(new TextDecoder().decode(encoded));
  } catch {
    throw new ClientDataParseError("Invalid client data JSON");
  }
  if (parsed === null || typeof parsed !== "object") {
    throw new ClientDataParseError("Invalid client data JSON");
  }
  if (!("type" in parsed)) {
    throw new ClientDataParseError("Missing or invalid property 'type'");
  }
  let type;
  if (parsed.type === "webauthn.get") {
    type = ClientDataType.Get;
  } else if (parsed.type === "webauthn.create") {
    type = ClientDataType.Create;
  } else {
    throw new ClientDataParseError("Missing or invalid property 'type'");
  }
  if (!("challenge" in parsed) || typeof parsed.challenge !== "string") {
    throw new ClientDataParseError("Missing or invalid property 'challenge'");
  }
  let challenge;
  try {
    challenge = decodeBase64urlIgnorePadding(parsed.challenge);
  } catch {
    throw new ClientDataParseError("Missing or invalid property 'challenge'");
  }
  if (!("origin" in parsed) || typeof parsed.origin !== "string") {
    throw new ClientDataParseError("Missing or invalid property 'origin'");
  }
  let crossOrigin = false;
  if ("crossOrigin" in parsed) {
    if (typeof parsed.crossOrigin !== "boolean") {
      throw new ClientDataParseError("Invalid property 'crossOrigin'");
    }
    crossOrigin = parsed.crossOrigin;
  }
  let tokenBinding = null;
  if ("tokenBinding" in parsed) {
    if (parsed.tokenBinding === null || typeof parsed.tokenBinding !== "object") {
      throw new ClientDataParseError("Invalid property 'tokenBinding'");
    }
    if (!("id" in parsed.tokenBinding) || typeof parsed.tokenBinding.id !== "string") {
      throw new ClientDataParseError("Missing or invalid property 'tokenBinding.id'");
    }
    if (!("status" in parsed.tokenBinding)) {
      throw new ClientDataParseError("Missing or invalid property 'tokenBinding.status'");
    }
    let tokenBindingId;
    try {
      tokenBindingId = decodeBase64urlIgnorePadding(parsed.tokenBinding.id);
    } catch {
      throw new ClientDataParseError("Missing or invalid property 'tokenBinding.id'");
    }
    let status;
    if (parsed.tokenBinding.status === "present") {
      status = TokenBindingStatus.Present;
    } else if (parsed.tokenBinding.status === "supported") {
      status = TokenBindingStatus.Supported;
    } else {
      throw new ClientDataParseError("Missing or invalid property 'tokenBinding.status'");
    }
    tokenBinding = {
      id: tokenBindingId,
      status
    };
  }
  const clientData = {
    type,
    challenge,
    origin: parsed.origin,
    crossOrigin,
    tokenBinding
  };
  return clientData;
}
var ClientDataType;
(function(ClientDataType2) {
  ClientDataType2[ClientDataType2["Get"] = 0] = "Get";
  ClientDataType2[ClientDataType2["Create"] = 1] = "Create";
})(ClientDataType || (ClientDataType = {}));
var TokenBindingStatus;
(function(TokenBindingStatus2) {
  TokenBindingStatus2[TokenBindingStatus2["Supported"] = 0] = "Supported";
  TokenBindingStatus2[TokenBindingStatus2["Present"] = 1] = "Present";
})(TokenBindingStatus || (TokenBindingStatus = {}));
class ClientDataParseError extends Error {
  constructor(message) {
    super(`Failed to parse client data: ${message}`);
  }
}
function parseAuthenticatorData(encoded) {
  if (encoded.byteLength < 37) {
    throw new AuthenticatorDataParseError("Insufficient bytes");
  }
  const relyingPartyIdHash = encoded.slice(0, 32);
  const flags = {
    userPresent: (encoded[32] & 1) === 1,
    userVerified: (encoded[32] >> 2 & 1) === 1
  };
  const signatureCounter = bigEndian.uint32(encoded, 33);
  const includesAttestedCredentialData = (encoded[32] >> 6 & 1) === 1;
  let credential = null;
  if (includesAttestedCredentialData) {
    if (encoded.byteLength < 37 + 18) {
      throw new AuthenticatorDataParseError("Invalid credential data");
    }
    const aaguid = encoded.slice(37, 53);
    const credentialIdLength = bigEndian.uint16(encoded, 53);
    if (encoded.byteLength < 37 + 18 + credentialIdLength) {
      throw new AuthenticatorDataParseError("Insufficient bytes");
    }
    const credentialId = encoded.slice(55, 55 + credentialIdLength);
    let credentialPublicKey;
    try {
      [credentialPublicKey] = decodeCOSEPublicKey(encoded.slice(55 + credentialIdLength));
    } catch (e) {
      throw new AuthenticatorDataParseError("Failed to parse public key");
    }
    credential = {
      authenticatorAAGUID: aaguid,
      id: credentialId,
      publicKey: credentialPublicKey
    };
  }
  const authenticatorData = new AuthenticatorData(relyingPartyIdHash, flags, signatureCounter, credential, null);
  return authenticatorData;
}
class AuthenticatorData {
  relyingPartyIdHash;
  userPresent;
  userVerified;
  signatureCounter;
  credential;
  extensions;
  constructor(relyingPartyIdHash, flags, signatureCounter, credential, extensions) {
    this.relyingPartyIdHash = relyingPartyIdHash;
    this.userPresent = flags.userPresent;
    this.userVerified = flags.userVerified;
    this.signatureCounter = signatureCounter;
    this.credential = credential;
    this.extensions = extensions;
  }
  verifyRelyingPartyIdHash(relyingPartyId) {
    const relyingPartyIdHash = sha256(new TextEncoder().encode(relyingPartyId));
    return compareBytes(this.relyingPartyIdHash, relyingPartyIdHash);
  }
}
class AuthenticatorDataParseError extends Error {
  constructor(message) {
    super(`Failed to parse authenticator data: ${message}`);
  }
}
function parseAttestationObject(encoded) {
  let decoded;
  try {
    decoded = decodeCBORToNativeValueNoLeftoverBytes(encoded, 4);
  } catch {
    throw new AttestationObjectParseError("Invalid CBOR data");
  }
  if (typeof decoded !== "object" || decoded === null) {
    throw new AttestationObjectParseError("Invalid CBOR data");
  }
  if (!("fmt" in decoded) || typeof decoded.fmt !== "string") {
    throw new AttestationObjectParseError("Invalid or missing property 'fmt'");
  }
  if (!("attStmt" in decoded) || typeof decoded.attStmt !== "object" || decoded.attStmt === null) {
    throw new AttestationObjectParseError("Invalid or missing property 'attStmt'");
  }
  if (!("authData" in decoded) || !(decoded.authData instanceof Uint8Array)) {
    throw new AttestationObjectParseError("Invalid or missing property 'authData'");
  }
  let attestationFormat;
  if (decoded.fmt === "packed") {
    attestationFormat = AttestationStatementFormat.Packed;
  } else if (decoded.fmt === "tpm") {
    attestationFormat = AttestationStatementFormat.TPM;
  } else if (decoded.fmt === "android-key") {
    attestationFormat = AttestationStatementFormat.AndroidKey;
  } else if (decoded.fmt === "android-safetynet") {
    attestationFormat = AttestationStatementFormat.AndroidSafetyNet;
  } else if (decoded.fmt === "fido-u2f") {
    attestationFormat = AttestationStatementFormat.FIDOU2F;
  } else if (decoded.fmt === "none") {
    attestationFormat = AttestationStatementFormat.None;
  } else if (decoded.fmt === "apple") {
    attestationFormat = AttestationStatementFormat.AppleAnonymous;
  } else {
    throw new AttestationObjectParseError(`Unsupported attestation statement format '${decoded.fmt}'`);
  }
  const attestationObject = {
    authenticatorData: parseAuthenticatorData(decoded.authData),
    attestationStatement: new AttestationStatement(attestationFormat, decoded.attStmt)
  };
  return attestationObject;
}
class AttestationObjectParseError extends Error {
  constructor(message) {
    super(`Failed to parse attestation object: ${message}`);
  }
}
class AttestationStatement {
  format;
  decoded;
  constructor(format, decoded) {
    this.format = format;
    this.decoded = decoded;
  }
  packed() {
    if (this.format !== AttestationStatementFormat.Packed) {
      throw new Error("Invalid format");
    }
    if (!("alg" in this.decoded) || typeof this.decoded.alg !== "number") {
      throw new Error("Invalid or missing property 'alg'");
    }
    if (!("sig" in this.decoded) || !(this.decoded.sig instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'sig'");
    }
    let certificates = null;
    if ("x5c" in this.decoded) {
      if (!Array.isArray(this.decoded.x5c)) {
        throw new Error("Invalid property 'x5c'");
      }
      if (this.decoded.x5c.length < 1) {
        throw new Error("Invalid property 'x5c'");
      }
      certificates = [];
      for (const certificate of this.decoded.x5c) {
        if (!(certificate instanceof Uint8Array)) {
          throw new Error("Invalid property 'x5c'");
        }
        certificates.push(certificate);
      }
    }
    const statement = {
      algorithm: this.decoded.alg,
      signature: this.decoded.sig,
      certificates
    };
    return statement;
  }
  tpm() {
    if (this.format !== AttestationStatementFormat.TPM) {
      throw new Error("Invalid format");
    }
    if (!("alg" in this.decoded) || typeof this.decoded.alg !== "number") {
      throw new Error("Invalid or missing property 'alg'");
    }
    if (!("sig" in this.decoded) || !(this.decoded.sig instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'sig'");
    }
    if (!("x5c" in this.decoded) || !Array.isArray(this.decoded.x5c)) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    if (this.decoded.x5c.length < 1) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    const certificates = [];
    for (const certificate of this.decoded.x5c) {
      if (!(certificate instanceof Uint8Array)) {
        throw new Error("Invalid or missing property 'x5c'");
      }
      certificates.push(certificate);
    }
    if (!("certInfo" in this.decoded) || !(this.decoded.certInfo instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'certInfo'");
    }
    if (!("pubArea" in this.decoded) || !(this.decoded.pubArea instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'pubArea'");
    }
    const statement = {
      algorithm: this.decoded.alg,
      signature: this.decoded.sig,
      certificates,
      attestation: this.decoded.certInfo,
      publicKey: this.decoded.pubArea
    };
    return statement;
  }
  androidKey() {
    if (this.format !== AttestationStatementFormat.AndroidKey) {
      throw new Error("Invalid format");
    }
    if (!("alg" in this.decoded) || typeof this.decoded.alg !== "number") {
      throw new Error("Invalid or missing property 'alg'");
    }
    if (!("sig" in this.decoded) || !(this.decoded.sig instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'sig'");
    }
    if (!("x5c" in this.decoded) || !Array.isArray(this.decoded.x5c)) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    if (this.decoded.x5c.length < 1) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    const certificates = [];
    for (const certificate of this.decoded.x5c) {
      if (!(certificate instanceof Uint8Array)) {
        throw new Error("Invalid or missing property 'x5c'");
      }
      certificates.push(certificate);
    }
    const statement = {
      algorithm: this.decoded.alg,
      signature: this.decoded.sig,
      certificates
    };
    return statement;
  }
  androidSafetyNet() {
    if (this.format !== AttestationStatementFormat.AndroidKey) {
      throw new Error("Invalid format");
    }
    if (!("ver" in this.decoded) || typeof this.decoded.ver !== "string") {
      throw new Error("Invalid or missing property 'ver'");
    }
    if (!("response" in this.decoded) || !(this.decoded.response instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'response'");
    }
    const statement = {
      version: this.decoded.ver,
      response: this.decoded.response
    };
    return statement;
  }
  fidoU2F() {
    if (this.format !== AttestationStatementFormat.FIDOU2F) {
      throw new Error("Invalid format");
    }
    if (!("sig" in this.decoded) || !(this.decoded.sig instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'sig'");
    }
    if (!("x5c" in this.decoded) || !Array.isArray(this.decoded.x5c)) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    if (this.decoded.x5c.length !== 1) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    const certificate = this.decoded.x5c[0];
    if (!(certificate instanceof Uint8Array)) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    const statement = {
      signature: this.decoded.sig,
      certificate
    };
    return statement;
  }
  appleAnonymous() {
    if (this.format !== AttestationStatementFormat.AppleAnonymous) {
      throw new Error("Invalid format");
    }
    if (!("x5c" in this.decoded) || !Array.isArray(this.decoded.x5c)) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    if (this.decoded.x5c.length < 1) {
      throw new Error("Invalid or missing property 'x5c'");
    }
    const certificates = [];
    for (const certificate of this.decoded.x5c) {
      if (!(certificate instanceof Uint8Array)) {
        throw new Error("Invalid or missing property 'x5c'");
      }
      certificates.push(certificate);
    }
    const statement = { certificates };
    return statement;
  }
}
var AttestationStatementFormat;
(function(AttestationStatementFormat2) {
  AttestationStatementFormat2[AttestationStatementFormat2["Packed"] = 0] = "Packed";
  AttestationStatementFormat2[AttestationStatementFormat2["TPM"] = 1] = "TPM";
  AttestationStatementFormat2[AttestationStatementFormat2["AndroidKey"] = 2] = "AndroidKey";
  AttestationStatementFormat2[AttestationStatementFormat2["AndroidSafetyNet"] = 3] = "AndroidSafetyNet";
  AttestationStatementFormat2[AttestationStatementFormat2["FIDOU2F"] = 4] = "FIDOU2F";
  AttestationStatementFormat2[AttestationStatementFormat2["AppleAnonymous"] = 5] = "AppleAnonymous";
  AttestationStatementFormat2[AttestationStatementFormat2["None"] = 6] = "None";
})(AttestationStatementFormat || (AttestationStatementFormat = {}));
function createAssertionSignatureMessage(authenticatorData, clientDataJSON) {
  const hash = sha256(clientDataJSON);
  const message = new Uint8Array(authenticatorData.byteLength + hash.byteLength);
  message.set(authenticatorData);
  message.set(hash, authenticatorData.byteLength);
  return message;
}
const TOKEN_BYTES = 32;
const TOKEN_PREFIXES = {
  PAT: "ec_pat_",
  OAUTH_ACCESS: "ec_oat_",
  OAUTH_REFRESH: "ec_ort_"
};
const VALID_SCOPES = [
  "content:read",
  "content:write",
  "media:read",
  "media:write",
  "schema:read",
  "schema:write",
  "admin"
];
function hasScope(scopes, required) {
  if (scopes.includes("admin")) return true;
  return scopes.includes(required);
}
function generateToken() {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return encodeBase64urlNoPadding(bytes);
}
function hashToken(token) {
  return encodeBase64urlNoPadding(sha256$1(decodeBase64urlIgnorePadding$1(token)));
}
function generateTokenWithHash() {
  const token = generateToken();
  return {
    token,
    hash: hashToken(token)
  };
}
function generatePrefixedToken(prefix) {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  const raw = `${prefix}${encodeBase64urlNoPadding(bytes)}`;
  return {
    raw,
    hash: hashPrefixedToken(raw),
    prefix: raw.slice(0, prefix.length + 4)
  };
}
function hashPrefixedToken(token) {
  return encodeBase64urlNoPadding(sha256$1(new TextEncoder().encode(token)));
}
function computeS256Challenge(codeVerifier) {
  return encodeBase64urlNoPadding(sha256$1(new TextEncoder().encode(codeVerifier)));
}
const CHALLENGE_TTL$1 = 300 * 1e3;
async function generateRegistrationOptions(config, user, existingCredentials, challengeStore) {
  const challenge = generateToken();
  await challengeStore.set(challenge, {
    type: "registration",
    userId: user.id,
    expiresAt: Date.now() + CHALLENGE_TTL$1
  });
  const userIdEncoded = encodeBase64urlNoPadding(new TextEncoder().encode(user.id));
  return {
    challenge,
    rp: {
      name: config.rpName,
      id: config.rpId
    },
    user: {
      id: userIdEncoded,
      name: user.email,
      displayName: user.name || user.email
    },
    pubKeyCredParams: [{
      type: "public-key",
      alg: coseAlgorithmES256
    }, {
      type: "public-key",
      alg: coseAlgorithmRS256
    }],
    timeout: 6e4,
    attestation: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred"
    },
    excludeCredentials: existingCredentials.map((cred) => ({
      type: "public-key",
      id: cred.id,
      transports: cred.transports
    }))
  };
}
async function verifyRegistrationResponse(config, response, challengeStore) {
  const clientDataJSON = decodeBase64urlIgnorePadding$1(response.response.clientDataJSON);
  const attestationObject = decodeBase64urlIgnorePadding$1(response.response.attestationObject);
  const clientData = parseClientDataJSON(clientDataJSON);
  if (clientData.type !== ClientDataType.Create) throw new Error("Invalid client data type");
  const challengeString = encodeBase64urlNoPadding(clientData.challenge);
  const challengeData = await challengeStore.get(challengeString);
  if (!challengeData) throw new Error("Challenge not found or expired");
  if (challengeData.type !== "registration") throw new Error("Invalid challenge type");
  if (challengeData.expiresAt < Date.now()) {
    await challengeStore.delete(challengeString);
    throw new Error("Challenge expired");
  }
  await challengeStore.delete(challengeString);
  if (clientData.origin !== config.origin) throw new Error(`Invalid origin: expected ${config.origin}, got ${clientData.origin}`);
  const attestation = parseAttestationObject(attestationObject);
  if (attestation.attestationStatement.format !== AttestationStatementFormat.None) ;
  const { authenticatorData } = attestation;
  if (!authenticatorData.verifyRelyingPartyIdHash(config.rpId)) throw new Error("Invalid RP ID hash");
  if (!authenticatorData.userPresent) throw new Error("User presence not verified");
  if (!authenticatorData.credential) throw new Error("No credential data in attestation");
  const { credential } = authenticatorData;
  const algorithm = credential.publicKey.algorithm();
  let encodedPublicKey;
  if (algorithm === coseAlgorithmES256) {
    if (credential.publicKey.type() !== COSEKeyType.EC2) throw new Error("Expected EC2 key type for ES256");
    const cosePublicKey = credential.publicKey.ec2();
    if (cosePublicKey.curve !== coseEllipticCurveP256) throw new Error("Expected P-256 curve for ES256");
    encodedPublicKey = new ECDSAPublicKey(secp256r1, cosePublicKey.x, cosePublicKey.y).encodeSEC1Uncompressed();
  } else if (algorithm === coseAlgorithmRS256) throw new Error("RS256 not yet supported - please use ES256");
  else throw new Error(`Unsupported algorithm: ${algorithm}`);
  return {
    credentialId: response.id,
    publicKey: encodedPublicKey,
    counter: authenticatorData.signatureCounter,
    deviceType: "singleDevice",
    backedUp: false,
    transports: response.response.transports ?? []
  };
}
async function registerPasskey(adapter, userId, verified, name) {
  if (await adapter.countCredentialsByUserId(userId) >= 10) throw new Error("Maximum number of passkeys reached (10)");
  if (await adapter.getCredentialById(verified.credentialId)) throw new Error("Credential already registered");
  const newCredential = {
    id: verified.credentialId,
    userId,
    publicKey: verified.publicKey,
    counter: verified.counter,
    deviceType: verified.deviceType,
    backedUp: verified.backedUp,
    transports: verified.transports,
    name
  };
  return adapter.createCredential(newCredential);
}
const CHALLENGE_TTL = 300 * 1e3;
async function generateAuthenticationOptions(config, credentials, challengeStore) {
  const challenge = generateToken();
  await challengeStore.set(challenge, {
    type: "authentication",
    expiresAt: Date.now() + CHALLENGE_TTL
  });
  return {
    challenge,
    rpId: config.rpId,
    timeout: 6e4,
    userVerification: "preferred",
    allowCredentials: credentials.length > 0 ? credentials.map((cred) => ({
      type: "public-key",
      id: cred.id,
      transports: cred.transports
    })) : void 0
  };
}
async function verifyAuthenticationResponse(config, response, credential, challengeStore) {
  const clientDataJSON = decodeBase64urlIgnorePadding$1(response.response.clientDataJSON);
  const authenticatorData = decodeBase64urlIgnorePadding$1(response.response.authenticatorData);
  const signature = decodeBase64urlIgnorePadding$1(response.response.signature);
  const clientData = parseClientDataJSON(clientDataJSON);
  if (clientData.type !== ClientDataType.Get) throw new Error("Invalid client data type");
  const challengeString = encodeBase64urlNoPadding(clientData.challenge);
  const challengeData = await challengeStore.get(challengeString);
  if (!challengeData) throw new Error("Challenge not found or expired");
  if (challengeData.type !== "authentication") throw new Error("Invalid challenge type");
  if (challengeData.expiresAt < Date.now()) {
    await challengeStore.delete(challengeString);
    throw new Error("Challenge expired");
  }
  await challengeStore.delete(challengeString);
  if (clientData.origin !== config.origin) throw new Error(`Invalid origin: expected ${config.origin}, got ${clientData.origin}`);
  const authData = parseAuthenticatorData(authenticatorData);
  if (!authData.verifyRelyingPartyIdHash(config.rpId)) throw new Error("Invalid RP ID hash");
  if (!authData.userPresent) throw new Error("User presence not verified");
  if (authData.signatureCounter !== 0 && authData.signatureCounter <= credential.counter) throw new Error("Invalid signature counter - possible cloned authenticator");
  const signatureMessage = createAssertionSignatureMessage(authenticatorData, clientDataJSON);
  const ecdsaPublicKey = decodeSEC1PublicKey(secp256r1, credential.publicKey instanceof Uint8Array ? credential.publicKey : new Uint8Array(credential.publicKey));
  const ecdsaSignature = decodePKIXECDSASignature(signature);
  if (!verifyECDSASignature(ecdsaPublicKey, sha256$1(signatureMessage), ecdsaSignature)) throw new Error("Invalid signature");
  return {
    credentialId: response.id,
    newCounter: authData.signatureCounter
  };
}
async function authenticateWithPasskey(config, adapter, response, challengeStore) {
  const credential = await adapter.getCredentialById(response.id);
  if (!credential) throw new Error("Credential not found");
  const verified = await verifyAuthenticationResponse(config, response, credential, challengeStore);
  await adapter.updateCredentialCounter(verified.credentialId, verified.newCounter);
  const user = await adapter.getUserById(credential.userId);
  if (!user) throw new Error("User not found");
  return user;
}
export {
  TOKEN_PREFIXES as T,
  VALID_SCOPES as V,
  generateAuthenticationOptions as a,
  generateRegistrationOptions as b,
  computeS256Challenge as c,
  authenticateWithPasskey as d,
  generateTokenWithHash as e,
  hashToken as f,
  generatePrefixedToken as g,
  hashPrefixedToken as h,
  hasScope as i,
  registerPasskey as r,
  sha256$1 as s,
  verifyRegistrationResponse as v
};

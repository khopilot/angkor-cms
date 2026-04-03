globalThis.process ??= {};
globalThis.process.env ??= {};
import { _ as _coercedNumber, a as _coercedBoolean, Z as ZodNumber, b as ZodBoolean } from "./sequence_DzjOVBrG.mjs";
function number(params) {
  return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
  return _coercedBoolean(ZodBoolean, params);
}
export {
  boolean as b,
  number as n
};

globalThis.process ??= {};
globalThis.process.env ??= {};
import { j as encodeBase64urlNoPadding } from "./sequence_DzjOVBrG.mjs";
import "./authenticate-j5GayLXB_DHkbhwdZ.mjs";
function generateCodeVerifier() {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return encodeBase64urlNoPadding(randomValues);
}
var CodeChallengeMethod;
(function(CodeChallengeMethod2) {
  CodeChallengeMethod2[CodeChallengeMethod2["S256"] = 0] = "S256";
  CodeChallengeMethod2[CodeChallengeMethod2["Plain"] = 1] = "Plain";
})(CodeChallengeMethod || (CodeChallengeMethod = {}));
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
export {
  generateCodeVerifier as g
};

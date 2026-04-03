globalThis.process ??= {};
globalThis.process.env ??= {};
import { R as Role } from "./types-ndj-bYfi_Bn2CgOOF.mjs";
import { e as generateTokenWithHash, f as hashToken, s as sha256 } from "./authenticate-j5GayLXB_DHkbhwdZ.mjs";
import { c as array, o as object, s as string, n as number, f as boolean, j as encodeBase64urlNoPadding, d as _enum } from "./sequence_DzjOVBrG.mjs";
const gitHubUserSchema = object({
  id: number(),
  login: string(),
  name: string().nullable(),
  email: string().nullable(),
  avatar_url: string()
});
const gitHubEmailSchema = object({
  email: string(),
  primary: boolean(),
  verified: boolean()
});
const github = {
  name: "github",
  authorizeUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  userInfoUrl: "https://api.github.com/user",
  scopes: ["read:user", "user:email"],
  parseProfile(data) {
    const user = gitHubUserSchema.parse(data);
    return {
      id: String(user.id),
      email: user.email || "",
      name: user.name,
      avatarUrl: user.avatar_url,
      emailVerified: true
    };
  }
};
async function fetchGitHubEmail(accessToken) {
  const response = await fetch("https://api.github.com/user/emails", { headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  } });
  if (!response.ok) throw new Error(`Failed to fetch GitHub emails: ${response.status}`);
  const json = await response.json();
  const primary = array(gitHubEmailSchema).parse(json).find((e) => e.primary && e.verified);
  if (!primary) throw new Error("No verified primary email found on GitHub account");
  return primary.email;
}
const googleUserSchema = object({
  sub: string(),
  email: string(),
  email_verified: boolean(),
  name: string(),
  picture: string()
});
const google = {
  name: "google",
  authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
  scopes: [
    "openid",
    "email",
    "profile"
  ],
  parseProfile(data) {
    const user = googleUserSchema.parse(data);
    return {
      id: user.sub,
      email: user.email,
      name: user.name,
      avatarUrl: user.picture,
      emailVerified: user.email_verified
    };
  }
};
const HTTP_SCHEME_RE = /^https?:\/\//i;
const httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
const oauthProviderSchema = object({
  clientId: string(),
  clientSecret: string()
});
object({
  secret: string().min(32, "Auth secret must be at least 32 characters"),
  passkeys: object({
    rpName: string(),
    rpId: string().optional()
  }).optional(),
  selfSignup: object({
    domains: array(string()),
    defaultRole: _enum([
      "subscriber",
      "contributor",
      "author"
    ]).default("contributor")
  }).optional(),
  oauth: object({
    github: oauthProviderSchema.optional(),
    google: oauthProviderSchema.optional()
  }).optional(),
  provider: object({
    enabled: boolean(),
    issuer: httpUrl.optional()
  }).optional(),
  sso: object({ enabled: boolean() }).optional(),
  session: object({
    maxAge: number().default(720 * 60 * 60),
    sliding: boolean().default(true)
  }).optional()
});
const Permissions = {
  "content:read": Role.SUBSCRIBER,
  "content:create": Role.CONTRIBUTOR,
  "content:edit_own": Role.AUTHOR,
  "content:edit_any": Role.EDITOR,
  "content:delete_own": Role.AUTHOR,
  "content:delete_any": Role.EDITOR,
  "content:publish_own": Role.AUTHOR,
  "content:publish_any": Role.EDITOR,
  "media:read": Role.SUBSCRIBER,
  "media:upload": Role.CONTRIBUTOR,
  "media:edit_own": Role.AUTHOR,
  "media:edit_any": Role.EDITOR,
  "media:delete_own": Role.AUTHOR,
  "media:delete_any": Role.EDITOR,
  "taxonomies:read": Role.SUBSCRIBER,
  "taxonomies:manage": Role.EDITOR,
  "comments:read": Role.SUBSCRIBER,
  "comments:moderate": Role.EDITOR,
  "comments:delete": Role.ADMIN,
  "comments:settings": Role.ADMIN,
  "menus:read": Role.SUBSCRIBER,
  "menus:manage": Role.EDITOR,
  "widgets:read": Role.SUBSCRIBER,
  "widgets:manage": Role.EDITOR,
  "sections:read": Role.SUBSCRIBER,
  "sections:manage": Role.EDITOR,
  "redirects:read": Role.EDITOR,
  "redirects:manage": Role.ADMIN,
  "users:read": Role.ADMIN,
  "users:invite": Role.ADMIN,
  "users:manage": Role.ADMIN,
  "settings:read": Role.EDITOR,
  "settings:manage": Role.ADMIN,
  "schema:read": Role.EDITOR,
  "schema:manage": Role.ADMIN,
  "plugins:read": Role.EDITOR,
  "plugins:manage": Role.ADMIN,
  "import:execute": Role.ADMIN,
  "search:read": Role.SUBSCRIBER,
  "search:manage": Role.ADMIN,
  "auth:manage_own_credentials": Role.SUBSCRIBER,
  "auth:manage_connections": Role.ADMIN
};
function hasPermission(user, permission) {
  if (!user) return false;
  return user.role >= Permissions[permission];
}
function canActOnOwn(user, ownerId, ownPermission, anyPermission) {
  if (!user) return false;
  if (user.id === ownerId) return hasPermission(user, ownPermission);
  return hasPermission(user, anyPermission);
}
const SCOPE_MIN_ROLE = {
  "content:read": Role.SUBSCRIBER,
  "content:write": Role.CONTRIBUTOR,
  "media:read": Role.SUBSCRIBER,
  "media:write": Role.CONTRIBUTOR,
  "schema:read": Role.EDITOR,
  "schema:write": Role.ADMIN,
  admin: Role.ADMIN
};
function scopesForRole(role) {
  return Object.entries(SCOPE_MIN_ROLE).reduce((acc, [scope, minRole]) => {
    if (role >= minRole) acc.push(scope);
    return acc;
  }, []);
}
function clampScopes(requested, role) {
  const allowed = new Set(scopesForRole(role));
  return requested.filter((s) => allowed.has(s));
}
function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
const TOKEN_EXPIRY_MS$2 = 10080 * 60 * 1e3;
async function createInviteToken(config, adapter, email, role, invitedBy) {
  if (await adapter.getUserByEmail(email)) throw new InviteError("user_exists", "A user with this email already exists");
  const { token, hash } = generateTokenWithHash();
  await adapter.createToken({
    hash,
    email,
    type: "invite",
    role,
    invitedBy,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS$2)
  });
  const url = new URL("/api/auth/invite/accept", config.baseUrl);
  url.searchParams.set("token", token);
  return {
    url: url.toString(),
    email
  };
}
function buildInviteEmail(inviteUrl, email, siteName) {
  const safeName = escapeHtml(siteName);
  return {
    to: email,
    subject: `You've been invited to ${siteName}`,
    text: `You've been invited to join ${siteName}.

Click this link to create your account:
${inviteUrl}

This link expires in 7 days.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px; margin-bottom: 20px;">You've been invited to ${safeName}</h1>
  <p>Click the button below to create your account:</p>
  <p style="margin: 30px 0;">
    <a href="${inviteUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invite</a>
  </p>
  <p style="color: #666; font-size: 14px;">This link expires in 7 days.</p>
</body>
</html>`
  };
}
async function createInvite(config, adapter, email, role, invitedBy) {
  const result = await createInviteToken(config, adapter, email, role, invitedBy);
  if (config.email) {
    const message = buildInviteEmail(result.url, email, config.siteName);
    await config.email(message);
  }
  return result;
}
async function validateInvite(adapter, token) {
  const hash = hashToken(token);
  const authToken = await adapter.getToken(hash, "invite");
  if (!authToken) throw new InviteError("invalid_token", "Invalid or expired invite link");
  if (authToken.expiresAt < /* @__PURE__ */ new Date()) {
    await adapter.deleteToken(hash);
    throw new InviteError("token_expired", "This invite has expired");
  }
  if (!authToken.email || authToken.role === null) throw new InviteError("invalid_token", "Invalid invite data");
  return {
    email: authToken.email,
    role: authToken.role
  };
}
async function completeInvite(adapter, token, userData) {
  const hash = hashToken(token);
  const authToken = await adapter.getToken(hash, "invite");
  if (!authToken || authToken.expiresAt < /* @__PURE__ */ new Date()) throw new InviteError("invalid_token", "Invalid or expired invite");
  if (!authToken.email || authToken.role === null) throw new InviteError("invalid_token", "Invalid invite data");
  await adapter.deleteToken(hash);
  return await adapter.createUser({
    email: authToken.email,
    name: userData.name,
    avatarUrl: userData.avatarUrl,
    role: authToken.role,
    emailVerified: true
  });
}
var InviteError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "InviteError";
  }
};
const TOKEN_EXPIRY_MS$1 = 900 * 1e3;
async function timingDelay$1() {
  const delay = 100 + Math.random() * 150;
  await new Promise((resolve) => setTimeout(resolve, delay));
}
async function sendMagicLink(config, adapter, email, type = "magic_link") {
  if (!config.email) throw new MagicLinkError("email_not_configured", "Email is not configured");
  const user = await adapter.getUserByEmail(email);
  if (!user) {
    await timingDelay$1();
    return;
  }
  const { token, hash } = generateTokenWithHash();
  await adapter.createToken({
    hash,
    userId: user.id,
    email: user.email,
    type,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS$1)
  });
  const url = new URL("/api/auth/magic-link/verify", config.baseUrl);
  url.searchParams.set("token", token);
  const safeName = escapeHtml(config.siteName);
  await config.email({
    to: user.email,
    subject: `Sign in to ${config.siteName}`,
    text: `Click this link to sign in to ${config.siteName}:

${url.toString()}

This link expires in 15 minutes.

If you didn't request this, you can safely ignore this email.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px; margin-bottom: 20px;">Sign in to ${safeName}</h1>
  <p>Click the button below to sign in:</p>
  <p style="margin: 30px 0;">
    <a href="${url.toString()}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Sign in</a>
  </p>
  <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
  <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
</body>
</html>`
  });
}
async function verifyMagicLink(adapter, token) {
  const hash = hashToken(token);
  const authToken = await adapter.getToken(hash, "magic_link");
  if (!authToken) {
    const recoveryToken = await adapter.getToken(hash, "recovery");
    if (!recoveryToken) throw new MagicLinkError("invalid_token", "Invalid or expired link");
    return verifyTokenAndGetUser(adapter, recoveryToken, hash);
  }
  return verifyTokenAndGetUser(adapter, authToken, hash);
}
async function verifyTokenAndGetUser(adapter, authToken, hash) {
  if (authToken.expiresAt < /* @__PURE__ */ new Date()) {
    await adapter.deleteToken(hash);
    throw new MagicLinkError("token_expired", "This link has expired");
  }
  await adapter.deleteToken(hash);
  if (!authToken.userId) throw new MagicLinkError("invalid_token", "Invalid token");
  const user = await adapter.getUserById(authToken.userId);
  if (!user) throw new MagicLinkError("user_not_found", "User not found");
  return user;
}
var MagicLinkError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "MagicLinkError";
  }
};
const TOKEN_EXPIRY_MS = 900 * 1e3;
async function timingDelay() {
  const delay = 100 + Math.random() * 150;
  await new Promise((resolve) => setTimeout(resolve, delay));
}
async function canSignup(adapter, email) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  const allowedDomain = await adapter.getAllowedDomain(domain);
  if (!allowedDomain || !allowedDomain.enabled) return null;
  return {
    allowed: true,
    role: allowedDomain.defaultRole
  };
}
async function requestSignup(config, adapter, email) {
  if (!config.email) throw new SignupError("email_not_configured", "Email is not configured");
  if (await adapter.getUserByEmail(email)) {
    await timingDelay();
    return;
  }
  const signup = await canSignup(adapter, email);
  if (!signup) {
    await timingDelay();
    return;
  }
  const { token, hash } = generateTokenWithHash();
  await adapter.createToken({
    hash,
    email,
    type: "email_verify",
    role: signup.role,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS)
  });
  const url = new URL("/api/auth/signup/verify", config.baseUrl);
  url.searchParams.set("token", token);
  const safeName = escapeHtml(config.siteName);
  await config.email({
    to: email,
    subject: `Verify your email for ${config.siteName}`,
    text: `Click this link to verify your email and create your account:

${url.toString()}

This link expires in 15 minutes.

If you didn't request this, you can safely ignore this email.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="font-size: 24px; margin-bottom: 20px;">Verify your email</h1>
  <p>Click the button below to verify your email and create your ${safeName} account:</p>
  <p style="margin: 30px 0;">
    <a href="${url.toString()}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
  </p>
  <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
  <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
</body>
</html>`
  });
}
async function validateSignupToken(adapter, token) {
  const hash = hashToken(token);
  const authToken = await adapter.getToken(hash, "email_verify");
  if (!authToken) throw new SignupError("invalid_token", "Invalid or expired verification link");
  if (authToken.expiresAt < /* @__PURE__ */ new Date()) {
    await adapter.deleteToken(hash);
    throw new SignupError("token_expired", "This link has expired");
  }
  if (!authToken.email || authToken.role === null) throw new SignupError("invalid_token", "Invalid token data");
  return {
    email: authToken.email,
    role: authToken.role
  };
}
async function completeSignup(adapter, token, userData) {
  const hash = hashToken(token);
  const authToken = await adapter.getToken(hash, "email_verify");
  if (!authToken || authToken.expiresAt < /* @__PURE__ */ new Date()) throw new SignupError("invalid_token", "Invalid or expired verification");
  if (!authToken.email || authToken.role === null) throw new SignupError("invalid_token", "Invalid token data");
  if (await adapter.getUserByEmail(authToken.email)) {
    await adapter.deleteToken(hash);
    throw new SignupError("user_exists", "An account with this email already exists");
  }
  await adapter.deleteToken(hash);
  return await adapter.createUser({
    email: authToken.email,
    name: userData.name,
    avatarUrl: userData.avatarUrl,
    role: authToken.role,
    emailVerified: true
  });
}
var SignupError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "SignupError";
  }
};
async function createAuthorizationUrl(config, providerName, stateStore) {
  const providerConfig = config.providers[providerName];
  if (!providerConfig) throw new Error(`OAuth provider ${providerName} not configured`);
  const provider = getProvider(providerName);
  const state = generateState();
  const redirectUri = `${config.baseUrl}/api/auth/oauth/${providerName}/callback`;
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  await stateStore.set(state, {
    provider: providerName,
    redirectUri,
    codeVerifier
  });
  const url = new URL(provider.authorizeUrl);
  url.searchParams.set("client_id", providerConfig.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", provider.scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return {
    url: url.toString(),
    state
  };
}
async function handleOAuthCallback(config, adapter, providerName, code, state, stateStore) {
  const providerConfig = config.providers[providerName];
  if (!providerConfig) throw new Error(`OAuth provider ${providerName} not configured`);
  const storedState = await stateStore.get(state);
  if (!storedState || storedState.provider !== providerName) throw new OAuthError("invalid_state", "Invalid OAuth state");
  await stateStore.delete(state);
  const provider = getProvider(providerName);
  return findOrCreateUser(config, adapter, providerName, await fetchProfile(provider, (await exchangeCode(provider, providerConfig, code, storedState.redirectUri, storedState.codeVerifier)).accessToken, providerName));
}
async function exchangeCode(provider, config, code, redirectUri, codeVerifier) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret
  });
  if (codeVerifier) body.set("code_verifier", codeVerifier);
  const response = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body
  });
  if (!response.ok) throw new OAuthError("token_exchange_failed", `Token exchange failed: ${await response.text()}`);
  const json = await response.json();
  const data = object({
    access_token: string(),
    id_token: string().optional()
  }).parse(json);
  return {
    accessToken: data.access_token,
    idToken: data.id_token
  };
}
async function fetchProfile(provider, accessToken, providerName) {
  if (!provider.userInfoUrl) throw new Error("Provider does not have userinfo URL");
  const response = await fetch(provider.userInfoUrl, { headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json"
  } });
  if (!response.ok) throw new OAuthError("profile_fetch_failed", `Failed to fetch profile: ${response.status}`);
  const data = await response.json();
  const profile = provider.parseProfile(data);
  if (providerName === "github" && !profile.email) profile.email = await fetchGitHubEmail(accessToken);
  return profile;
}
async function findOrCreateUser(config, adapter, providerName, profile) {
  const existingAccount = await adapter.getOAuthAccount(providerName, profile.id);
  if (existingAccount) {
    const user = await adapter.getUserById(existingAccount.userId);
    if (!user) throw new OAuthError("user_not_found", "Linked user not found");
    return user;
  }
  const existingUser = await adapter.getUserByEmail(profile.email);
  if (existingUser) {
    if (!profile.emailVerified) throw new OAuthError("signup_not_allowed", "Cannot link account: email not verified by provider");
    await adapter.createOAuthAccount({
      provider: providerName,
      providerAccountId: profile.id,
      userId: existingUser.id
    });
    return existingUser;
  }
  if (config.canSelfSignup) {
    const signup = await config.canSelfSignup(profile.email);
    if (signup?.allowed) {
      const user = await adapter.createUser({
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        role: signup.role,
        emailVerified: profile.emailVerified
      });
      await adapter.createOAuthAccount({
        provider: providerName,
        providerAccountId: profile.id,
        userId: user.id
      });
      return user;
    }
  }
  throw new OAuthError("signup_not_allowed", "Self-signup not allowed for this email domain");
}
function getProvider(name) {
  switch (name) {
    case "github":
      return github;
    case "google":
      return google;
  }
}
function generateState() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64urlNoPadding(bytes);
}
function generateCodeVerifier() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64urlNoPadding(bytes);
}
async function generateCodeChallenge(verifier) {
  return encodeBase64urlNoPadding(sha256(new TextEncoder().encode(verifier)));
}
var OAuthError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "OAuthError";
  }
};
export {
  InviteError as I,
  MagicLinkError as M,
  OAuthError as O,
  SignupError as S,
  clampScopes as a,
  completeInvite as b,
  canActOnOwn as c,
  createInvite as d,
  verifyMagicLink as e,
  handleOAuthCallback as f,
  createAuthorizationUrl as g,
  hasPermission as h,
  completeSignup as i,
  validateSignupToken as j,
  requestSignup as r,
  sendMagicLink as s,
  validateInvite as v
};

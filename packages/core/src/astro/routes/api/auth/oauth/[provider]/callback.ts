/**
 * GET /_emdash/api/auth/oauth/[provider]/callback
 *
 * Handle OAuth callback from provider
 */

import type { APIRoute } from "astro";

export const prerender = false;

import {
	handleOAuthCallback,
	OAuthError,
	Role,
	type OAuthConsumerConfig,
	type RoleLevel,
} from "@emdash-cms/auth";
import { createKyselyAdapter } from "@emdash-cms/auth/adapters/kysely";

import { createOAuthStateStore } from "#auth/oauth-state-store.js";

type ProviderName = "github" | "google";

const VALID_PROVIDERS = new Set<string>(["github", "google"]);

function isValidProvider(provider: string): provider is ProviderName {
	return VALID_PROVIDERS.has(provider);
}

/** Safely extract a string value from an env-like record */
function envString(env: Record<string, unknown>, ...keys: string[]): string | undefined {
	for (const key of keys) {
		const val = env[key];
		if (typeof val === "string" && val) return val;
	}
	return undefined;
}

/**
 * Get OAuth config from environment variables
 */
function getOAuthConfig(env: Record<string, unknown>): OAuthConsumerConfig["providers"] {
	const providers: OAuthConsumerConfig["providers"] = {};

	// GitHub
	const githubClientId = envString(env, "EMDASH_OAUTH_GITHUB_CLIENT_ID", "GITHUB_CLIENT_ID");
	const githubClientSecret = envString(
		env,
		"EMDASH_OAUTH_GITHUB_CLIENT_SECRET",
		"GITHUB_CLIENT_SECRET",
	);
	if (githubClientId && githubClientSecret) {
		providers.github = {
			clientId: githubClientId,
			clientSecret: githubClientSecret,
		};
	}

	// Google
	const googleClientId = envString(env, "EMDASH_OAUTH_GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_ID");
	const googleClientSecret = envString(
		env,
		"EMDASH_OAUTH_GOOGLE_CLIENT_SECRET",
		"GOOGLE_CLIENT_SECRET",
	);
	if (googleClientId && googleClientSecret) {
		providers.google = {
			clientId: googleClientId,
			clientSecret: googleClientSecret,
		};
	}

	return providers;
}

export const GET: APIRoute = async ({ params, request, locals, session, redirect }) => {
	const { emdash } = locals;
	const provider = params.provider;

	// Validate provider
	if (!provider || !isValidProvider(provider)) {
		return redirect(
			`/_emdash/admin/login?error=invalid_provider&message=${encodeURIComponent("Invalid OAuth provider")}`,
		);
	}

	if (!emdash?.db) {
		return redirect(
			`/_emdash/admin/login?error=server_error&message=${encodeURIComponent("Database not configured")}`,
		);
	}

	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const error = url.searchParams.get("error");
	const errorDescription = url.searchParams.get("error_description");

	// Handle OAuth errors from provider
	if (error) {
		const message = errorDescription || error;
		return redirect(
			`/_emdash/admin/login?error=oauth_denied&message=${encodeURIComponent(message)}`,
		);
	}

	// Validate required params
	if (!code || !state) {
		return redirect(
			`/_emdash/admin/login?error=invalid_callback&message=${encodeURIComponent("Missing code or state parameter")}`,
		);
	}

	try {
		// Get OAuth providers from environment (Astro v6: cloudflare:workers)
		let cfEnv: Record<string, unknown> = {};
		try {
			const { env: workerEnv } = await import("cloudflare:workers");
			cfEnv = workerEnv as Record<string, unknown>;
		} catch {
			// eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion)
			cfEnv = import.meta.env as Record<string, unknown>;
		}
		const providers = getOAuthConfig(cfEnv);

		if (!providers[provider]) {
			return redirect(
				`/_emdash/admin/login?error=provider_not_configured&message=${encodeURIComponent(`OAuth provider ${provider} is not configured`)}`,
			);
		}

		const config: OAuthConsumerConfig = {
			baseUrl: `${url.origin}/_emdash`,
			providers,
			canSelfSignup: async (email: string) => {
				const domain = email.split("@")[1]?.toLowerCase();
				if (!domain) {
					return null;
				}

				// Check allowed_domains table first
				const entry = await emdash.db
					.selectFrom("allowed_domains")
					.selectAll()
					.where("domain", "=", domain)
					.where("enabled", "=", 1)
					.executeTakeFirst();

				// If no allowed_domains are configured at all, allow everyone (open signup)
				const totalDomains = await emdash.db
					.selectFrom("allowed_domains")
					.select(emdash.db.fn.countAll().as("count"))
					.executeTakeFirst();
				const hasAnyDomains = Number(totalDomains?.count ?? 0) > 0;

				if (!entry && hasAnyDomains) {
					// Domains are configured but this one isn't allowed
					return null;
				}

				// Map role level or default to EDITOR for open signup
				const roleMap: Record<number, RoleLevel> = {
					50: Role.ADMIN,
					40: Role.EDITOR,
					30: Role.AUTHOR,
					20: Role.CONTRIBUTOR,
					10: Role.SUBSCRIBER,
				};
				const roleLevel = entry?.default_role ?? 30;
				const role = roleMap[roleLevel] ?? Role.AUTHOR;

				return { allowed: true, role };
			},
		};

		const adapter = createKyselyAdapter(emdash.db);
		const stateStore = createOAuthStateStore(emdash.db);

		const user = await handleOAuthCallback(config, adapter, provider, code, state, stateStore);

		// Create session
		if (session) {
			session.set("user", { id: user.id });
		}

		// Redirect to admin dashboard
		return redirect("/_emdash/admin");
	} catch (callbackError) {
		const rawMsg = callbackError instanceof Error ? callbackError.message : String(callbackError);
		console.error("OAuth callback error:", rawMsg, callbackError);

		let message = "Authentication failed";
		let errorCode = "oauth_error";

		if (callbackError instanceof OAuthError) {
			errorCode = callbackError.code;
			// Show the actual error for debugging
			message = `[${callbackError.code}] ${rawMsg}`;
		} else {
			message = rawMsg || "Authentication failed";
		}
		// For generic errors, keep the default "Authentication failed" message

		return redirect(
			`/_emdash/admin/login?error=${errorCode}&message=${encodeURIComponent(message)}`,
		);
	}
};

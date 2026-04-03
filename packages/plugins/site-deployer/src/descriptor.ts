/**
 * Token Press Site Deployer Plugin
 *
 * Manages the deployment lifecycle of user websites:
 * - Store site config in KV
 * - Deploy to Cloudflare Pages via Direct Upload API
 * - Manage custom domains
 */

import type { PluginDescriptor } from "emdash";

export interface SiteDeployerOptions {
	/** Cloudflare Account ID */
	accountId?: string;
	/** Cloudflare API Token with Pages permissions */
	cfApiToken?: string;
	/** Base domain for subdomains (e.g. "token-press.com") */
	baseDomain?: string;
}

export function siteDeployerPlugin(
	options: SiteDeployerOptions = {},
): PluginDescriptor<SiteDeployerOptions> {
	return {
		id: "site-deployer",
		version: "0.1.0",
		entrypoint: "@token-press/plugin-site-deployer/plugin",
		options,
	};
}

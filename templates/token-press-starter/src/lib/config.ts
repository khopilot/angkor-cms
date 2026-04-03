/**
 * Site Configuration — reads from site.config.json
 *
 * This is the file the AI modifies to customize each user's site.
 * All components read from this config for theming, section visibility, etc.
 */

// @ts-ignore — JSON import
import rawConfig from "../../site.config.json";

export interface SiteConfig {
	site: {
		name: string;
		tagline: string;
		locale: string;
		url: string;
	};
	cms: {
		apiUrl: string;
		apiToken: string;
	};
	theme: {
		primary: string;
		secondary: string;
		accent: string;
		background: string;
		surface: string;
		text: string;
		textMuted: string;
		font: {
			heading: string;
			body: string;
		};
		borderRadius: string;
		darkMode: boolean;
	};
	hero: {
		style: "gradient" | "image" | "video" | "minimal";
		gradient?: { from: string; via: string; to: string };
		ctaText: string;
		ctaUrl: string;
		secondaryCtaText?: string;
		secondaryCtaUrl?: string;
	};
	sections: Record<string, boolean>;
	nav: {
		style: "solid" | "transparent" | "minimal";
		menuName: string;
	};
	footer: {
		showWidgets: boolean;
		copyright: string;
		showPoweredBy: boolean;
	};
	seo: {
		titleTemplate: string;
		defaultDescription: string;
		ogImage: string;
	};
}

export const config: SiteConfig = rawConfig as SiteConfig;

/** Generate CSS custom properties from theme config */
export function getThemeCSS(): string {
	const t = config.theme;
	return `
		:root {
			--tp-primary: ${t.primary};
			--tp-secondary: ${t.secondary};
			--tp-accent: ${t.accent};
			--tp-bg: ${t.background};
			--tp-surface: ${t.surface};
			--tp-text: ${t.text};
			--tp-text-muted: ${t.textMuted};
			--tp-font-heading: ${t.font.heading};
			--tp-font-body: ${t.font.body};
			--tp-radius: ${t.borderRadius};
		}
	`;
}

/** Format the title using the SEO template */
export function formatTitle(pageTitle: string): string {
	return config.seo.titleTemplate
		.replace("{title}", pageTitle)
		.replace("{siteName}", config.site.name);
}

/** Format the copyright with dynamic year and site name */
export function formatCopyright(): string {
	return config.footer.copyright
		.replace("{year}", new Date().getFullYear().toString())
		.replace("{siteName}", config.site.name);
}

/** Check if a section is enabled */
export function isSectionEnabled(name: string): boolean {
	return config.sections[name] !== false;
}

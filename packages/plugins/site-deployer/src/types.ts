/**
 * Token Press Site Management Types
 */

export interface Site {
	id: string;
	name: string;
	slug: string;
	ownerId: string;
	status: "creating" | "active" | "suspended" | "deleted";
	domain: string | null;
	subdomain: string;
	config: SiteConfig;
	createdAt: string;
	updatedAt: string;
	deployedAt: string | null;
	pagesProjectName: string | null;
}

export interface SiteConfig {
	theme: {
		primary: string;
		secondary: string;
		accent: string;
		font: string;
		darkMode: boolean;
	};
	sections: Record<string, boolean>;
	hero: {
		style: string;
		ctaText: string;
		ctaUrl: string;
	};
	seo: {
		titleTemplate: string;
		description: string;
	};
}

export interface SitePlan {
	id: string;
	name: string;
	price: number;
	features: string[];
	limits: {
		collections: number;
		contentItems: number;
		mediaStorageMb: number;
		aiRequestsPerMonth: number;
		customDomain: boolean;
	};
}

export const PLANS: SitePlan[] = [
	{
		id: "free",
		name: "Free",
		price: 0,
		features: ["1 website", "30 AI requests/month", "100MB storage", "token-press.com subdomain", "Community support"],
		limits: { collections: 3, contentItems: 50, mediaStorageMb: 100, aiRequestsPerMonth: 30, customDomain: false },
	},
	{
		id: "starter",
		name: "Starter",
		price: 9,
		features: ["1 website", "100 AI requests/month", "1GB storage", "Custom domain", "No branding", "Email support"],
		limits: { collections: 10, contentItems: 500, mediaStorageMb: 1000, aiRequestsPerMonth: 100, customDomain: true },
	},
	{
		id: "pro",
		name: "Pro",
		price: 25,
		features: ["3 websites", "500 AI requests/month", "10GB storage", "Custom domains", "AI image generation", "Priority support"],
		limits: { collections: -1, contentItems: -1, mediaStorageMb: 10000, aiRequestsPerMonth: 500, customDomain: true },
	},
	{
		id: "agency",
		name: "Agency",
		price: 79,
		features: ["10 websites", "Unlimited AI", "50GB storage", "White-label", "Team members", "API access", "Dedicated support"],
		limits: { collections: -1, contentItems: -1, mediaStorageMb: 50000, aiRequestsPerMonth: -1, customDomain: true },
	},
];

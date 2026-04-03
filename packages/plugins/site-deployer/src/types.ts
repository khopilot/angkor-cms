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
		features: ["1 website", "5 collections", "100 content items", "100MB media", "50 AI requests/month"],
		limits: { collections: 5, contentItems: 100, mediaStorageMb: 100, aiRequestsPerMonth: 50, customDomain: false },
	},
	{
		id: "pro",
		name: "Pro",
		price: 19,
		features: ["3 websites", "Unlimited collections", "Unlimited content", "5GB media", "500 AI requests/month", "Custom domain"],
		limits: { collections: -1, contentItems: -1, mediaStorageMb: 5000, aiRequestsPerMonth: 500, customDomain: true },
	},
	{
		id: "business",
		name: "Business",
		price: 49,
		features: ["10 websites", "Unlimited everything", "50GB media", "Unlimited AI", "Priority support", "White-label"],
		limits: { collections: -1, contentItems: -1, mediaStorageMb: 50000, aiRequestsPerMonth: -1, customDomain: true },
	},
];

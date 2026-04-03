/**
 * Token Press Site Deployer — My Sites Admin Page
 *
 * Dashboard for managing sites: create, configure, deploy, set domains.
 */

import {
	Globe,
	Plus,
	Trash,
	ArrowSquareOut,
	CircleNotch,
	CheckCircle,
	Copy,
	GearSix,
} from "@phosphor-icons/react";
import type { PluginAdminExports } from "emdash";
import { apiFetch } from "emdash/plugin-utils";
import * as React from "react";

const API = "/_emdash/api/plugins/site-deployer";

interface Site {
	id: string;
	name: string;
	slug: string;
	status: string;
	subdomain: string;
	domain: string | null;
	createdAt: string;
	pagesProjectName: string | null;
}

interface Plan {
	id: string;
	name: string;
	price: number;
	features: string[];
}

// ── Site Card ─────────────────────────────────────────────────────────────────

function SiteCard({ site, onDelete, onRefresh }: { site: Site; onDelete: (id: string) => void; onRefresh: () => void }) {
	const [domainInput, setDomainInput] = React.useState(site.domain ?? "");
	const [settingDomain, setSettingDomain] = React.useState(false);
	const [showDomain, setShowDomain] = React.useState(false);
	const [copied, setCopied] = React.useState(false);

	const siteUrl = site.domain ? `https://${site.domain}` : `https://${site.subdomain}`;
	const statusColor = site.status === "active" ? "#22c55e" : site.status === "creating" ? "#f59e0b" : "#ef4444";

	const copyUrl = () => {
		void navigator.clipboard.writeText(siteUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const setDomain = async () => {
		if (!domainInput.trim()) return;
		setSettingDomain(true);
		try {
			await apiFetch(`${API}/sites/set-domain`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: site.id, domain: domainInput.trim() }),
			});
			onRefresh();
		} catch { /* */ }
		setSettingDomain(false);
		setShowDomain(false);
	};

	return (
		<div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "1rem", padding: "1.5rem", transition: "box-shadow 0.2s" }}>
			{/* Header */}
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
				<div>
					<div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
						<span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor, display: "inline-block" }} />
						<h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>{site.name}</h3>
					</div>
					<p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>Created {new Date(site.createdAt).toLocaleDateString()}</p>
				</div>
				<div style={{ display: "flex", gap: "0.25rem" }}>
					<button onClick={() => setShowDomain(!showDomain)} style={{ padding: "0.375rem", borderRadius: "0.375rem", border: "none", background: "transparent", cursor: "pointer", color: "#6b7280" }} title="Domain settings">
						<GearSix size={16} />
					</button>
					<button onClick={() => onDelete(site.id)} style={{ padding: "0.375rem", borderRadius: "0.375rem", border: "none", background: "transparent", cursor: "pointer", color: "#ef4444" }} title="Delete site">
						<Trash size={16} />
					</button>
				</div>
			</div>

			{/* URL */}
			<div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.75rem", background: "#f9fafb", borderRadius: "0.5rem", marginBottom: "1rem" }}>
				<Globe size={14} style={{ color: "#6b7280", flexShrink: 0 }} />
				<span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
					{siteUrl}
				</span>
				<button onClick={copyUrl} style={{ padding: "0.25rem", border: "none", background: "transparent", cursor: "pointer", color: copied ? "#22c55e" : "#9ca3af" }} title="Copy URL">
					{copied ? <CheckCircle size={14} /> : <Copy size={14} />}
				</button>
				<a href={siteUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "0.25rem", color: "#6b7280" }} title="Open site">
					<ArrowSquareOut size={14} />
				</a>
			</div>

			{/* Domain settings */}
			{showDomain && (
				<div style={{ padding: "0.75rem", background: "#f0f9ff", borderRadius: "0.5rem", marginBottom: "0.75rem" }}>
					<label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#1e40af", marginBottom: "0.375rem" }}>Custom Domain</label>
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<input
							type="text"
							value={domainInput}
							onChange={(e) => setDomainInput(e.target.value)}
							placeholder="mysite.com"
							style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #93c5fd", borderRadius: "0.375rem", fontSize: "0.85rem", outline: "none", color: "#111827" }}
						/>
						<button
							onClick={() => void setDomain()}
							disabled={settingDomain}
							style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "0.375rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", opacity: settingDomain ? 0.6 : 1 }}
						>
							{settingDomain ? "..." : "Set"}
						</button>
					</div>
					{site.domain && (
						<p style={{ margin: "0.5rem 0 0", fontSize: "0.72rem", color: "#1e40af" }}>
							Add CNAME: {site.domain} → {site.subdomain}
						</p>
					)}
				</div>
			)}

			{/* Status badges */}
			<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
				<span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "999px", background: "#f3f4f6", color: "#6b7280" }}>
					{site.pagesProjectName ?? site.slug}
				</span>
				{site.domain && (
					<span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "999px", background: "#dcfce7", color: "#166534" }}>
						{site.domain}
					</span>
				)}
			</div>
		</div>
	);
}

// ── Create Site Dialog ────────────────────────────────────────────────────────

function CreateSiteDialog({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
	const [name, setName] = React.useState("");
	const [siteType, setSiteType] = React.useState("business");
	const [creating, setCreating] = React.useState(false);
	const [error, setError] = React.useState("");

	const types = [
		{ id: "business", label: "Business / Agency" },
		{ id: "restaurant", label: "Restaurant / Cafe" },
		{ id: "portfolio", label: "Portfolio / Freelancer" },
		{ id: "blog", label: "Blog / Media" },
		{ id: "saas", label: "SaaS / Product" },
		{ id: "ecommerce", label: "E-commerce" },
	];

	const create = async () => {
		if (!name.trim()) { setError("Name is required"); return; }
		setCreating(true);
		setError("");
		try {
			const res = await apiFetch(`${API}/sites/create`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: name.trim(), site_type: siteType }),
			});
			const data = await res.json() as { data?: { error?: string }; error?: string };
			const err = data.data?.error ?? data.error;
			if (err) { setError(String(err)); setCreating(false); return; }
			onCreated();
			onClose();
		} catch {
			setError("Failed to create site");
			setCreating(false);
		}
	};

	return (
		<div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
			<div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
			<div style={{ position: "relative", background: "#fff", borderRadius: "1rem", padding: "2rem", width: "100%", maxWidth: "28rem", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
				<h2 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>Create New Site</h2>

				<div style={{ marginBottom: "1rem" }}>
					<label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>Site Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="My Awesome Website"
						autoFocus
						style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.9rem", outline: "none", color: "#111827", boxSizing: "border-box" }}
					/>
				</div>

				<div style={{ marginBottom: "1.5rem" }}>
					<label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>Site Type</label>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
						{types.map((t) => (
							<button
								key={t.id}
								onClick={() => setSiteType(t.id)}
								style={{
									padding: "0.625rem 0.75rem",
									border: `2px solid ${siteType === t.id ? "#2563eb" : "#e5e7eb"}`,
									borderRadius: "0.5rem",
									background: siteType === t.id ? "#eff6ff" : "#fff",
									color: siteType === t.id ? "#1d4ed8" : "#374151",
									fontSize: "0.8rem",
									fontWeight: siteType === t.id ? 600 : 400,
									cursor: "pointer",
									textAlign: "left",
								}}
							>
								{t.label}
							</button>
						))}
					</div>
				</div>

				{error && (
					<p style={{ margin: "0 0 1rem", padding: "0.5rem 0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: "0.375rem", fontSize: "0.8rem" }}>{error}</p>
				)}

				<div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
					<button onClick={onClose} style={{ padding: "0.625rem 1.25rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", background: "#fff", color: "#374151", fontSize: "0.85rem", cursor: "pointer" }}>
						Cancel
					</button>
					<button
						onClick={() => void create()}
						disabled={creating}
						style={{ padding: "0.625rem 1.5rem", border: "none", borderRadius: "0.5rem", background: "#2563eb", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: creating ? 0.6 : 1 }}
					>
						{creating ? "Creating..." : "Create Site"}
					</button>
				</div>
			</div>
		</div>
	);
}

// ── My Sites Page ─────────────────────────────────────────────────────────────

function MySitesPage() {
	const [sites, setSites] = React.useState<Site[]>([]);
	const [plans, setPlans] = React.useState<Plan[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [showCreate, setShowCreate] = React.useState(false);

	const loadSites = async () => {
		try {
			const res = await apiFetch(`${API}/sites`);
			if (res.ok) {
				const data = await res.json() as { data?: { items?: Site[]; plans?: Plan[] } };
				setSites(data.data?.items ?? []);
				setPlans(data.data?.plans ?? []);
			}
		} catch { /* */ }
		setLoading(false);
	};

	React.useEffect(() => { void loadSites(); }, []);

	const deleteSite = async (id: string) => {
		if (!confirm("Delete this site? This cannot be undone.")) return;
		await apiFetch(`${API}/sites/delete`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		void loadSites();
	};

	if (loading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
				<CircleNotch size={24} style={{ animation: "spin 1s linear infinite", color: "#6b7280" }} />
			</div>
		);
	}

	return (
		<div style={{ maxWidth: "72rem", margin: "0 auto" }}>
			{/* Header */}
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
				<div>
					<h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#111827" }}>My Sites</h1>
					<p style={{ margin: "0.25rem 0 0", color: "#6b7280", fontSize: "0.9rem" }}>Manage your Token Press websites</p>
				</div>
				<button
					onClick={() => setShowCreate(true)}
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "0.5rem",
						padding: "0.625rem 1.25rem",
						background: "#2563eb",
						color: "#fff",
						border: "none",
						borderRadius: "0.5rem",
						fontSize: "0.85rem",
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					<Plus size={16} weight="bold" />
					New Site
				</button>
			</div>

			{/* Sites grid */}
			{sites.length === 0 ? (
				<div style={{ textAlign: "center", padding: "4rem 1rem", background: "#f9fafb", borderRadius: "1rem", border: "2px dashed #e5e7eb" }}>
					<Globe size={48} style={{ color: "#d1d5db", marginBottom: "1rem" }} />
					<h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 600, color: "#111827" }}>No sites yet</h2>
					<p style={{ margin: "0 0 1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>Create your first website to get started</p>
					<button
						onClick={() => setShowCreate(true)}
						style={{
							padding: "0.75rem 2rem",
							background: "#2563eb",
							color: "#fff",
							border: "none",
							borderRadius: "0.5rem",
							fontSize: "0.9rem",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						Create Your First Site
					</button>
				</div>
			) : (
				<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
					{sites.map((site) => (
						<SiteCard key={site.id} site={site} onDelete={(id) => void deleteSite(id)} onRefresh={() => void loadSites()} />
					))}
				</div>
			)}

			{/* Plans section */}
			{plans.length > 0 && (
				<div style={{ marginTop: "3rem" }}>
					<h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827", marginBottom: "1rem" }}>Plans</h2>
					<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
						{plans.map((plan) => (
							<div key={plan.id} style={{ padding: "1.5rem", border: `2px solid ${plan.id === "pro" ? "#2563eb" : "#e5e7eb"}`, borderRadius: "1rem", background: "#fff", position: "relative" }}>
								{plan.id === "pro" && (
									<span style={{ position: "absolute", top: "-0.625rem", left: "50%", transform: "translateX(-50%)", background: "#2563eb", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.75rem", borderRadius: "999px", textTransform: "uppercase" }}>
										Popular
									</span>
								)}
								<h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>{plan.name}</h3>
								<p style={{ margin: "0 0 1rem" }}>
									<span style={{ fontSize: "2rem", fontWeight: 800, color: "#111827" }}>${plan.price}</span>
									<span style={{ fontSize: "0.8rem", color: "#6b7280" }}>/month</span>
								</p>
								<ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
									{plan.features.map((f, i) => (
										<li key={i} style={{ fontSize: "0.8rem", color: "#374151", padding: "0.3rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
											<CheckCircle size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
											{f}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Create dialog */}
			{showCreate && (
				<CreateSiteDialog
					onCreated={() => void loadSites()}
					onClose={() => setShowCreate(false)}
				/>
			)}

			<style>{`
				@keyframes spin { to { transform: rotate(360deg) } }
			`}</style>
		</div>
	);
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const widgets: PluginAdminExports["widgets"] = {};
export const pages: PluginAdminExports["pages"] = { "/sites": MySitesPage };

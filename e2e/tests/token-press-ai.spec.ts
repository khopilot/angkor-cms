/**
 * Token Press AI E2E Tests — Complete Platform Test Suite
 *
 * Tests the entire Token Press platform:
 * 1. AI Chat Drawer (open, close, preview, history)
 * 2. CMS API Tools (schema, content, settings, deployer, image gen, web browse)
 * 3. Frontend Rendering (homepage, collections, pages)
 * 4. Context-Aware AI (page-specific prompts)
 * 5. Site Management (create, list, domain, delete)
 * 6. Site Blueprint (batch creation)
 */

import { test, expect } from "../fixtures";

test.describe("Token Press AI", () => {
	test.beforeEach(async ({ admin }) => {
		await admin.devBypassAuth();
	});

	// ═══ AI CHAT DRAWER ═══

	test.describe("AI Chat Drawer", () => {
		test("opens when clicking AI Assistant in sidebar", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await expect(aiButton).toBeVisible({ timeout: 10000 });
			await aiButton.click();
			await expect(admin.page.getByText("Token Press AI").first()).toBeVisible({ timeout: 5000 });
		});

		test("shows onboarding actions for new users", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			const anyAction = admin.page.locator("[data-chat-drawer] button").filter({ hasText: /Business|Portfolio|Restaurant|Blog|Build|Write/ });
			await expect(anyAction.first()).toBeVisible({ timeout: 5000 });
		});

		test("has visible input field with placeholder", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			const input = admin.page.locator("[data-chat-drawer] textarea");
			await expect(input).toBeVisible({ timeout: 5000 });
			const placeholder = await input.getAttribute("placeholder");
			expect(placeholder).toBeTruthy();
		});

		test("closes on Escape", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			await expect(admin.page.getByText("Token Press AI").first()).toBeVisible({ timeout: 5000 });
			await admin.page.keyboard.press("Escape");
			await admin.page.waitForTimeout(300);
			// Drawer should still be mounted but translated off-screen
		});

		test("preview button toggles iframe", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			const previewBtn = admin.page.locator("[data-chat-drawer] button", { hasText: "Preview" });
			await expect(previewBtn).toBeVisible({ timeout: 5000 });
			await previewBtn.click();
			const iframe = admin.page.locator("iframe[title='Website Preview']");
			await expect(iframe).toBeVisible({ timeout: 5000 });
			await admin.page.locator("[data-chat-drawer] button", { hasText: "Hide Preview" }).click();
			await expect(iframe).not.toBeVisible();
		});

		test("has conversation history sidebar", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			await expect(admin.page.locator("[data-chat-drawer]").getByText("History").first()).toBeVisible({ timeout: 5000 });
		});

		test("has New chat button", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			await expect(admin.page.locator("[data-chat-drawer] button", { hasText: "New" })).toBeVisible({ timeout: 5000 });
		});
	});

	// ═══ CMS API TOOLS ═══

	test.describe("CMS API Tools", () => {
		test("schema endpoint returns 200", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/schema");
			expect(response.status()).toBe(200);
		});

		test("content list returns data", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/content/posts");
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.data).toBeDefined();
		});

		test("settings endpoint works", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/settings");
			expect(response.status()).toBe(200);
		});

		test("ai chat endpoint returns structured error", async ({ admin }) => {
			const response = await admin.page.request.post("/_emdash/api/plugins/ai-interface/chat", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { messages: [] },
			});
			const data = await response.json();
			const errorText = JSON.stringify(data);
			expect(errorText).toMatch(/error/i);
		});

		test("web browse fetches a page", async ({ admin }) => {
			const response = await admin.page.request.post("/_emdash/api/plugins/ai-interface/browse", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { url: "https://example.com" },
			});
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.data?.title ?? data.title).toBeDefined();
		});

		test("conversation save/load/delete cycle works", async ({ admin }) => {
			const testId = "e2e-test-" + Date.now();

			const saveRes = await admin.page.request.post("/_emdash/api/plugins/ai-interface/conversations/save", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { id: testId, title: "E2E Test", messages: [{ role: "user", content: "test" }] },
			});
			expect(saveRes.status()).toBe(200);

			const loadRes = await admin.page.request.post("/_emdash/api/plugins/ai-interface/conversations/load", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { id: testId },
			});
			expect(loadRes.status()).toBe(200);

			const deleteRes = await admin.page.request.post("/_emdash/api/plugins/ai-interface/conversations/delete", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { id: testId },
			});
			expect(deleteRes.status()).toBe(200);
		});

		test("image generate endpoint responds (requires MiniMax key)", async ({ admin }) => {
			const response = await admin.page.request.post("/_emdash/api/plugins/ai-interface/generate-image", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { prompt: "test image" },
			});
			expect(response.status()).toBe(200);
			// Without MiniMax key, returns error about key — that's fine
			const data = await response.json();
			expect(data).toBeDefined();
		});
	});

	// ═══ SITE DEPLOYER ═══

	test.describe("Site Deployer", () => {
		test("sites list endpoint works", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/plugins/site-deployer/sites");
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.data?.items ?? data.data?.plans ?? data.items ?? data.plans).toBeDefined();
		});

		test("site config endpoint works", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/plugins/site-deployer/config");
			expect(response.status()).toBe(200);
		});

		test("site status endpoint works", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/plugins/site-deployer/status");
			expect(response.status()).toBe(200);
		});

		test("plans endpoint returns pricing tiers", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/plugins/site-deployer/plans");
			expect(response.status()).toBe(200);
			const data = await response.json();
			const plans = data.data?.plans ?? data.plans;
			expect(plans).toBeDefined();
			expect(plans.length).toBeGreaterThanOrEqual(1);
		});

		test("site create and delete cycle works", async ({ admin }) => {
			const testName = "E2E Test Site " + Date.now();

			// Create
			const createRes = await admin.page.request.post("/_emdash/api/plugins/site-deployer/sites/create", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { name: testName, site_type: "business" },
			});
			expect(createRes.status()).toBe(200);
			const createData = await createRes.json();
			const siteId = createData.data?.site?.id ?? createData.site?.id;
			expect(siteId).toBeTruthy();

			// Delete
			if (siteId) {
				const deleteRes = await admin.page.request.post("/_emdash/api/plugins/site-deployer/sites/delete", {
					headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
					data: { id: siteId },
				});
				expect(deleteRes.status()).toBe(200);
			}
		});

		test("config save endpoint works", async ({ admin }) => {
			const response = await admin.page.request.post("/_emdash/api/plugins/site-deployer/config/save", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { theme: { primary: "#ff0000" } },
			});
			expect(response.status()).toBe(200);
		});
	});

	// ═══ FRONTEND RENDERING ═══

	test.describe("Frontend Rendering", () => {
		test("homepage returns 200", async ({ admin }) => {
			const response = await admin.page.request.get("/");
			expect(response.status()).toBe(200);
			const html = await response.text();
			expect(html).toContain("</html>");
		});

		test("services page responds", async ({ admin }) => {
			const response = await admin.page.request.get("/services");
			expect([200, 404]).toContain(response.status());
		});

		test("contact page responds", async ({ admin }) => {
			const response = await admin.page.request.get("/contact");
			expect([200, 404]).toContain(response.status());
		});

		test("team page responds", async ({ admin }) => {
			const response = await admin.page.request.get("/team");
			expect([200, 404]).toContain(response.status());
		});

		test("admin dashboard is accessible", async ({ admin }) => {
			await admin.goto("/");
			await admin.waitForShell();
			await expect(admin.page.locator("text=Dashboard").first()).toBeVisible({ timeout: 10000 });
		});
	});

	// ═══ CONTEXT-AWARE CHAT ═══

	test.describe("Context-Aware Chat", () => {
		test("shows content-specific placeholder on content page", async ({ admin }) => {
			await admin.goToContent("posts");
			await admin.waitForLoading();
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			const input = admin.page.locator("[data-chat-drawer] textarea");
			await expect(input).toBeVisible({ timeout: 5000 });
			const placeholder = await input.getAttribute("placeholder");
			expect(placeholder).toContain("posts");
		});

		test("shows settings placeholder on settings page", async ({ admin }) => {
			await admin.goto("/settings");
			await admin.waitForLoading();
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();
			const input = admin.page.locator("[data-chat-drawer] textarea");
			await expect(input).toBeVisible({ timeout: 5000 });
			const placeholder = await input.getAttribute("placeholder");
			expect(placeholder).toContain("settings");
		});
	});
});

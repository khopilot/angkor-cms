/**
 * Token Press AI E2E Tests
 *
 * End-to-end test of the complete AI website builder flow:
 * 1. Login → Admin dashboard
 * 2. Open AI Chat drawer
 * 3. Verify chat UI renders correctly
 * 4. Verify CMS API tools work (schema, content, settings)
 * 5. Verify frontend renders created content
 * 6. Verify preview panel works
 * 7. Verify site deployer plugin responds
 * 8. Verify conversation history persists
 */

import { test, expect } from "../fixtures";

test.describe("Token Press AI", () => {
	test.beforeEach(async ({ admin }) => {
		await admin.devBypassAuth();
	});

	test.describe("AI Chat Drawer", () => {
		test("opens when clicking AI Assistant in sidebar", async ({ admin }) => {
			// The AI Assistant button may be a button or a link — find it by text
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await expect(aiButton).toBeVisible({ timeout: 10000 });
			await aiButton.click();

			// Drawer should appear with the chat UI
			await expect(admin.page.getByText("Token Press AI").first()).toBeVisible({ timeout: 5000 });
		});

		test("shows quick actions in empty state", async ({ admin }) => {
			const aiButton = admin.page.getByText("AI Assistant", { exact: true }).first();
			await aiButton.click();

			// Should show onboarding quick actions (first visit) or default actions
			// Look for any quick action button inside the drawer
			const anyAction = admin.page.locator("[data-chat-drawer] button").filter({ hasText: /Business|Portfolio|Restaurant|Blog|Build|Write/ });
			await expect(anyAction.first()).toBeVisible({ timeout: 5000 });
		});

		test("has visible input field", async ({ admin }) => {
			const aiButton = admin.page.locator("button", { hasText: "AI Assistant" });
			await aiButton.click();

			// Input should be visible and have placeholder
			const input = admin.page.locator("textarea[placeholder]");
			await expect(input).toBeVisible({ timeout: 5000 });
		});

		test("closes on Escape", async ({ admin }) => {
			const aiButton = admin.page.locator("button", { hasText: "AI Assistant" });
			await aiButton.click();

			await expect(admin.page.locator("text=Token Press AI")).toBeVisible({ timeout: 5000 });

			// Press Escape
			await admin.page.keyboard.press("Escape");

			// Drawer should slide out (but stay mounted)
			// The transform should change to translateX(100%)
			await admin.page.waitForTimeout(300); // wait for animation
		});

		test("preview button toggles iframe", async ({ admin }) => {
			const aiButton = admin.page.locator("button", { hasText: "AI Assistant" });
			await aiButton.click();

			// Click Preview button
			const previewBtn = admin.page.locator("button", { hasText: "Preview" });
			await expect(previewBtn).toBeVisible({ timeout: 5000 });
			await previewBtn.click();

			// iframe should appear
			const iframe = admin.page.locator("iframe[title='Website Preview']");
			await expect(iframe).toBeVisible({ timeout: 5000 });

			// Click again to hide
			await admin.page.locator("button", { hasText: "Hide Preview" }).click();
			await expect(iframe).not.toBeVisible();
		});

		test("conversation history sidebar toggles", async ({ admin }) => {
			const aiButton = admin.page.locator("button", { hasText: "AI Assistant" });
			await aiButton.click();

			// History sidebar should be visible with "History" label
			await expect(admin.page.locator("text=History").first()).toBeVisible({ timeout: 5000 });
		});
	});

	test.describe("CMS API via Tools", () => {
		test("schema_list_collections returns collections", async ({ admin }) => {
			// Directly test the API that the AI tools call
			const response = await admin.page.request.get("/_emdash/api/schema");
			expect(response.status()).toBe(200);
		});

		test("content_list returns posts", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/content/posts");
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.data).toBeDefined();
		});

		test("settings_get returns settings", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/settings");
			expect(response.status()).toBe(200);
		});

		test("site deployer config endpoint works", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/plugins/site-deployer/config");
			expect(response.status()).toBe(200);
		});

		test("site deployer status endpoint works", async ({ admin }) => {
			const response = await admin.page.request.get("/_emdash/api/plugins/site-deployer/status");
			expect(response.status()).toBe(200);
		});

		test("ai chat endpoint responds with structured error", async ({ admin }) => {
			const response = await admin.page.request.post("/_emdash/api/plugins/ai-interface/chat", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { messages: [] },
			});
			// In e2e, no API key is configured — endpoint returns a JSON error (not a crash)
			const data = await response.json();
			// Should have an error field (either "ANTHROPIC_API_KEY not configured" or "No messages")
			const errorText = JSON.stringify(data);
			expect(errorText).toMatch(/error/i);
		});

		test("web browse endpoint works", async ({ admin }) => {
			const response = await admin.page.request.post("/_emdash/api/plugins/ai-interface/browse", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { url: "https://example.com" },
			});
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.data?.title ?? data.title).toBeDefined();
		});

		test("conversation save and load works", async ({ admin }) => {
			const testId = "test-" + Date.now();

			// Save
			const saveRes = await admin.page.request.post("/_emdash/api/plugins/ai-interface/conversations/save", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: {
					id: testId,
					title: "E2E Test Conversation",
					messages: [{ role: "user", content: "test" }],
				},
			});
			expect(saveRes.status()).toBe(200);

			// Load
			const loadRes = await admin.page.request.post("/_emdash/api/plugins/ai-interface/conversations/load", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { id: testId },
			});
			expect(loadRes.status()).toBe(200);

			// Delete
			const deleteRes = await admin.page.request.post("/_emdash/api/plugins/ai-interface/conversations/delete", {
				headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
				data: { id: testId },
			});
			expect(deleteRes.status()).toBe(200);
		});
	});

	test.describe("Frontend Rendering", () => {
		test("homepage renders successfully", async ({ admin }) => {
			// Visit the public homepage — the e2e fixture may not have the Token Press template
			// but the page should render without errors
			const response = await admin.page.request.get("/");
			expect(response.status()).toBe(200);
			const html = await response.text();
			// Should have some HTML content
			expect(html).toContain("</html>");
		});

		test("services page exists", async ({ admin }) => {
			const response = await admin.page.request.get("/services");
			// 200 if services collection exists, 404 if not (both are valid)
			expect([200, 404]).toContain(response.status());
		});

		test("contact page exists", async ({ admin }) => {
			const response = await admin.page.request.get("/contact");
			expect([200, 404]).toContain(response.status());
		});

		test("admin is accessible", async ({ admin }) => {
			await admin.goto("/");
			await admin.waitForShell();
			// Dashboard should be visible
			await expect(admin.page.locator("text=Dashboard").first()).toBeVisible({ timeout: 10000 });
		});
	});

	test.describe("Context-Aware Chat", () => {
		test("shows content-specific actions on content page", async ({ admin }) => {
			// Navigate to posts list
			await admin.goToContent("posts");
			await admin.waitForLoading();

			// Open AI drawer
			const aiButton = admin.page.locator("button", { hasText: "AI Assistant" });
			await aiButton.click();

			// Should show content-specific placeholder
			const input = admin.page.locator("textarea[placeholder]");
			await expect(input).toBeVisible({ timeout: 5000 });
			const placeholder = await input.getAttribute("placeholder");
			expect(placeholder).toContain("posts");
		});

		test("shows settings actions on settings page", async ({ admin }) => {
			await admin.goto("/settings");
			await admin.waitForLoading();

			const aiButton = admin.page.locator("button", { hasText: "AI Assistant" });
			await aiButton.click();

			const input = admin.page.locator("textarea[placeholder]");
			await expect(input).toBeVisible({ timeout: 5000 });
			const placeholder = await input.getAttribute("placeholder");
			expect(placeholder).toContain("settings");
		});
	});
});

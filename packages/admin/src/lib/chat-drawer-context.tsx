/**
 * Chat Drawer Context — manages global open/close state + page context
 * for the AI chat panel. The drawer overlays on top of any admin page
 * and the AI adapts its behavior based on the current page.
 */

import { useLocation } from "@tanstack/react-router";
import * as React from "react";

// ── Page Context ─────────────────────────────────────────────────────────────

export interface PageContext {
	type: string;
	collection?: string;
	contentId?: string;
	menuName?: string;
	taxonomy?: string;
	slug?: string;
	settingsPage?: string;
	isNew?: boolean;
	isEditing?: boolean;
}

/** Parse the current admin pathname into a PageContext */
function detectPageContext(pathname: string): PageContext {
	// Content edit: /content/posts/abc123
	const contentEdit = pathname.match(/^\/content\/([^/]+)\/([^/?]+)$/);
	if (contentEdit && contentEdit[2] !== "new") {
		return { type: "content", collection: contentEdit[1], contentId: contentEdit[2], isEditing: true };
	}

	// Content new: /content/posts/new
	const contentNew = pathname.match(/^\/content\/([^/]+)\/new$/);
	if (contentNew) {
		return { type: "content", collection: contentNew[1], isNew: true };
	}

	// Content list: /content/posts
	const contentList = pathname.match(/^\/content\/([^/]+)$/);
	if (contentList) {
		return { type: "content", collection: contentList[1] };
	}

	// Menu editor: /menus/primary
	const menu = pathname.match(/^\/menus\/([^/]+)$/);
	if (menu) return { type: "menu", menuName: menu[1] };
	if (pathname === "/menus") return { type: "menu" };

	// Taxonomy: /taxonomies/category
	const tax = pathname.match(/^\/taxonomies\/([^/]+)$/);
	if (tax) return { type: "taxonomy", taxonomy: tax[1] };

	// Settings: /settings/seo
	if (pathname.startsWith("/settings")) {
		const page = pathname.split("/")[2] || "general";
		return { type: "settings", settingsPage: page };
	}

	// Content types: /content-types/services
	const ct = pathname.match(/^\/content-types\/([^/]+)$/);
	if (ct && ct[1] !== "new") return { type: "content-types", slug: ct[1] };
	if (pathname === "/content-types/new") return { type: "content-types", isNew: true };
	if (pathname === "/content-types") return { type: "content-types" };

	// Sections: /sections/hero
	const sec = pathname.match(/^\/sections\/([^/]+)$/);
	if (sec) return { type: "sections", slug: sec[1] };
	if (pathname === "/sections") return { type: "sections" };

	// Simple pages
	if (pathname === "/widgets") return { type: "widgets" };
	if (pathname === "/redirects") return { type: "redirects" };
	if (pathname === "/comments") return { type: "comments" };
	if (pathname === "/users") return { type: "users" };
	if (pathname === "/media") return { type: "media" };
	if (pathname === "/bylines") return { type: "bylines" };
	if (pathname === "/plugins-manager") return { type: "plugins" };

	return { type: "dashboard" };
}

// ── Context ──────────────────────────────────────────────────────────────────

interface ChatDrawerContextType {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	pageContext: PageContext;
}

const ChatDrawerContext = React.createContext<ChatDrawerContextType>({
	isOpen: false,
	open: () => {},
	close: () => {},
	toggle: () => {},
	pageContext: { type: "dashboard" },
});

export function ChatDrawerProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const location = useLocation();
	const pageContext = React.useMemo(() => detectPageContext(location.pathname), [location.pathname]);

	const value = React.useMemo(
		() => ({
			isOpen,
			open: () => setIsOpen(true),
			close: () => setIsOpen(false),
			toggle: () => setIsOpen((prev) => !prev),
			pageContext,
		}),
		[isOpen, pageContext],
	);

	return <ChatDrawerContext.Provider value={value}>{children}</ChatDrawerContext.Provider>;
}

export function useChatDrawer() {
	return React.useContext(ChatDrawerContext);
}

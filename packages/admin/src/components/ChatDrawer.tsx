/**
 * ChatDrawer — Global floating chat panel.
 * Slides in from the right, overlays on top of any admin page.
 * Passes page context so the AI adapts to the current admin page.
 *
 * The ChatPage stays mounted (hidden) when the drawer is closed
 * so conversation state is preserved across open/close.
 */

import { X } from "@phosphor-icons/react";
import * as React from "react";

import { useChatDrawer } from "../lib/chat-drawer-context";
import { usePluginAdmins } from "../lib/plugin-context";

export function ChatDrawer() {
	const { isOpen, close, pageContext } = useChatDrawer();
	const pluginAdmins = usePluginAdmins();

	const ChatPage = pluginAdmins["ai-interface"]?.pages?.["/chat"];
	// Track if we've ever opened — mount ChatPage on first open, keep mounted after
	const [hasOpened, setHasOpened] = React.useState(false);

	React.useEffect(() => {
		if (isOpen) setHasOpened(true);
	}, [isOpen]);

	React.useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close]);

	if (!ChatPage) return null;

	return (
		<>
			{/* Backdrop — only when open */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
					onClick={close}
					aria-hidden="true"
				/>
			)}

			{/* Drawer panel — mounted after first open, hidden when closed */}
			{hasOpened && (
				<div
					className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col shadow-2xl transition-transform duration-200"
					style={{
						backgroundColor: "#ffffff",
						transform: isOpen ? "translateX(0)" : "translateX(100%)",
					}}
				>
					<button
						onClick={close}
						className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
						style={{ color: "#6b7280" }}
						title="Close (Esc)"
					>
						<X className="h-4 w-4" />
					</button>

					<div
						data-page-context={JSON.stringify(pageContext)}
						className="flex-1 overflow-hidden"
					>
						<ChatPage />
					</div>
				</div>
			)}
		</>
	);
}

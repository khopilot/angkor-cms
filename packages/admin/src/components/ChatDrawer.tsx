/**
 * ChatDrawer — Global floating chat panel.
 * Slides in from the right, overlays on top of any admin page.
 * Passes page context so the AI adapts to the current admin page.
 */

import { X } from "@phosphor-icons/react";
import * as React from "react";

import { useChatDrawer } from "../lib/chat-drawer-context";
import { usePluginAdmins } from "../lib/plugin-context";

export function ChatDrawer() {
	const { isOpen, close, pageContext } = useChatDrawer();
	const pluginAdmins = usePluginAdmins();

	const ChatPage = pluginAdmins["ai-interface"]?.pages?.["/chat"];

	React.useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close]);

	if (!isOpen || !ChatPage) return null;

	return (
		<>
			<div
				className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
				onClick={close}
				aria-hidden="true"
			/>

			<div
				className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col shadow-2xl"
				style={{ backgroundColor: "#ffffff" }}
			>
				<button
					onClick={close}
					className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
					style={{ color: "#6b7280" }}
					title="Close (Esc)"
				>
					<X className="h-4 w-4" />
				</button>

				{/* Pass page context via data attribute for cross-package communication */}
				<div
					data-page-context={JSON.stringify(pageContext)}
					className="flex-1 overflow-hidden"
				>
					<ChatPage />
				</div>
			</div>
		</>
	);
}

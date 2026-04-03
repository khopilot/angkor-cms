/**
 * Chat Drawer Context — manages global open/close state for the AI chat panel.
 * The drawer overlays on top of any admin page.
 */

import * as React from "react";

interface ChatDrawerContextType {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

const ChatDrawerContext = React.createContext<ChatDrawerContextType>({
	isOpen: false,
	open: () => {},
	close: () => {},
	toggle: () => {},
});

export function ChatDrawerProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = React.useState(false);

	const value = React.useMemo(
		() => ({
			isOpen,
			open: () => setIsOpen(true),
			close: () => setIsOpen(false),
			toggle: () => setIsOpen((prev) => !prev),
		}),
		[isOpen],
	);

	return <ChatDrawerContext.Provider value={value}>{children}</ChatDrawerContext.Provider>;
}

export function useChatDrawer() {
	return React.useContext(ChatDrawerContext);
}

import * as React from "react";

import { useCurrentUser } from "../lib/api/current-user";
import { ChatDrawerProvider, useChatDrawer } from "../lib/chat-drawer-context";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { ChatDrawer } from "./ChatDrawer";
import { Header } from "./Header";
import { Sidebar, SidebarNav } from "./Sidebar";
import { WelcomeModal } from "./WelcomeModal";

/** Auto-open AI drawer on first visit */
function FirstVisitAutoOpen() {
	const { open } = useChatDrawer();
	React.useEffect(() => {
		const key = "tp:ai-onboarded";
		if (!localStorage.getItem(key)) {
			localStorage.setItem(key, "1");
			// Slight delay so the admin shell renders first
			const timer = setTimeout(open, 800);
			return () => clearTimeout(timer);
		}
	}, [open]);
	return null;
}

export interface ShellProps {
	children: React.ReactNode;
	manifest: {
		collections: Record<string, { label: string }>;
		plugins: Record<
			string,
			{
				package?: string;
				adminPages?: Array<{ path: string; label?: string; icon?: string }>;
			}
		>;
		version?: string;
	};
}

/**
 * Admin shell layout with kumo Sidebar component.
 *
 * Sidebar.Provider wraps both the sidebar and main content area,
 * handling collapse state, mobile detection, and layout transitions.
 */
export function Shell({ children, manifest }: ShellProps) {
	const [welcomeModalOpen, setWelcomeModalOpen] = React.useState(false);

	const { data: user } = useCurrentUser();

	// Show welcome modal on first login
	React.useEffect(() => {
		if (user?.isFirstLogin) {
			setWelcomeModalOpen(true);
		}
	}, [user?.isFirstLogin]);

	return (
		<ChatDrawerProvider>
			<Sidebar.Provider
				defaultOpen
				style={
					{
						height: "100svh",
						minHeight: "0",
						overflow: "hidden",
						"--sidebar-width-icon": "53px",
					} as React.CSSProperties
				}
			>
				{/* Sidebar navigation */}
				<SidebarNav manifest={manifest} />

				{/* Main content area — scrolls independently so sidebar stays full height */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<Header />
					<main className="flex-1 overflow-y-auto p-6">{children}</main>
				</div>

				{/* Welcome modal for first-time users */}
				{user && (
					<WelcomeModal
						open={welcomeModalOpen}
						onClose={() => setWelcomeModalOpen(false)}
						userName={user.name}
						userRole={user.role}
					/>
				)}

				{/* Command palette for quick navigation */}
				<AdminCommandPalette manifest={manifest} />

				{/* Auto-open AI drawer on first visit */}
				<FirstVisitAutoOpen />

				{/* Global AI chat drawer — overlays on any page */}
				<ChatDrawer />
			</Sidebar.Provider>
		</ChatDrawerProvider>
	);
}

/**
 * Token Press Logo — TP monogram in blue circle
 * Used in: sidebar, login, setup wizard, chat drawer
 */
import * as React from "react";

interface TPLogoProps {
	size?: number;
	className?: string;
	color?: string;
}

export function TPLogo({ size = 24, className, color = "currentColor" }: TPLogoProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			width={size}
			height={size}
			className={className}
			aria-hidden="true"
		>
			{/* Outer ring */}
			<circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth="4" />
			{/* Inner circle */}
			<circle cx="50" cy="50" r="40" fill={color} />
			{/* T vertical (cutout) */}
			<rect x="28" y="22" width="11" height="56" fill="currentColor" opacity="0" />
			<rect x="28" y="22" width="11" height="56" fill="#1d2327" />
			{/* T horizontal (cutout) */}
			<rect x="20" y="22" width="32" height="10" fill="#1d2327" />
			{/* P vertical (cutout) */}
			<rect x="50" y="22" width="11" height="56" fill="#1d2327" />
			{/* P top horizontal */}
			<rect x="50" y="22" width="22" height="10" fill="#1d2327" />
			{/* P right vertical */}
			<rect x="72" y="22" width="10" height="28" fill="#1d2327" />
			{/* P bottom horizontal */}
			<rect x="50" y="40" width="22" height="10" fill="#1d2327" />
			{/* P bowl (restore color inside) */}
			<rect x="61" y="32" width="11" height="8" rx="2" fill={color} />
		</svg>
	);
}

/** Inline SVG string for use in Astro templates (not React) */
export const TP_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="47" stroke="currentColor" stroke-width="4" fill="none"/><circle cx="50" cy="50" r="40" fill="currentColor"/><rect x="28" y="22" width="11" height="56" fill="#1d2327"/><rect x="20" y="22" width="32" height="10" fill="#1d2327"/><rect x="50" y="22" width="11" height="56" fill="#1d2327"/><rect x="50" y="22" width="22" height="10" fill="#1d2327"/><rect x="72" y="22" width="10" height="28" fill="#1d2327"/><rect x="50" y="40" width="22" height="10" fill="#1d2327"/><rect x="61" y="32" width="11" height="8" rx="2" fill="currentColor"/></svg>`;

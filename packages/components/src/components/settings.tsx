import React from 'react';
import { SidebarOverlay } from './sidebarOverlay';

interface SettingsProps {
	hide: () => void
}
export const Settings: React.FC<SettingsProps> = ({ hide }) => {
	return (
		<SidebarOverlay hide={hide}>
			settings
		</SidebarOverlay>
	);
}
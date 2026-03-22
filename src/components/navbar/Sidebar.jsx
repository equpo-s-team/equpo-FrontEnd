import SidebarLogo from './SidebarLogo.jsx';
import SidebarItem from './SidebarItem.jsx';
import SidebarSection from './SidebarSection.jsx';
import SidebarUser from './SidebarUser.jsx';
import SidebarToggle from './SidebarToggle.jsx';
import {useSidebar} from "@/components/navbar/SidebarContext.jsx";
import {Home, Star, MessageCircle, ChartColumnBig, Settings} from "lucide-react";

export default function Sidebar() {
    const {collapsed} = useSidebar();

    return (
        <aside
            className={`
                hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40
                bg-primary border-r border-secondary transition-all duration-300 ease-in-out
                ${collapsed ? 'w-[68px]' : 'w-[220px]'}
            `}
        >
            <SidebarLogo/>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-5 scrollbar-hide">
                <SidebarSection label="Principal">
                    <SidebarItem id="my-space" icon={Home} label="Mi Espacio"/>
                    <SidebarItem id="missiones" icon={Star} label="Misiones" badge="3"/>
                    <SidebarItem id="chat" icon={MessageCircle} label="Chat" badge="12"/>
                </SidebarSection>

                <SidebarSection label="Moderation">
                    <SidebarItem id="reports" icon={ChartColumnBig} label="Reportes" badge="2"/>
                    <SidebarItem id="settings" icon={Settings} label="Ajustes"/>
                </SidebarSection>
            </nav>

            <SidebarUser/>
            <SidebarToggle/>
        </aside>
    );
}

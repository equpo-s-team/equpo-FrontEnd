import {useSidebar} from "./navbar/SidebarContext.jsx";
import BottomNav from "./navbar/BottomNav.jsx";
import Sidebar from "./navbar/Sidebar.jsx";


export default function AppLayout({ children }) {
    const { collapsed, activeItem } = useSidebar();

    return (
        <div className="min-h-screen bg-secondary font-body">
            <Sidebar />
            <main
                className={`
                    transition-all duration-300 ease-in-out
                    lg:${collapsed ? 'ml-[68px]' : 'ml-[220px]'}
                    pb-20 lg:pb-0 rounded-l-2xl
                `}
                style={{
                    marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
                        ? collapsed ? '68px' : '220px'
                        : 0
                }}
            >
                {children}
            </main>

            <BottomNav/>
        </div>
    );
}

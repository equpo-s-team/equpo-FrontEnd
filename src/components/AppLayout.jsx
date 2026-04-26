import BottomNav from '../features/navbar/BottomNav.jsx';
import Sidebar from '../features/navbar/Sidebar.jsx';
import { useSidebar } from '../features/navbar/SidebarContext.jsx';

export default function AppLayout({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-secondary font-body">
      <Sidebar />
      <main
        className={`
                    transition-all duration-300 ease-in-out
                    ml-0 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[220px]'}
                    lg:pb-0 rounded-l-2xl
                `}
      >
        {children}
      </main>

      <BottomNav />
    </div>
  );
}

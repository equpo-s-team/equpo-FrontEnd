import BottomNav from '../features/navbar/BottomNav';
import Sidebar from '../features/navbar/Sidebar';
import { useSidebar } from '../features/navbar/SidebarContext';

export default function AppLayout({ children }:{ children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-800 font-body">
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

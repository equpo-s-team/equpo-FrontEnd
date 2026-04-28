import BottomNav from '../features/navbar/BottomNav.jsx';
import Sidebar from '../features/navbar/Sidebar.jsx';
import { useSidebar } from '../features/navbar/SidebarContext.jsx';
import { useTaskSidebar } from '../context/TaskSidebarContext';

export default function AppLayout({ children }) {
  const { collapsed } = useSidebar();
  const { isOpen: isTaskSidebarOpen } = useTaskSidebar();

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

      {!isTaskSidebarOpen && <BottomNav />}
    </div>
  );
}

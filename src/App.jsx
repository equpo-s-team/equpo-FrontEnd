import './app.css';
import {useRevealAll} from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/landing/Hero';
import WhatIsEqupo from './components/landing/WhatIsEqupo';
import Nucleus from './components/landing/Nucleus';
import Features from './components/landing/Features';
import CTAFinal from './components/landing/CTAFinal';
import Footer from './components/landing/Footer';
import AppLayout from "@/components/AppLayout.jsx";
import {SidebarProvider, useSidebar} from "@/components/navbar/SidebarContext.jsx";
import KanbanBoard from "@/components/board/KanbanBoard.jsx";

const isDashboard = true;

function DashboardContent() {
    const {activeItem} = useSidebar();

    const renderPage = () => {
        switch (activeItem) {
            case 'my-space':
                return <div className="p-8 text-dark bg-light-mid w-full h-full rounded-l-2xl">
                    <h1 className="font-maxwell text-display-lg text-green-dark mb-2">Mi Espacio</h1>
                    <p className="text-dark/50 font-body">Contenido del dashboard aquí.</p>
                </div>;
            case 'missiones':
                return <KanbanBoard/>;
            case 'chat':
                return <div className="p-8">ChatPage</div>;
            case 'reports':
                return <div className="p-8">ReportsPage</div>;
            case 'settings':
                return <div className="p-8">SettingsPage</div>;
            default:
                return <div className="p-8 text-dark bg-light-mid w-full h-full rounded-l-2xl">
                    <h1 className="font-maxwell text-display-lg text-green-dark mb-2">Mi Espacio</h1>
                    <p className="text-dark/50 font-body">Contenido del dashboard aquí.</p>
                </div>;
        }
    };

    return (
        <AppLayout>
            {renderPage()}
        </AppLayout>
    );
}

export default function App() {
    const {containerRef} = useRevealAll();

    if (isDashboard) {
        return (
            <SidebarProvider>
                <DashboardContent/>
            </SidebarProvider>
        );
    }

    return (
        <div ref={containerRef} className="font-body">
            <Navbar/>
            <Hero/>
            <WhatIsEqupo/>
            <Nucleus/>
            <Features/>
            <CTAFinal/>
            <Footer/>
        </div>
    );
}

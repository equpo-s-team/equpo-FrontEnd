import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {SidebarProvider, useSidebar} from '@/components/navbar/SidebarContext.jsx';
import AppLayout from '@/components/AppLayout.jsx';
import Navbar from '@/components/landing/Navbar.jsx';
import Hero from '@/components/landing/Hero';
import WhatIsEqupo from '@/components/landing/WhatIsEqupo';
import Nucleus from '@/components/landing/Nucleus';
import Features from '@/components/landing/Features';
import CTAFinal from '@/components/landing/CTAFinal';
import Footer from '@/components/landing/Footer';
import KanbanBoard from "@/components/board/KanbanBoard.jsx";

function Dashboard() {
    const {activeItem} = useSidebar();

    const renderContent = () => {
        switch (activeItem) {
            case 'my-space':
                return <div>Mi Espacio</div>;
            case 'missiones':
                return <KanbanBoard/>;
            case 'chat':
                return <div>Mi Espacio</div>;
            case 'reports':
                return <div>Mi Espacio</div>;
            case 'settings':
                return <div>Mi Espacio</div>;
            default:
                return <div>Mi Espacio</div>;
        }
    };

    return (
        <AppLayout>
            {renderContent()}
        </AppLayout>
    );
}

function PublicLayout() {
    return (
        <div className="font-body">
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

function ProtectedRoute({children}) {
    const {isAuth, isLoading} = useAuth();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-600">Loading...</div>
        </div>;
    }

    return isAuth ? (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    ) : <Navigate to="/" replace/>;
}


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicLayout/>}/>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

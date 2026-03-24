import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth.js';
import {SidebarProvider} from '@/components/navbar/SidebarContext.jsx';
import AppLayout from '@/components/AppLayout.jsx';
import Navbar from '@/components/landing/Navbar.jsx';
import Hero from '@/components/landing/Hero';
import WhatIsEqupo from '@/components/landing/WhatIsEqupo';
import Nucleus from '@/components/landing/Nucleus';
import Features from '@/components/landing/Features';
import CTAFinal from '@/components/landing/CTAFinal';
import Footer from '@/components/landing/Footer';

function Dashboard() {
    return (
        <SidebarProvider>
            <AppLayout>
                <div className="p-8 text-dark bg-light-mid w-full h-full rounded-l-2xl">
                    <h1 className="font-maxwell text-display-lg text-green-dark mb-2">Mi Espacio</h1>
                    <p className="text-dark/50 font-body">Contenido del dashboard aquí.</p>
                </div>
            </AppLayout>
        </SidebarProvider>
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
    const {isAuth} = useAuth();
    return isAuth ? children : <Navigate to="/" replace/>;
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

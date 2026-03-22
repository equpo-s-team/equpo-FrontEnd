import './app.css';
import { useRevealAll } from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/landing/Hero';
import WhatIsEqupo from './components/landing/WhatIsEqupo';
import Nucleus from './components/landing/Nucleus';
import Features from './components/landing/Features';
import CTAFinal from './components/landing/CTAFinal';
import Footer from './components/landing/Footer';
import AppLayout from "@/components/AppLayout.jsx";
import {SidebarProvider} from "@/components/navbar/SidebarContext.jsx";


const isDashboard = true;

export default function App() {
    const { containerRef } = useRevealAll();

    if (isDashboard) {
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

    return (
        <div ref={containerRef} className="font-body">
            <Navbar />
            <Hero />
            <WhatIsEqupo />
            <Nucleus />
            <Features />
            <CTAFinal />
            <Footer />
        </div>
    );
}

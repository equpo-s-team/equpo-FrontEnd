import './app.css';
import { useRevealAll } from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/landing/Hero';
import WhatIsEqupo from './components/landing/WhatIsEqupo';
import Nucleus from './components/landing/Nucleus';
import Features from './components/landing/Features';
import CTAFinal from './components/landing/CTAFinal';
import Footer from './components/landing/Footer';

export default function App() {
    const { containerRef } = useRevealAll();

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

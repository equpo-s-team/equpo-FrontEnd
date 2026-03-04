import './app.css';
import { useRevealAll } from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsEqupo from './components/WhatIsEqupo';
import Nucleus from './components/Nucleus';
import Features from './components/Features';
import CTAFinal from './components/CTAFinal';
import Footer from './components/Footer';

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

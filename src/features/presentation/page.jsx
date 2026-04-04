import CTAFinal from '@/features/presentation/components/CTAFinal.jsx';
import Features from '@/features/presentation/components/Features.jsx';
import Footer from '@/features/presentation/components/Footer.jsx';
import Hero from '@/features/presentation/components/Hero.jsx';
import Navbar from '@/features/presentation/components/Navbar.jsx';
import Nucleus from '@/features/presentation/components/Nucleus.jsx';
import WhatIsEqupo from '@/features/presentation/components/WhatIsEqupo.jsx';

export default function LandingPage() {
  return (
    <div className="font-body">
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

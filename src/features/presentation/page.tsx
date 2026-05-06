import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import CTAFinal from '@/features/presentation/components/CTAFinal.tsx';
import Features from '@/features/presentation/components/Features.tsx';
import Footer from '@/features/presentation/components/Footer.tsx';
import Hero from '@/features/presentation/components/Hero.tsx';
import Navbar from '@/features/presentation/components/Navbar.tsx';
import Nucleus from '@/features/presentation/components/Nucleus.tsx';
import WhatIsEqupo from '@/features/presentation/components/WhatIsEqupo.tsx';

export default function LandingPage() {
  const { isVerified, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isVerified) {
      void navigate('/teams', { replace: true });
    }
  }, [isLoading, isVerified, navigate]);

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

import WhatIsEqupo from "@/features/presentation/components/WhatIsEqupo.jsx";
import Nucleus from "@/features/presentation/components/Nucleus.jsx";
import Features from "@/features/presentation/components/Features.jsx";
import Footer from "@/features/presentation/components/Footer.jsx";
import Navbar from "@/features/presentation/components/Navbar.jsx";
import Hero from "@/features/presentation/components/Hero.jsx";
import CTAFinal from "@/features/presentation/components/CTAFinal.jsx";

export default function LandingPage() {
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

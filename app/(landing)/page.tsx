import AnimatedSection from "../components/ui/AnimatedSection";

import Hero from "./components/Hero";
import ComeFunziona from "./components/ComeFunziona";
import PercheZelvio from "./components/PercheZelvio";
import ChiSiamo from "./components/ChiSiamo";
import Contatti from "./components/Contatti";
import Footer from "./components/Footer";

export default function LandingPage() {
    return (
        <main className="bg-white">

            <AnimatedSection>
                <Hero />
            </AnimatedSection>

            <AnimatedSection>
                <ComeFunziona />
            </AnimatedSection>

            <AnimatedSection>
                <PercheZelvio />
            </AnimatedSection>

            <AnimatedSection>
                <ChiSiamo />
            </AnimatedSection>

            <AnimatedSection>
                <Contatti />
            </AnimatedSection>

            <AnimatedSection>
                <Footer />
            </AnimatedSection>

        </main>
    );
}
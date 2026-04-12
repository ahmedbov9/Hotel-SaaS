import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { FeaturesSection } from "@/components/public/features-section";
import { HowItWorksSection } from "@/components/public/how-it-works-section";
import { BookingPreviewSection } from "@/components/public/booking-preview-section";
import { CtaSection } from "@/components/public/cta-section";
import { Footer } from "@/components/public/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BookingPreviewSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
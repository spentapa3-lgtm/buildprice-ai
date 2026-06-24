import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import AIInsights from "../components/AIInsights";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="bg-slate-950 text-white">

      <Hero />

      <StatsSection />

      <AIInsights />

      <Footer />

    </main>
  );
}
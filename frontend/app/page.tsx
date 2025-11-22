import FeatureGrid from "./components/FeatureGrid";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
    </main>
  );
}

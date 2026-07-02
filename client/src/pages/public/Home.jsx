import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/components/layout/Features";
import Stats from "@/components/layout/Stats";

function Home() {
  return (
    <div className="bg-[#050816] text-white">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
    </div>
  );
}

export default Home;
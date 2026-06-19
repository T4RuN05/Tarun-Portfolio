import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { Skills } from "@/components/sections/Skills";
import { Achievements } from "@/components/sections/Achievements";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <Hero />
      <About />
      <Timeline />
      <Skills />
      <Achievements />
      <Projects />
      <Contact />
    </main>
  );
}

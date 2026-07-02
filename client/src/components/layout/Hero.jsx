import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold leading-tight"
        >
          Share Knowledge.
          <br />
          <span className="text-purple-500">Learn Smarter.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-gray-400"
        >
          AI-powered smart campus platform for notes, study planning,
          collaboration, and academic success.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex justify-center gap-5"
        >
          <Button>Get Started</Button>
          <Button variant="secondary">Explore Notes</Button>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
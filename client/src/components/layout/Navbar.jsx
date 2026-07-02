import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { APP_NAME } from "@/constants/theme";

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-purple-400"
        >
          {APP_NAME}
        </Link>

        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#features" className="hover:text-purple-400 transition">
            Features
          </a>

          <a href="#about" className="hover:text-purple-400 transition">
            About
          </a>

          <a href="#contact" className="hover:text-purple-400 transition">
            Contact
          </a>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">Login</Button>
          <Button>Register</Button>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
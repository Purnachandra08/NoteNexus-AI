import { motion } from "framer-motion";

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>

      <h3 className="text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-gray-400">
        {description}
      </p>
    </motion.div>
  );
}

export default FeatureCard;
import {
  FaRobot,
  FaBook,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

import FeatureCard from "@/components/ui/FeatureCard";

function Features() {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI Summary",
      description:
        "Generate summaries, key points and important questions automatically.",
    },
    {
      icon: <FaBook />,
      title: "Smart Notes",
      description:
        "Upload, organize and search notes by subject, semester and department.",
    },
    {
      icon: <FaUsers />,
      title: "Collaboration",
      description:
        "Discuss, comment and share knowledge with students and faculty.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics",
      description:
        "Track uploads, downloads, performance and leaderboard rankings.",
    },
  ];

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <h2 className="text-5xl font-bold text-center text-purple-400">
        Features
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;
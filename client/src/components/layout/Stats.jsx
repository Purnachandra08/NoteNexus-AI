function Stats() {
  const stats = [
    { value: "10K+", label: "Notes Shared" },
    { value: "5K+", label: "Students" },
    { value: "500+", label: "Faculty" },
    { value: "100+", label: "Departments" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <h3 className="text-4xl font-bold text-purple-400">
              {item.value}
            </h3>

            <p className="mt-2 text-gray-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
function Card({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
      {children}
    </div>
  );
}

export default Card;
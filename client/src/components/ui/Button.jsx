import clsx from "clsx";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const baseStyle =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30",

    secondary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",

    outline:
      "border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(baseStyle, variants[variant], className)}
    >
      {children}
    </button>
  );
}

export default Button;
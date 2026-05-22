import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gradient" | "secondary" | "ghost";
  loading?: boolean;
}

export function Button({
  children,
  variant = "gradient",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    gradient:
      "bg-gradient-to-r from-accent-light to-accent text-accent-deep hover:opacity-90 active:opacity-80",
    secondary: "bg-bg-input text-text-primary border border-border hover:bg-[#33343b]",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-input",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

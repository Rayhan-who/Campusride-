import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-maroon text-white hover:bg-maroon-dark disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "bg-white text-maroon border border-border-strong hover:bg-maroon-light disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "bg-transparent text-text hover:bg-black/5 disabled:opacity-50 disabled:pointer-events-none",
  danger:
    "bg-white text-danger border border-danger/30 hover:bg-danger-bg disabled:opacity-50 disabled:pointer-events-none",
};

const sizeClasses: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors cursor-pointer text-center";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}

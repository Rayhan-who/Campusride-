import { cn } from "@/lib/utils/cn";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, id, className, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "rounded-xl border border-border-strong bg-white px-4 py-2.5 text-sm text-text placeholder:text-gray outline-none transition-colors focus:border-maroon",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function SelectField({ label, id, className, children, ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "rounded-xl border border-border-strong bg-white px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-maroon",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

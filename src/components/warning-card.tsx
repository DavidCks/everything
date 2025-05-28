import { cn } from "@/lib/utils";
import { FaExclamationTriangle } from "react-icons/fa";

export function WarningCard({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("rounded-md py-4 px-4 bg-[var(--warning)]", className)}
      {...props}
    >
      <span className="flex items-baseline">
        <FaExclamationTriangle className="inline me-2" /> {children}
      </span>
    </p>
  );
}

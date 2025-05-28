import { cn } from "@/lib/utils";
import { FaExclamation } from "react-icons/fa";

export function ErrorCard({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("rounded-md py-4 px-4 bg-[var(--error)]", className)}
      {...props}
    >
      <span className="flex items-baseline">
        <FaExclamation className="inline me-2" /> {children}
      </span>
    </p>
  );
}

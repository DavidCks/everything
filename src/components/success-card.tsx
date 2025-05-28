import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa";

export function SuccessCard({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("rounded-md py-4 px-4 bg-[var(--success)]", className)}
      {...props}
    >
      <span className="flex items-baseline">
        <FaCheck className="inline me-2" /> {children}
      </span>
    </p>
  );
}

import { cn } from "@/lib/utils";
import { FaInfo } from "react-icons/fa";

export function InfoCard({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("rounded-md py-4 px-4 bg-[var(--info)]", className)}
      {...props}
    >
      <span className="flex items-baseline">
        <FaInfo className="inline me-2" /> {children}
      </span>
    </p>
  );
}

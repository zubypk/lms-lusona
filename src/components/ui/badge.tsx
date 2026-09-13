import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-info-bg text-primary",
        navy: "bg-navy text-white",
        muted: "bg-paper-2 text-muted",
        ok: "bg-ok-bg text-ok",
        warn: "bg-warn-bg text-warn",
        danger: "bg-danger-bg text-danger",
        outline: "border border-line text-ink-soft",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

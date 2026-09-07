import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export function IconButton({
  label,
  onClick,
  className,
  children,
  disabled,
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-10 items-center justify-center rounded-full text-fg transition-colors",
        "hover:bg-fg/8 active:bg-fg/12 disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export function IconButton({ label, onClick, className, children, disabled }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex size-11 items-center justify-center rounded-full text-fg",
        "transition-[background-color,transform,color] duration-150 ease-[var(--ease-spring)]",
        "hover:bg-fg/8 active:scale-[0.95] disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

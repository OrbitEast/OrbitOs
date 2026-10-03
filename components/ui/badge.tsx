interface BadgeProps {
  children: string;
  variant?: "success" | "danger" | "warning" | "info" | "gray";
}

export function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span className={`status-pill ${variant}`}>
      {children}
    </span>
  );
}

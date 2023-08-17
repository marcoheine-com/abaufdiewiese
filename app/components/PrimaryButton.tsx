export function PrimaryButton({
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      onClick={onClick}
      className="bg-primary rounded-[4px] p-4 w-full mt-4"
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button className="bg-primary rounded-[4px] p-4 w-full mt-4">
      {children}
    </button>
  );
}
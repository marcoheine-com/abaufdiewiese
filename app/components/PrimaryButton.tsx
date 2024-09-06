export function PrimaryButton({
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`bg-primary rounded-[4px] p-4 font-normal ${
        props.disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}

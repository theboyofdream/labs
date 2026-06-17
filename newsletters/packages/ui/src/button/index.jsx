export function Button({ children, variant = "primary", size = "md", disabled = false, onClick, type = "button" }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

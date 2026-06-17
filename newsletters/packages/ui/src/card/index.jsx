export function Card({ children, title }) {
  return (
    <div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

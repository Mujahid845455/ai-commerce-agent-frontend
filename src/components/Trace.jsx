export default function Trace({ label, value }) {
  return (
    <div className="trace-modern">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

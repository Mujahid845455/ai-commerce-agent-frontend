import {
  Sparkles,
} from "lucide-react";
export default function PageHeader({ kicker, title, description }) {
  return (
    <div className="page-header-modern">
      <div className="section-kicker">
        <Sparkles size={13} />
        {kicker}
      </div>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>
  );
}

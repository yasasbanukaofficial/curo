import SectionShell from "./SectionShell";
import SectionHeading from "./SectionHeading";
import IntegrationTile from "./IntegrationTile";

const tools = [
  { name: "Notion", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">N</text></svg> },
  { name: "Slack", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">S</text></svg> },
  { name: "Google Docs", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">GD</text></svg> },
  { name: "Confluence", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">C</text></svg> },
  { name: "GitHub", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">GH</text></svg> },
  { name: "Linear", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">L</text></svg> },
  { name: "Vercel", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">V</text></svg> },
  { name: "AWS", icon: <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#f4f4f4" /><text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">AWS</text></svg> },
];

export default function IntegrationSection() {
  return (
    <SectionShell id="integrations">
      <SectionHeading
        heading="Works with your existing tools"
        subtitle="Curo integrates with your existing tools, repos, and CI/CD pipeline — no migration required."
        marginBottom="mb-16"
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {tools.map((tool, idx) => (
            <IntegrationTile key={idx} name={tool.name} icon={tool.icon} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#737373]">
            Plus CI/CD pipelines, Docker, Kubernetes, and more.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

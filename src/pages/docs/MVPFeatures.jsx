import { FiPlay, FiServer, FiFileText } from "react-icons/fi";
import PageHeader from "../../components/ui/PageHeader";
import Section from "../../components/ui/Section";

const integrations = [
  { name: "Google Ads", metrics: "Spend, clicks, CTR, conversions, cost/conversion" },
  { name: "Meta Ads", metrics: "Spend, reach, CTR, conversions, cost/conversion" },
  { name: "Email Marketing", metrics: "Open rate, click rate, unsubscribes, sends" },
  { name: "CRM Pipeline", metrics: "New leads, deal stage, deal source, conversions" },
];

const steps = [
  {
    title: "Trigger & Sequential Fetch",
    description: "Runs every Monday morning. Calls APIs in order: Google Ads, Meta Ads, Email, then CRM.",
  },
  {
    title: "Reconcile & Compare",
    description: "Aggregates retrieved metrics and compares them against the prior week's baseline.",
  },
  {
    title: "Generate Explanations",
    description: "Flags anomalies and formulates plain-language explanations of performance changes.",
  },
];

export default function MVPFeatures() {
  return (
    <div className="page-container">
      <PageHeader
        badge="Product Features"
        badgeVariant="green"
        title="MVP Features & Workflow"
        subtitle="The standard operations, integrations, and limits for the MVP version."
      />

      <Section title="Integration Scope" icon={<FiServer />}>
        <p style={{ marginBottom: "var(--sp-4)" }}>
          Market Pulse unifies four essential marketing and sales data sources through dedicated read-only integration tasks:
        </p>
        <div className="grid-2">
          {integrations.map((item) => (
            <div key={item.name} className="integration-card">
              <strong>{item.name}</strong>
              <p>{item.metrics}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step-by-Step Reporting Loop" icon={<FiPlay />}>
        <ol className="step-list">
          {steps.map((step, i) => (
            <li key={step.title} className="step-item">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--sp-1)" }}>
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Read-Only Safeguard" icon={<FiFileText />}>
        <p>
          Market Pulse operates under a strict <strong>read-only</strong> policy. It never writes to databases, changes budgets, updates campaigns, or contacts customers directly. It serves purely as an analytical co-pilot — the marketer maintains final decision-making power.
        </p>
      </Section>
    </div>
  );
}

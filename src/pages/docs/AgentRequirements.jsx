import { FiCode, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import PageHeader from "../../components/ui/PageHeader";
import Section from "../../components/ui/Section";
import DataTable from "../../components/ui/DataTable";
import CodeBlock from "../../components/ui/CodeBlock";
import Callout from "../../components/ui/Callout";
import { SYSTEM_PROMPT } from "../../data/mockReport";

const toolColumns = [
  { key: "name", label: "Tool Name", render: (val) => <code>{val}</code> },
  { key: "action", label: "Action" },
  { key: "api", label: "API Endpoint" },
  { key: "data", label: "Data Returned" },
];

const toolRows = [
  {
    name: "get_google_ads_performance",
    action: "Pulls Google Ads metrics",
    api: "Google Ads API (GET reports)",
    data: "Spend, clicks, CTR, conversions, cost/conversion",
  },
  {
    name: "get_meta_ads_performance",
    action: "Pulls Facebook/Instagram metrics",
    api: "Meta Marketing API (GET insights)",
    data: "Spend, reach, CTR, conversions, cost/conversion",
  },
  {
    name: "get_email_performance",
    action: "Pulls newsletter metrics",
    api: "Mailchimp API (GET reports)",
    data: "Open rate, click rate, unsubscribes, sends",
  },
  {
    name: "get_crm_pipeline_data",
    action: "Pulls CRM deal/pipeline details",
    api: "HubSpot API (GET deals/contacts)",
    data: "New leads, deal stage, deal source, conversions",
  },
];

const evalCases = [
  {
    title: "Case 1: Golden Example (Normal Input)",
    body: "Input: Meta spend drops 30% and Meta conversions drop proportionally. Expected: Report flags Meta conversion drop, attributes it to the spend cut, and shows normal status for others.",
  },
  {
    title: "Case 2: Golden Example (Edge Case)",
    body: "Input: Email open rate drops sharply, but CRM shows lead volume increased. Expected: Flags both trends, acknowledges the conflict, and suggests manual inspection.",
  },
  {
    title: "Case 3: Adversarial Input",
    body: 'Input: CRM API returns no data. Expected: Delivers other channels normally, lists CRM as "Data Unavailable", and refrains from estimating CRM values.',
  },
];

export default function AgentRequirements() {
  return (
    <div className="page-container page-container--wide">
      <PageHeader
        badge="Technical Specifications"
        badgeVariant="red"
        title="Agent Requirements"
        subtitle="Underlying tools, system prompts, blast radius limits, and testing evaluations."
      />

      <Section title="API Integration Tools">
        <DataTable columns={toolColumns} rows={toolRows} getRowKey={(row) => row.name} />
      </Section>

      <Section title="System Prompt v0" icon={<FiCode />}>
        <CodeBlock code={SYSTEM_PROMPT} />
      </Section>

      <Section title="Blast Radius & Failure Safeguards" icon={<FiAlertTriangle />}>
        <p style={{ marginBottom: "var(--sp-4)" }}>
          In the worst-case scenario, the agent could misinterpret data or suffer from tool timeouts. The following safeguards restrict potential issues:
        </p>
        <div className="grid-2">
          <Callout variant="warning" title="Safety Sandbox">
            Since the agent has no write privileges or campaign edit tokens, there is zero risk of unauthorized spends or altered assets.
          </Callout>
          <Callout variant="warning" title="Human-in-the-loop validation">
            The report is generated for review and must be approved by the marketing team before being presented to leadership.
          </Callout>
        </div>
      </Section>

      <Section title="Evaluation Card Cases" icon={<FiCheckCircle />}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {evalCases.map((c) => (
            <Callout key={c.title} variant="info" title={c.title}>
              {c.body}
            </Callout>
          ))}
        </div>
      </Section>
    </div>
  );
}

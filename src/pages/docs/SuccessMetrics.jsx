import { FiCheckSquare } from "react-icons/fi";
import PageHeader from "../../components/ui/PageHeader";
import Section from "../../components/ui/Section";
import DataTable from "../../components/ui/DataTable";

const columns = [
  { key: "goal", label: "Goal" },
  { key: "signal", label: "Signal" },
  { key: "metric", label: "Metric" },
  {
    key: "target",
    label: "Target",
    render: (val, row) => (
      <span className={`badge badge-${row.badgeVariant}`}>{val}</span>
    ),
  },
];

const rows = [
  {
    goal: "Save marketers time on reporting",
    signal: "Marketers stop manually building reports",
    metric: "Hours spent on manual reporting per week",
    target: "< 1 hour by week 4",
    badgeVariant: "green",
  },
  {
    goal: "Faster decisions on campaigns/budget",
    signal: "Marketers act on flagged metrics same day report is delivered",
    metric: "% of flagged metrics reviewed same-day",
    target: "> 70%",
    badgeVariant: "blue",
  },
  {
    goal: "Trustworthy explanations",
    signal: "Explanations match what a marketer would conclude manually",
    metric: 'Accuracy rate of "why it moved" explanation, reviewed weekly',
    target: "> 80%",
    badgeVariant: "purple",
  },
];

export default function SuccessMetrics() {
  return (
    <div className="page-container page-container--wide">
      <PageHeader
        badge="Performance KPIs"
        badgeVariant="blue"
        title="Success Metrics"
        subtitle="How we measure the efficiency and accuracy of Market Pulse."
      />

      <Section title="MVP Success Target Matrix" icon={<FiCheckSquare />}>
        <p style={{ marginBottom: "var(--sp-4)" }}>
          Target KPIs to ensure the platform delivers significant value by Week 4 of deployment.
        </p>
        <DataTable columns={columns} rows={rows} getRowKey={(row) => row.goal} />
      </Section>
    </div>
  );
}

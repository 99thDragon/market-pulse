import { FiAlertCircle, FiTrendingUp, FiUsers } from "react-icons/fi";
import PageHeader from "../../components/ui/PageHeader";
import Section from "../../components/ui/Section";
import Callout from "../../components/ui/Callout";

export default function Home() {
  return (
    <div className="page-container">
      <PageHeader
        badge="Product Overview"
        badgeVariant="blue"
        title="Market Pulse"
        subtitle="AI-powered cross-channel reporting that explains why metrics moved — not just what changed."
      />

      <Section title="The Problem" icon={<FiAlertCircle />}>
        <p>
          Marketers experience a significant weekly time drain manually pulling and reconciling performance data across Google Ads, Meta, email, and CRM. Because there is no unified reporting view, it leads to delayed decisions on campaigns and budget — losing their critical window of relevance.
        </p>
        <Callout variant="quote">
          Marketers spend between 4 to 14+ hours weekly on manual reporting. Dashboards show metrics but do not explain the &ldquo;why&rdquo; behind changes.
        </Callout>
      </Section>

      <Section title="The Opportunity" icon={<FiTrendingUp />}>
        <p>
          Give every marketer an automated weekly cross-channel report with built-in explanations. This recovers hours currently lost to manual reporting each week and speeds up critical budget and campaign decisions.
        </p>
      </Section>

      <Section title="Users & Target Audience" icon={<FiUsers />}>
        <div className="grid-2">
          <div className="info-card">
            <h4>Primary Users</h4>
            <p>
              Marketers managing campaigns across multiple paid ads, social, and email channels who value speed and clarity over exhaustive detail.
            </p>
          </div>
          <div className="info-card">
            <h4>Secondary Users</h4>
            <p>
              Marketing leadership and executives who receive these summaries to make high-level budget and strategy updates without looking at raw data.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

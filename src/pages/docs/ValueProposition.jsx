import { FiPlusCircle, FiActivity, FiShield } from "react-icons/fi";
import PageHeader from "../../components/ui/PageHeader";
import Section from "../../components/ui/Section";

export default function ValueProposition() {
  return (
    <div className="page-container">
      <PageHeader
        badge="Core Proposition"
        badgeVariant="purple"
        title="Value Proposition"
        subtitle="Why we are building Market Pulse and the immediate value it brings."
      />

      <Section title="Core Statement" accent>
        <p>
          Marketers who struggle to spot performance shifts early — because channel data is scattered — use Market Pulse, an AI agent that pulls and unifies this data every week and explains why key metrics moved.
        </p>
      </Section>

      <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--sp-4)" }}>
        Top 3 MVP Value Propositions
      </h2>

      <div className="grid-3">
        <Section>
          <div className="value-card-header">
            <span className="badge badge-green"><FiPlusCircle size={16} aria-hidden="true" /></span>
            <h4>The Vitamin</h4>
          </div>
          <p>
            <strong>Must-have baseline:</strong> Every channel&apos;s performance data — Google Ads, Meta, email, and CRM — pulled and organized in one place, every week, without fail.
          </p>
        </Section>

        <Section>
          <div className="value-card-header">
            <span className="badge badge-blue"><FiShield size={16} aria-hidden="true" /></span>
            <h4>The Painkiller</h4>
          </div>
          <p>
            <strong>Solves core pain:</strong> No more manually logging into multiple dashboards to download and reconcile spreadsheets. Market Pulse automates the pulling and the math.
          </p>
        </Section>

        <Section>
          <div className="value-card-header">
            <span className="badge badge-purple"><FiActivity size={16} aria-hidden="true" /></span>
            <h4>The Steroid</h4>
          </div>
          <p>
            <strong>The magic moment:</strong> Every flagged metric comes with a plain-English explanation — the marketer opens the report already knowing the story.
          </p>
        </Section>
      </div>
    </div>
  );
}

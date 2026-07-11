import { FiCheckSquare } from "react-icons/fi";

export default function SuccessMetrics() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="badge badge-blue">Performance KPIs</span>
        <h1 className="page-title">Success Metrics</h1>
        <p className="page-subtitle">How we measure the efficiency and accuracy of Market Pulse.</p>
      </div>

      <div className="section-card">
        <h3><FiCheckSquare style={{ color: "#2563eb" }} /> MVP Success Target Matrix</h3>
        <p style={{ marginBottom: "20px" }}>
          These are the target KPIs established to ensure the platform delivers significant value by Week 4 of deployment.
        </p>

        <table className="metric-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Signal</th>
              <th>Metric</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Save marketers time on reporting</strong></td>
              <td>Marketers stop manually building reports</td>
              <td>Hours spent on manual reporting per week</td>
              <td><span className="badge badge-green">&lt; 1 hour by week 4</span></td>
            </tr>
            <tr>
              <td><strong>Faster decisions on campaigns/budget</strong></td>
              <td>Marketers act on flagged metrics same day report is delivered</td>
              <td>% of flagged metrics reviewed same-day</td>
              <td><span className="badge badge-blue">&gt; 70%</span></td>
            </tr>
            <tr>
              <td><strong>Trustworthy explanations</strong></td>
              <td>Explanations match what a marketer would conclude manually</td>
              <td>Accuracy rate of "why it moved" explanation, reviewed weekly</td>
              <td><span className="badge badge-purple">&gt; 80%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

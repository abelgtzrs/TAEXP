// pages/admin/AdminDashboard.jsx
import QuantumCard from "../../components/QuantumCard";

function AdminDashboard() {
  return (
    <div className="row g-4">
      <div className="col-md-4">
        <QuantumCard title="TOTAL POSTS" value="162" delta={+5} />
      </div>
      <div className="col-md-4">
        <QuantumCard title="DRAFTS" value="34" delta={-2} />
      </div>
      <div className="col-md-4">
        <QuantumCard title="NEW THIS WEEK" value="12" delta={+8} />
      </div>

      <div className="col-md-6">
        <QuantumCard
          title="POSTING RATE (Last 30 days)"
          chart={<LineChart />}
        />
      </div>
      <div className="col-md-6">
        <QuantumCard title="MOST COMMON TAGS" chart={<BarChart />} />
      </div>
    </div>
  );
}

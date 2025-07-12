// components/QuantumCard.jsx
function QuantumCard({ title, children, value, delta, chart }) {
  return (
    <div className="card quantum-card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-info m-0">{title}</h6>
        {delta && (
          <span className={`text-${delta > 0 ? "success" : "danger"}`}>
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
      <div className="text-white fw-bold fs-4">{value}</div>
      {chart && <div className="chart-placeholder">{chart}</div>}
      {children}
    </div>
  );
}

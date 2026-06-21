export function StatCard({ label, value, note, tone = 'blue', icon = '▣' }) {
  return `
    <article class="stat-card stat-${tone}">
      <div>
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${note}</small>
      </div>
      <i aria-hidden="true">${icon}</i>
    </article>
  `;
}

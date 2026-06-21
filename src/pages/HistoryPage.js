import { getHistoryEntries } from '../data/historyRepository.js';
import { EmptyView } from '../components/LoadingView.js';

export async function HistoryPage() {
  const items = await getHistoryEntries({ limit: 100 });
  return `
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Historia</h1>
          <p>Historia pokazuje zdarzenia zleceń w jednym wspólnym widoku.</p>
        </div>
      </div>
      <section class="panel history-panel">
        ${items.length ? `
          <div class="timeline">
            ${items.map((item) => `
              <article>
                <span class="timeline-dot"></span>
                <div>
                  <strong>#${item.orderId} · ${item.title}</strong>
                  <small>${item.date || formatDate(item.createdAt)} · ${item.author || '-'}</small>
                  <p>${item.text || ''}</p>
                </div>
              </article>
            `).join('')}
          </div>
        ` : EmptyView({ title: 'Brak historii', text: 'Historia pojawi się po synchronizacji zleceń.' })}
      </section>
    </div>
  `;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

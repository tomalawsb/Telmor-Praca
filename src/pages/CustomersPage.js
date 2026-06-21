import { getCustomers } from '../data/customerRepository.js';
import { EmptyView } from '../components/LoadingView.js';

export async function CustomersPage() {
  const customers = await getCustomers({ limit: 100 });
  return `
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Klienci</h1>
          <p>Widok klientów jest zasilany przez repozytorium. Pełna wyszukiwarka będzie w następnym etapie.</p>
        </div>
      </div>
      <section class="panel customer-panel">
        ${customers.length ? `
          <div class="customer-list">
            ${customers.map((customer) => `
              <article class="customer-card">
                <div>
                  <strong>${customer.name}</strong>
                  <p>${customer.address || customer.city || '-'}</p>
                  <small>Ostatnie zlecenie #${customer.lastOrderId || customer.lastOrder || '-'} · ${customer.lastTopic || '-'}</small>
                </div>
                <div class="customer-actions">
                  <a href="tel:${String(customer.phone || '').replaceAll(' ', '')}">☎</a>
                  <span>${customer.ordersCount || 0} zlec.</span>
                </div>
              </article>
            `).join('')}
          </div>
        ` : EmptyView({ title: 'Brak klientów', text: 'Klienci pojawią się po imporcie zleceń albo po wgraniu danych demo lokalnie.' })}
      </section>
    </div>
  `;
}

export const orders = [
  {
    id: '104750',
    number: '104750',
    status: 'Nowe',
    statusTone: 'blue',
    priority: 'Voucher',
    clientName: 'Arkadiusz Mieszkowicz',
    customerName: 'Arkadiusz Mieszkowicz',
    phone: '731 021 410',
    city: 'Mielec',
    location: 'Trzciana (Mielec)',
    address: '39-304 Trzciana, ul. 21A',
    house: '21A / -',
    topic: 'Instalacja / Voucher',
    shortTopic: 'Instalacja / Voucher',
    registeredAt: '04.06.2024, 12:10',
    createdAt: '2024-06-04T12:15:00.000Z',
    modifiedAt: '2024-06-04T12:15:00.000Z',
    updatedAt: '2024-06-07T15:32:00.000Z',
    plannedAt: 'Nie ustawiono',
    doneAt: '07.06.2024, 15:32',
    assignee: 'Tomasz Wolak',
    voucher: '3237572100-531767295',
    hasVoucher: true,
    attachmentCount: 1,
    noteCount: 1,
    isNew: true,
    description: 'Instalacja nowej usługi na podstawie vouchera. Dane demonstracyjne na bazie układu z portalu.',
    history: [
      { id: 'hist-104750-3', date: '07.06.2024, 15:32', title: 'Korespondencja została dodana', author: 'Tomasz Wolak', text: 'Dodano zdjęcie vouchera.', createdAt: '2024-06-07T15:32:00.000Z' },
      { id: 'hist-104750-2', date: '04.06.2024, 12:15', title: 'Zgłoszenie przekazane do realizacji', author: 'System', text: 'Status ustawiony na zlecone.', createdAt: '2024-06-04T12:15:00.000Z' },
      { id: 'hist-104750-1', date: '04.06.2024, 12:10', title: 'Zgłoszenie utworzone', author: 'Marzena Raczyńska', text: 'Utworzono nowe zgłoszenie.', createdAt: '2024-06-04T12:10:00.000Z' }
    ],
    attachments: [
      { id: 'att-104750-1', name: 'IMG_20240607_153130.jpg', size: '4,9 MB', type: 'Voucher' }
    ],
    notes: [
      { id: 'note-104750-1', text: 'Sprawdzić, czy voucher jest czytelny po dodaniu zdjęcia.', createdBy: 'Tomasz Wolak', createdAt: '2024-06-07T15:40:00.000Z' }
    ]
  },
  {
    id: '104749',
    number: '104749',
    status: 'W toku',
    statusTone: 'orange',
    priority: 'Awaria',
    clientName: 'Klient testowy',
    customerName: 'Klient testowy',
    phone: '600 100 200',
    city: 'Mielec',
    location: 'Mielec',
    address: 'Mielec, adres testowy',
    house: '12 / 4',
    topic: 'Internet / Awaria',
    shortTopic: 'Brak sygnału',
    registeredAt: '04.06.2024, 10:02',
    createdAt: '2024-06-04T10:02:00.000Z',
    modifiedAt: '2024-06-04T10:40:00.000Z',
    updatedAt: '2024-06-04T10:40:00.000Z',
    plannedAt: 'Dzisiaj',
    doneAt: '-',
    assignee: 'Tomasz Wolak',
    voucher: '-',
    hasVoucher: false,
    attachmentCount: 0,
    noteCount: 1,
    isNew: false,
    description: 'Zgłoszenie awarii internetu. Wymaga kontaktu z klientem i sprawdzenia instalacji.',
    history: [
      { id: 'hist-104749-2', date: '04.06.2024, 10:40', title: 'Dodano notatkę', author: 'Tomasz Wolak', text: 'Klient prosi o kontakt przed przyjazdem.', createdAt: '2024-06-04T10:40:00.000Z' },
      { id: 'hist-104749-1', date: '04.06.2024, 10:02', title: 'Zgłoszenie utworzone', author: 'System', text: 'Przyjęto zgłoszenie awarii.', createdAt: '2024-06-04T10:02:00.000Z' }
    ],
    attachments: [],
    notes: [
      { id: 'note-104749-1', text: 'Zadzwonić przed wyjazdem. Klient dostępny po 15:00.', createdBy: 'Tomasz Wolak', createdAt: '2024-06-04T10:41:00.000Z' }
    ]
  },
  {
    id: '104748',
    number: '104748',
    status: 'Oczekuje',
    statusTone: 'purple',
    priority: 'Standard',
    clientName: 'Tomasz Wójak',
    customerName: 'Tomasz Wójak',
    phone: '601 222 333',
    city: 'Trzciana',
    location: 'Trzciana',
    address: 'Trzciana, adres testowy',
    house: '8 / -',
    topic: 'Telewizja / Instalacja',
    shortTopic: 'Telewizja / Instalacja',
    registeredAt: '03.06.2024, 16:47',
    createdAt: '2024-06-03T16:47:00.000Z',
    modifiedAt: '2024-06-03T17:10:00.000Z',
    updatedAt: '2024-06-03T17:10:00.000Z',
    plannedAt: 'Nie ustawiono',
    doneAt: '-',
    assignee: 'Tomasz Wolak',
    voucher: '-',
    hasVoucher: false,
    attachmentCount: 0,
    noteCount: 0,
    isNew: false,
    description: 'Instalacja telewizji. Oczekuje na ustalenie terminu.',
    history: [
      { id: 'hist-104748-1', date: '03.06.2024, 17:10', title: 'Status zmieniony', author: 'System', text: 'Status ustawiony na oczekuje.', createdAt: '2024-06-03T17:10:00.000Z' }
    ],
    attachments: [],
    notes: []
  },
  {
    id: '104747',
    number: '104747',
    status: 'Nowe',
    statusTone: 'blue',
    priority: 'Internet',
    clientName: 'Władysław Górna',
    customerName: 'Władysław Górna',
    phone: '602 333 444',
    city: 'Mielec',
    location: 'Wadowice Górne (Mielec)',
    address: 'Wadowice Górne, adres testowy',
    house: '5 / -',
    topic: 'Internet',
    shortTopic: 'Internet',
    registeredAt: '03.06.2024, 09:11',
    createdAt: '2024-06-03T09:11:00.000Z',
    modifiedAt: '2024-06-03T09:11:00.000Z',
    updatedAt: '2024-06-03T09:11:00.000Z',
    plannedAt: 'Nie ustawiono',
    doneAt: '-',
    assignee: 'Tomasz Wolak',
    voucher: 'Do sprawdzenia',
    hasVoucher: false,
    attachmentCount: 0,
    noteCount: 0,
    isNew: true,
    description: 'Nowe zgłoszenie internetowe. Wymaga uzupełnienia danych po kontakcie z klientem.',
    history: [
      { id: 'hist-104747-1', date: '03.06.2024, 09:11', title: 'Zgłoszenie utworzone', author: 'System', text: 'Nowe zgłoszenie internetowe.', createdAt: '2024-06-03T09:11:00.000Z' }
    ],
    attachments: [],
    notes: []
  },
  {
    id: '104746',
    number: '104746',
    status: 'Zamknięte',
    statusTone: 'green',
    priority: 'Standard',
    clientName: 'Chrząst Kow',
    customerName: 'Chrząst Kow',
    phone: '603 444 555',
    city: 'Mielec',
    location: 'Chorzelów',
    address: 'Chorzelów, adres testowy',
    house: '2 / -',
    topic: 'Telewizja kablowa',
    shortTopic: 'Instalacja',
    registeredAt: '01.06.2024, 14:20',
    createdAt: '2024-06-01T14:20:00.000Z',
    modifiedAt: '2024-06-02T11:03:00.000Z',
    updatedAt: '2024-06-02T11:03:00.000Z',
    plannedAt: '02.06.2024',
    doneAt: '02.06.2024, 11:03',
    assignee: 'Tomasz Wolak',
    voucher: '-',
    hasVoucher: false,
    attachmentCount: 2,
    noteCount: 1,
    isNew: false,
    description: 'Zlecenie zamknięte. Dane demonstracyjne.',
    history: [
      { id: 'hist-104746-1', date: '02.06.2024, 11:03', title: 'Zlecenie zamknięte', author: 'Tomasz Wolak', text: 'Usługa wykonana.', createdAt: '2024-06-02T11:03:00.000Z' }
    ],
    attachments: [
      { id: 'att-104746-1', name: 'protokol.pdf', size: '240 KB', type: 'Protokół' },
      { id: 'att-104746-2', name: 'zdjecie.jpg', size: '2,1 MB', type: 'Zdjęcie' }
    ],
    notes: [
      { id: 'note-104746-1', text: 'Zlecenie przykładowe do sprawdzenia widoku zamkniętych usług.', createdBy: 'Tomasz Wolak', createdAt: '2024-06-02T11:05:00.000Z' }
    ]
  },
  {
    id: '104745',
    number: '104745',
    status: 'Zamknięte',
    statusTone: 'green',
    priority: 'Standard',
    clientName: 'Anna Przykład',
    customerName: 'Anna Przykład',
    phone: '604 555 666',
    city: 'Czermin',
    location: 'Czermin',
    address: 'Czermin, adres testowy',
    house: '10 / -',
    topic: 'Internet / Aktywacja',
    shortTopic: 'Aktywacja internetu',
    registeredAt: '29.05.2024, 08:21',
    createdAt: '2024-05-29T08:21:00.000Z',
    modifiedAt: '2024-05-30T16:10:00.000Z',
    updatedAt: '2024-05-30T16:10:00.000Z',
    plannedAt: '30.05.2024',
    doneAt: '30.05.2024, 16:10',
    assignee: 'Tomasz Wolak',
    voucher: '-',
    hasVoucher: false,
    attachmentCount: 1,
    noteCount: 0,
    isNew: false,
    description: 'Drugie zamknięte zlecenie do testowania historii klienta.',
    history: [
      { id: 'hist-104745-1', date: '30.05.2024, 16:10', title: 'Zlecenie zamknięte', author: 'Tomasz Wolak', text: 'Aktywacja zakończona.', createdAt: '2024-05-30T16:10:00.000Z' }
    ],
    attachments: [
      { id: 'att-104745-1', name: 'potwierdzenie.jpg', size: '1,8 MB', type: 'Zdjęcie' }
    ],
    notes: []
  }
];

export const notifications = [
  { id: 'notification-1', tone: 'blue', type: 'order_changed', title: 'Zaktualizowano zlecenie #104750', note: 'Dodano załącznik przez Marzenę R.', body: 'Dodano załącznik przez Marzenę R.', orderId: '104750', createdAt: '2024-06-07T15:33:00.000Z' },
  { id: 'notification-2', tone: 'orange', type: 'message', title: 'Nowa korespondencja do #104749', note: 'Odpowiedź od klienta testowego', body: 'Odpowiedź od klienta testowego', orderId: '104749', createdAt: '2024-06-04T10:45:00.000Z' },
  { id: 'notification-3', tone: 'purple', type: 'status_changed', title: 'Zmieniono status zlecenia #104748', note: 'Status zmieniony na Oczekuje', body: 'Status zmieniony na Oczekuje', orderId: '104748', createdAt: '2024-06-03T17:10:00.000Z' }
];

export function getOrderById(id) {
  return orders.find((order) => order.id === id || order.number === id) || orders[0];
}

export function getOpenOrders() {
  return orders.filter((order) => order.status !== 'Zamknięte');
}

export function getClosedOrders() {
  return orders.filter((order) => order.status === 'Zamknięte');
}

export function getCustomers() {
  const map = new Map();
  orders.forEach((order) => {
    const key = `${order.clientName}-${order.phone}`;
    if (!map.has(key)) {
      map.set(key, {
        id: order.customerId || key.toLowerCase().replaceAll(' ', '-'),
        name: order.clientName,
        phone: order.phone,
        city: order.city,
        address: order.address,
        houseNumber: order.house,
        ordersCount: 1,
        notesCount: order.noteCount || 0,
        lastOrder: order.id,
        lastOrderId: order.id,
        lastTopic: order.topic,
        updatedAt: order.updatedAt
      });
    } else {
      const existing = map.get(key);
      existing.ordersCount += 1;
      existing.notesCount += order.noteCount || 0;
    }
  });
  return [...map.values()];
}

export function getAllHistoryItems() {
  return orders
    .flatMap((order) => (order.history || []).map((entry) => ({
      ...entry,
      orderId: order.id,
      customerName: order.clientName,
      topic: order.topic
    })))
    .sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
}

export function getDemoStats() {
  const openOrders = getOpenOrders();
  const closedOrders = getClosedOrders();
  return {
    all: orders.length,
    open: openOrders.length,
    closed: closedOrders.length,
    new: orders.filter((order) => order.status === 'Nowe').length,
    inProgress: orders.filter((order) => order.status === 'W toku').length,
    waiting: orders.filter((order) => order.status === 'Oczekuje').length,
    withVoucher: orders.filter((order) => order.hasVoucher).length,
    needsVoucherCheck: orders.filter((order) => !order.hasVoucher && String(order.voucher || '').toLowerCase().includes('sprawdzenia')).length,
    attachments: orders.reduce((sum, order) => sum + Number(order.attachmentCount || 0), 0)
  };
}

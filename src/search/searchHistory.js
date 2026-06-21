import { getHistoryEntries } from '../data/historyRepository.js';
import { prepareQuery, rankRecord, sortRankedResults } from './searchUtils.js';

const HISTORY_FIELD_WEIGHTS = {
  orderId: 10,
  customerName: 8,
  title: 7,
  text: 8,
  author: 5,
  topic: 5,
  attachmentName: 5
};

export async function searchHistory(query, { limit = 50 } = {}) {
  const prepared = prepareQuery(query);
  const history = await getHistoryEntries({ limit: 300 });

  if (!prepared.raw) return history.slice(0, limit).map((item) => ({ ...item, score: 0, reasons: [] }));

  return sortRankedResults(history.map((item) => {
    const ranking = rankRecord(item, prepared, HISTORY_FIELD_WEIGHTS);
    return { ...item, ...ranking };
  })).slice(0, limit);
}

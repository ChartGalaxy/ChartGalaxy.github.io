export const repositoryIds = ['ChartGalaxy/ChartGalaxy', 'dad887/DAD', 'InfoDet/InfoDet', 'Jietson/InfoChartQA'];
export function validateSnapshot(snapshot) {
  if (!snapshot || !Number.isFinite(Date.parse(snapshot.fetchedAt)) || !Array.isArray(snapshot.repositories)) throw new Error('Invalid snapshot');
  if (snapshot.repositories.length !== repositoryIds.length) throw new Error('Incomplete repository set');
  for (const id of repositoryIds) {
    const matches = snapshot.repositories.filter(r => r.id === id);
    if (matches.length !== 1 || !['downloads', 'downloadsAllTime'].every(k => Number.isSafeInteger(matches[0][k]) && matches[0][k] >= 0)) throw new Error(`Invalid counts for ${id}`);
  }
  return snapshot;
}
export function totalDownloads(snapshot, period = 'downloadsAllTime') {
  validateSnapshot(snapshot);
  if (!['downloads', 'downloadsAllTime'].includes(period)) throw new Error('Invalid period');
  return snapshot.repositories.reduce((sum, r) => sum + r[period], 0);
}

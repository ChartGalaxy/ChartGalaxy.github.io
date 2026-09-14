import { writeFile, rename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as wait } from 'node:timers/promises';
import { repositoryIds, validateSnapshot } from '../stats.js';

export async function refreshSnapshot(output, { fetchImpl = fetch, sleep = wait } = {}) {
  const repositories = await Promise.all(repositoryIds.map(async id => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetchImpl(`https://huggingface.co/api/datasets/${id}?expand[]=downloads&expand[]=downloadsAllTime`, { signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!['downloads', 'downloadsAllTime'].every(key => Number.isSafeInteger(data[key]) && data[key] >= 0)) throw new Error('Invalid download counts');
        return { id, downloads: data.downloads, downloadsAllTime: data.downloadsAllTime };
      } catch (error) {
        if (attempt === 2) throw new Error(`${id}: ${error.message}`);
        await sleep(2000 * (attempt + 1));
      }
    }
  }));
  const snapshot = validateSnapshot({ fetchedAt: new Date().toISOString(), source: 'Hugging Face public API', repositories });
  const temporary = `${output}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(snapshot, null, 2) + '\n');
    await rename(temporary, output);
  } finally {
    await rm(temporary, { force: true });
  }
  return snapshot;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const snapshot = await refreshSnapshot(process.argv[2] || 'public/data/downloads.json');
  console.log('Updated all four repositories atomically:', snapshot.fetchedAt);
}

import { readFile } from 'fs/promises';

const NTAS_BASE_URL = 'https://ntas.ttc.ca/api/ntas/get-next-train-time';

export async function getNextTrains(stationInput) {
  const raw = await readFile('./data/stations.json', 'utf-8');
  const stationsData = JSON.parse(raw);

  const lookupMap = {};
  for (const [name, codes] of Object.entries(stationsData)) {
    lookupMap[name.toLowerCase()] = codes;
  }

  let key = stationInput.trim().toLowerCase();
  if (!key.endsWith('station')) key += ' station';

  const stopCodes = lookupMap[key];
  if (!stopCodes) {
    return `No station found matching "${stationInput}"`;
  }

  const lines = [];
  for (const stopCode of stopCodes) {
    const response = await fetch(`${NTAS_BASE_URL}/${stopCode}`);
    const results = await response.json();
    for (const result of results) {
      lines.push(`Line ${result.line} ${result.directionText}: ${result.nextTrains} min`);
    }
  }
  return lines.join('\n');
}

const stationInput = process.argv[2];
if (stationInput) {
  getNextTrains(stationInput).then(console.log);
}
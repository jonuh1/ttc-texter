import { readFile } from 'fs/promises';

const NTAS_BASE_URL = 'https://ntas.ttc.ca/api/ntas/get-next-train-time';

async function lookup(stationInput) {

    //Load and parse station data
    const raw = await readFile('stations.json', 'utf-8');
    const stationsData = JSON.parse(raw);

    //Build a case-insensitive lookup map once, so "runnymede" matches "Runnymede Station"
    const lookupMap = {};
    
    for (const [name, codes] of Object.entries(stationsData)) {

        lookupMap[name.toLowerCase()] = codes;

    }

    // Normalize the user's input: lowercase it, and add " station" if they didn't type it
    let key = stationInput.trim().toLowerCase();
    if (!key.endsWith('station')) {

        key = key + ' station';

    }

    const stopCodes = lookupMap[key];
    if (!stopCodes) {

        console.log(`No station found matching "${stationInput}"`);
        return;

    }

    console.log(`${stationInput} — ${stopCodes.length} platform(s)`);

    for (const stopCode of stopCodes) {

        const response = await fetch(`${NTAS_BASE_URL}/${stopCode}`);
        const results = await response.json(); // this is an array, e.g. [{...}]

    for (const result of results) {

      console.log(`Line ${result.line} ${result.directionText}: ${result.nextTrains} min`);

    }
  }

}

const stationInput = process.argv[2];
if (!stationInput) {
  console.log('Usage: node lookup.js "station name"');
  process.exit(1);
}

lookup(stationInput);
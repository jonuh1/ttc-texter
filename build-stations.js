import { writeFile } from "fs/promises";

const SOURCE_URL = 'https://www.ttc.ca/ttcapi/routedetail//getallroutesandstops';
const SUBWAY_ROUTE_NUMS = new Set(['1', '2', '4']);

async function buildStations() {

    const response = await fetch(SOURCE_URL);
    const routes = await response.json(); //top level array of route objects


    const stationsByName = {}; //"Station Name" => set of stopCodes

    for (const route of routes) {

        if (!SUBWAY_ROUTE_NUMS.has(route.routeNum)) continue;

        for (const direction of route.stops) {

            for (const stop of direction.stopList) {

                if (!stationsByName[stop.stopName]) {

                    stationsByName[stop.stopName] = new Set();

                }

                stationsByName[stop.stopName].add(stop.stopCode);  

            }
            
        }

    }

    //Converts Sets to arrays for JSON serialization
    const output = {};

    for (const [name,codes] of Object.entries(stationsByName)) {

        output[name] = [...codes];

    }

    await writeFile('stations.json', JSON.stringify(output, null, 2));
    console.log(`Wrote ${Object.keys(output).length} stations to stations.json`)

}

buildStations();
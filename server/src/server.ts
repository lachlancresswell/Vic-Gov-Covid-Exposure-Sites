import * as Papa from 'papaparse';
import fetch from 'node-fetch';
import request from 'request';
import * as https from 'https';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import ExposureSiteInfo from './Types/ExposureSiteInterface';
import GeocodeInterface from './Types/GeocodeInterface';
import VicDataInterface from './Types/VicDataInterface'

const envConfig = dotenv.config({ path: `${__dirname}/../../.env` });
if (envConfig.error) {
  throw envConfig.error;
}

const DATA_VIC_EXPOSURE_DATASET_ID = '79bcf53d-79eb-443c-b858-6b87bdc8c694';
const DATA_VIC_URL = `https://wovg-community.gateway.prod.api.vic.gov.au/datavic/opendata/v1.1/datasets/${DATA_VIC_EXPOSURE_DATASET_ID}`;

const DATA_VIC_HEADER = {
  'Content-Type': 'application/json',
  Accept: "application/json",
  apikey: process.env.DATA_VIC_API_KEY as string,
};

/**
 * Get lat + long from a given address
 * @param address Address string to find lat + long of
 * @returns Object containing lat + long
 */
const getGeocodeLatLong = (address: string): Promise<{ longitude: number, latitude: number } | Error> => new Promise((resolve, reject) => {
  const options = {
    hostname: 'maps.googleapis.com',
    port: 443,
    path: `/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API_KEY}`,
    method: 'GET',
  };

  const req = https.request(options, (response) => {
    let data = '';
    let sdata: GeocodeInterface;

    response.on('data', (chunk: string) => {
      data += chunk;
    });

    response.on('end', () => {
      sdata = JSON.parse(data);
      resolve({
        latitude: sdata.results[0].geometry.viewport.northeast.lat,
        longitude: sdata.results[0].geometry.viewport.northeast.lng,
      });
    });
  });
  req.on('error', (e) => {
    reject(e);
  });
  req.end();
});

/**
 * Adds lat + long data to existing site info + saves to disk
 * @param siteCsvData JSON site info
 */
const parseSiteCsv = async (siteCsvData: [ExposureSiteInfo]): Promise<any> => {
  const processed = [];
  for (let i = 0; i < 3; i += 1) {
    const address = encodeURI(`${siteCsvData[i].Site_streetaddress.replace(' ', '+')}+${siteCsvData[i].Suburb}+${siteCsvData[i].Site_state}`);

    const latLong = await getGeocodeLatLong(address);
    if (!(latLong instanceof Error)) {
      siteCsvData[i].latitude = latLong.latitude;
      siteCsvData[i].longitude = latLong.longitude;
      processed.push(siteCsvData[i]);
    } else {
      throw (latLong);
    }
  }

  const dataJson = JSON.stringify(processed);
  fs.writeFileSync('./client/sites.json', dataJson);
};

// Fetch exposure site .csv url from api.vic.gov.au and then fetch actual file
fetch(DATA_VIC_URL, { method: 'GET', headers: DATA_VIC_HEADER }).then((response: { json: () => Promise<VicDataInterface> }) => {
  response.json().then((vicDataResponse: VicDataInterface) => {
    const csvUrl = vicDataResponse._embedded.resources[0]._links[1].href;
    const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, { header: true });

    const dataStream = request
      .get(csvUrl)
      .pipe(parseStream);

    const csvData: any = [];
    parseStream.on('data', (d) => csvData.push(d));
    dataStream.on('finish', () => parseSiteCsv(csvData));
  });
});

import * as Papa from 'papaparse';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ExposureSiteInfo, VicDataSiteInfo } from './Types/ExposureSiteInterface';
import GeocodeInterface from './Types/GeocodeInterface';
import { VicDataResponse } from './Types/VicDataInterface'
import axios from 'axios';

const envConfig = dotenv.config({ path: `${__dirname}/../../../.env` });
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
 * Adds lat + long data to existing site info + saves to disk
 * @param siteCsvData JSON site info
 */
export const parseSiteCsv = (siteCsvData: [VicDataSiteInfo]): Promise<ExposureSiteInfo[]> => new Promise(async (resolve, reject) => {

  let processed: ExposureSiteInfo[] = [];
  for (let i = 0; process.env.SITE_LIMIT && i < Math.min(parseInt(process.env.SITE_LIMIT), siteCsvData.length); i += 1) {
    const address = encodeURI(`${siteCsvData[i].Site_streetaddress.replace(' ', '+')}+${siteCsvData[i].Suburb}+${siteCsvData[i].Site_state}`);

    let latLng: { lat: number, lng: number };
    try {

      const req: { data: GeocodeInterface } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API_KEY}`)
      latLng = req.data.results[0].geometry.viewport.northeast;

      processed.push(siteCsvData[i] as ExposureSiteInfo);
      processed[processed.length - 1].latitude = latLng.lat;
      processed[processed.length - 1].longitude = latLng.lng;

    } catch {
      console.log("Failed to geocode " + address)
    }
  }

  resolve(processed);
})


// Fetch exposure site .csv url from api.vic.gov.au and then fetch actual file
export const fetchSiteInfo = (path: string = './sites.json'): Promise<{ status: number, path: string } | Error> => new Promise(async (resolve, reject) => {

  let csvUrl: string;
  try {

    const response: { data: VicDataResponse } = await axios.get(DATA_VIC_URL, { headers: DATA_VIC_HEADER });
    const vicDataResponse = response.data
    csvUrl = vicDataResponse._embedded.resources[0]._links[1].href;
  } catch (err) {
    return reject(new Error('Could not get site csv - ' + err))
  }
  const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, { header: true });

  try {
    const csvRequest = await axios.get(csvUrl, { responseType: 'stream' })
    csvRequest.data.pipe(parseStream);
  } catch (err) {
    reject('Could not retrieve initial site data - ' + err)
  }


  const csvData: any = [];
  parseStream.on('data', (d) => csvData.push(d));
  parseStream.on('finish', async () => {
    const siteInfo = await parseSiteCsv(csvData)
    if (siteInfo.length) {
      fs.writeFileSync(path, JSON.stringify(siteInfo));
      resolve({ status: 1, path })
    }
    else reject(new Error('Could not geocode any sites.'));
  });

})

fetchSiteInfo();

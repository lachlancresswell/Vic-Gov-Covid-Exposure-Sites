import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as fs from 'fs'
import * as Server from '../server';
import { mockGecodeInterface } from '../Types/GeocodeInterface';
import { ExposureSiteInfo, VicDataSiteInfo, mockExposureSiteInfo, mockVicDataSiteInfo } from '../Types/ExposureSiteInterface';

const PASS_LAT = 1.0;
const PASS_LNG = 1.0;

const FILE_PATH = './test-sites.json';

describe('parseSiteCsv', () => {

  let mockedAxios: jest.Mocked<typeof axios>;
  let mockAxiosGet: jest.SpyInstance<Promise<unknown>>;

  afterAll(() => {
    mockAxiosGet.mockRestore();
  })

  it('Succesfully geocodes', async () => {
    const mockedResponse: AxiosResponse = {
      data: mockGecodeInterface(PASS_LAT, PASS_LNG),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockAxiosGet = jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    expect(axios.get).not.toHaveBeenCalled();
    const data = await Server.parseSiteCsv([mockVicDataSiteInfo()]);
    expect(axios.get).toHaveBeenCalled();
    expect(data.length).toBe(1);
    expect(data[0].latitude).toBe(PASS_LAT)
    expect(data[0].longitude).toBe(PASS_LNG)

  });

  it('Fails to geocode', async () => {
    const errorMessage = 'Network Error';


    mockAxiosGet = jest.spyOn(axios, 'get').mockImplementationOnce((url: string, config?: AxiosRequestConfig | undefined) => {
      throw new Error(errorMessage)
    })

    const data = await Server.parseSiteCsv([mockVicDataSiteInfo()]);
    expect(data.length).toBe(0);
  });
});

describe('fetchSiteInfo', () => {

  let mockParseSiteCsv: jest.SpyInstance<Promise<ExposureSiteInfo[]>>;

  beforeAll(() => {
    mockParseSiteCsv = jest.spyOn(Server, 'parseSiteCsv').mockImplementation((siteCsvData: [VicDataSiteInfo]): Promise<ExposureSiteInfo[]> => new Promise(async (resolve) => {
      resolve([mockExposureSiteInfo()]);
    }))
  })

  afterAll(() => {
    mockParseSiteCsv.mockRestore();
  })

  it('Succesfully saves data', async () => {
    if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH)

    expect(fs.existsSync(FILE_PATH)).toBeFalsy();
    expect(Server.parseSiteCsv).not.toHaveBeenCalled();
    expect(await Server.fetchSiteInfo(FILE_PATH)).not.toBe(typeof Error)
    expect(mockParseSiteCsv).toHaveBeenCalledTimes(1);
    expect(fs.existsSync(FILE_PATH)).toBeTruthy();
  })
})

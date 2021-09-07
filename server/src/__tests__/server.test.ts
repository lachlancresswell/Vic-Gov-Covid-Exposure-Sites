import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as fs from 'fs'
import * as Server from '../server';
import { mockGecodeInterface } from '../Types/GeocodeInterface';
import { ExposureSiteInfo, VicDataSiteInfo, mockExposureSiteInfo, mockVicDataSiteInfo } from '../Types/ExposureSiteInterface';

const PASS_LAT = 1.0;
const PASS_LNG = 1.0;
const FILE_PATH = './test-sites.json';

jest.setTimeout(8000);

describe('parseSiteCsv', () => {

  let mockAxiosGet: jest.SpyInstance<Promise<unknown>>;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  })

  afterAll(() => {
    mockAxiosGet.mockRestore();
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Succesfully geocodes', async () => {
    const mockedResponse: AxiosResponse = {
      data: mockGecodeInterface(PASS_LAT, PASS_LNG),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    mockAxiosGet = jest.spyOn(axios, 'get').mockImplementation((url: string, config?: AxiosRequestConfig | undefined): Promise<any> => new Promise((resolve, reject) => {
      resolve(mockedResponse)
    }))

    expect(axios.get).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    const data = await Server.parseSiteCsv(mockVicDataSiteInfo());
    expect(axios.get).toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(data.length).toBe(mockVicDataSiteInfo().length);
    expect(data[0].latitude).toBe(PASS_LAT)
    expect(data[0].longitude).toBe(PASS_LNG)

  });

  it('Fails to geocode', async () => {
    const errorMessage = 'Network Error';


    mockAxiosGet = jest.spyOn(axios, 'get').mockImplementation((url: string, config?: AxiosRequestConfig | undefined) => {
      throw new Error(errorMessage)
    })

    const data = await Server.parseSiteCsv(mockVicDataSiteInfo());
    expect(console.warn).toHaveBeenCalledTimes(mockVicDataSiteInfo().length)
    expect(data.length).toBe(0);
  });
});

describe('fetchSiteInfo', () => {

  let mockParseSiteCsv: jest.SpyInstance<Promise<ExposureSiteInfo[]>>;

  beforeAll(() => {
    mockParseSiteCsv = jest.spyOn(Server, 'parseSiteCsv').mockImplementation((siteCsvData: VicDataSiteInfo[]): Promise<ExposureSiteInfo[]> => new Promise(async (resolve) => {
      resolve(mockExposureSiteInfo());
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

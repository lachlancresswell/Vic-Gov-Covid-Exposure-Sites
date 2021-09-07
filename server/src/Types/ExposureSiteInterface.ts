export interface VicDataSiteInfo {
    Suburb: string;
    Site_title: string;
    Site_streetaddress: string;
    Site_state: string;
    Site_postcode: string;
    Exposure_date_dtm: string;
    Exposure_date: string;
    Exposure_time: string;
    Notes: string;
    Added_date_dtm: string;
    Added_date: string;
    Added_time: string;
    Advice_title: string;
    Advice_instruction: string;
    Exposure_time_start_24: string;
    Exposure_time_end_24: string;
}

export interface ExposureSiteInfo extends VicDataSiteInfo {
    latitude: number;
    longitude: number;
}

export const mockVicDataSiteInfo = (): VicDataSiteInfo[] => ([{
    Suburb: "string",
    Site_title: "string",
    Site_streetaddress: "string",
    Site_state: "string",
    Site_postcode: "string",
    Exposure_date_dtm: "string",
    Exposure_date: "string",
    Exposure_time: "string",
    Notes: "string",
    Added_date_dtm: "string",
    Added_date: "string",
    Added_time: "string",
    Advice_title: "string",
    Advice_instruction: "string",
    Exposure_time_start_24: "string",
    Exposure_time_end_24: "string",
},
{
    Added_date: '06/09/2021',
    Added_date_dtm: '2021-09-06',
    Added_time: '15:32:00',
    Advice_instruction: 'Anyone who has visited this location during these times must get tested immediately and quarantine for 14 days from the exposure.',
    Advice_title: 'Tier 1 - Get tested immediately and quarantine for 14 days from exposure',
    Exposure_date: '02/09/2021',
    Exposure_date_dtm: '2021-09-02',
    Exposure_time: '11:00am - 1:00pm',
    Exposure_time_end_24: '13:00:00',
    Exposure_time_start_24: '11:00:00',
    Notes: 'Case attended venue',
    Site_postcode: '3070',
    Site_state: 'VIC',
    Site_streetaddress: '222 High Street',
    Site_title: 'Francesca\'s Bar',
    Suburb: 'Northcote',
}
])

export const mockExposureSiteInfo = (): ExposureSiteInfo[] => {
    let obj: ExposureSiteInfo[] = <ExposureSiteInfo[]>mockVicDataSiteInfo();
    for (let i = 0; i < obj.length; i++) {
        obj[i].latitude = 1.0;
        obj[i].longitude = 2.0;
    }
    return obj;
}
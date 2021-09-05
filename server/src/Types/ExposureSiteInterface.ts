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

export const mockVicDataSiteInfo = (): VicDataSiteInfo => ({
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
})

export const mockExposureSiteInfo = (): ExposureSiteInfo => {
    let obj: any = mockVicDataSiteInfo();
    obj = obj as ExposureSiteInfo;
    obj.latitude = 1.0;
    obj.longitude = 2.0;

    return obj;
}
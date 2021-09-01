interface Meta {
    processing_time: number;
}

interface Link {
    rel: string;
    href: string;
}

interface Link2 {
    rel: string;
    href: string;
}

interface Resource {
    name: string;
    format: string;
    id: string;
    description: string;
    date_created: Date;
    _links: Link2[];
}

interface Embedded {
    count: number;
    resources: Resource[];
}

export default interface VicDataResponse {
    _meta: Meta;
    _links: Link[];
    name: string;
    license_title: string;
    id: string;
    metadata_created: Date;
    metadata_modified: Date;
    title: string;
    tags: string[];
    _embedded: Embedded;
}

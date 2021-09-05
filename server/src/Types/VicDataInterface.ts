interface Meta {
    processing_time: number;
}

interface Link {
    rel: string;
    href: string;
}

interface Resource {
    name: string;
    format: string;
    id: string;
    description: string;
    date_created: Date;
    _links: Link[];
}

interface Embedded {
    count: number;
    resources: Resource[];
}

export interface VicDataResponse {
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

const mockMeta = (): Meta => ({
    processing_time: 1
})

const mockLink = (): Link => ({
    rel: "string",
    href: "",
})

const mockResource = (): Resource => ({
    name: "string",
    format: "string",
    id: "string",
    description: "string",
    date_created: new Date(),
    _links: [
        mockLink()
    ],
});

const mockEmbedded = (): Embedded => ({
    count: 1,
    resources: [
        mockResource()
    ]
})

export const mockVicDataResponse = (): VicDataResponse => ({
    _meta: mockMeta(),
    _links: [
        mockLink()
    ],
    name: "string",
    license_title: "string",
    id: "string",
    metadata_created: new Date(),
    metadata_modified: new Date(),
    title: "string",
    tags: [
        "string",
    ],
    _embedded: mockEmbedded(),
})
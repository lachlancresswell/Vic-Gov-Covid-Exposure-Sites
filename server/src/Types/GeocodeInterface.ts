
interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface Northeast {
    lat: number;
    lng: number;
}

interface Southwest {
    lat: number;
    lng: number;
}

interface Bounds {
    northeast: Northeast;
    southwest: Southwest;
}

interface Location {
    lat: number;
    lng: number;
}

interface Northeast2 {
    lat: number;
    lng: number;
}

interface Southwest2 {
    lat: number;
    lng: number;
}

interface Viewport {
    northeast: Northeast2;
    southwest: Southwest2;
}

interface Geometry {
    bounds: Bounds;
    location: Location;
    location_type: string;
    viewport: Viewport;
}

interface Result {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    types: string[];
}

export default interface GeocodeInterface {
    results: Result[];
    status: string;
}


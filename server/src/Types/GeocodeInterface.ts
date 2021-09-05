
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: LatLng;
  southwest: LatLng;
}

interface Geometry {
  bounds: Viewport;
  location: LatLng;
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

const emptyLatLng = (lat: number, lng: number): LatLng => ({
  lat,
  lng
})

const emptyViewport = (lat: number, lng: number): Viewport => ({
  northeast: emptyLatLng(lat, lng),
  southwest: emptyLatLng(lat, lng)
})

export const mockGecodeInterface = (lat: number, lng: number): GeocodeInterface => ({
  results: [
    {
      geometry: {
        bounds: emptyViewport(lat, lng),
        location: emptyLatLng(lat, lng),
        location_type: "location_type",
        viewport: emptyViewport(lat, lng)
      },
      address_components: [
        {
          long_name: "long_name",
          short_name: "short_name",
          types: [
            "type 1",
            "type 2"
          ]
        }
      ],
      formatted_address: "formatted_address",
      place_id: "place_id",
      types: [
        "type 1",
        "type 2"
      ]
    }
  ],
  status: ""
});
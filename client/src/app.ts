import ExposureSiteInfo from "@backend/Types/ExposureSiteInterface"
import keys from './keys'

const SITE_PATH = '../../sites.json';

const addMarkers = (json: [ExposureSiteInfo]): void => {
  const melbourne = { lat: -37.8136, lng: 144.9631 };
  // The map, centered at Uluru
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: melbourne,
    }
  );
  console.log(json)

  for (var i = 0; i < json.length; i += 1) {
    const site = json[i]
    // The marker, positioned at Uluru
    console.log(site)
    const marker = new google.maps.Marker({
      position: { lat: site.latitude, lng: site.longitude },
      title: site.Site_title,
      map: map,
    });

    const infowindow = new google.maps.InfoWindow({
      content:
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        `<h1 id="firstHeading" class="firstHeading">${site.Site_title}</h1>` +
        `<h2>${site.Site_streetaddress + ", " + site.Suburb}</h2>` +
        '<div id="bodyContent">' +
        "<p><ul>" +
        `<li>${site.Exposure_date} @ ${site.Exposure_time}</li>` +
        `<li>${site.Notes}</li>` +
        "<ul></p>" +
        "</div>" +
        "</div>",
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }
}

// Initialize and add the map
const initMap = (): void => {
  const melbourne = { lat: -37.8136, lng: 144.9631 };
  new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: melbourne,
    }
  );
}

const loadJSON = (path: string, callback: any) => {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
}

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${keys}&callback=initMap&libraries=&v=weekly`;
script.async = true;
document.body.appendChild(script);
script.addEventListener("load", () => {
  loadJSON(SITE_PATH, addMarkers);
});


// Define as global
(window as any).initMap = initMap;

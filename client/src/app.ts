import { ExposureSiteInfo } from "@backend/Types/ExposureSiteInterface"
import keys from './keys'

const SITE_PATH = '../../sites.json';

let map: google.maps.Map;
let siteJson: [ExposureSiteInfo];
let markers: google.maps.Marker[] = [];
let curInfoWindw: google.maps.InfoWindow;

const updateMarkers = (json: [ExposureSiteInfo]): void => {
  const startDate = new Date(startDateElement.value);
  const endDate = new Date(endDateElement.value);

  markers.forEach((marker) => {
    marker.setMap(null)
  })
  markers = [];
  json.forEach((site: ExposureSiteInfo) => {

    const dateStr = site.Exposure_date.split("/");
    var exposureDate = new Date(parseInt(dateStr[2]), parseInt(dateStr[1]) - 1, parseInt(dateStr[0]), 10);

    if (startDate.getTime() <= exposureDate.getTime() && endDate.getTime() >= exposureDate.getTime()) {
      let icon;
      if (site.Advice_title.includes('Tier 1')) icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      else if (site.Advice_title.includes('Tier 2')) icon = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      else icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'

      const marker = new google.maps.Marker({
        position: { lat: site.latitude, lng: site.longitude },
        title: site.Site_title,
        map: map,
        icon
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
        if (curInfoWindw) curInfoWindw.close();
        curInfoWindw = infowindow;

        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });

      markers.push(marker)

    }
  })
}

const loadJSON = (path: string, callback: any) => {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true);
  xobj.send(null);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      siteJson = JSON.parse(xobj.responseText);
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.onerror = function () { // only triggers if the request couldn't be made at all
    alert(`Network Error`);
  };
}

// Define as global
(window as any).initMap = (): void => {
  const melbourne = { lat: -37.8136, lng: 144.9631 };
  map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: melbourne,
    }
  );

  loadJSON(SITE_PATH, updateMarkers);
};


const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${keys}&callback=initMap&libraries=&v=weekly`;
script.async = true;
document.body.appendChild(script);

const startDateElement = (document.getElementById('startDate') as HTMLInputElement);
const endDateElement = (document.getElementById('endDate') as HTMLInputElement);

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const minDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  (today.getDate() - 14)
)
const minDateStr = minDate.toISOString().split('T')[0];
startDateElement.max = todayStr
startDateElement.value = minDateStr;
endDateElement.max = todayStr;
endDateElement.value = todayStr;

startDateElement.addEventListener('change', (event) => {
  updateMarkers(siteJson)
});

endDateElement.addEventListener('change', (e) => {
  updateMarkers(siteJson)
});

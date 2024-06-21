// Import Leaflet's CSS
import 'leaflet/dist/leaflet.css';
// Import Leaflet
import L from 'leaflet';
import proj from 'proj4';
import 'proj4leaflet'; // eslint-disable-line import/no-unassigned-import
// Import Our CSS
import './map-preview.css';
import * as MapUtils from './map-utils.js';

/**
 * Render a 'Sett' object, which contains an ID, Grid Reference and
 * number of Entrances into some HTML for the LeafletJS Marker popup.
 * @param {object} sett A Sett.
 * @param {string} sett.id The ID of the Sett.
 * @param {string} sett.gridReference The Grid Reference of the Sett.
 * @param {string} sett.entrances The number of Entrances to the Sett.
 * @returns {string} A string of HTML for LeafletJS' marker popup.
 */
const renderSettPopup = (sett) => {
  return `
  <dl>
    <div>
      <dt class="govuk-heading-s">Sett</dt>
      <dd class="govuk-body-s">${sett.id}</dd>
    </div>
    <div>
      <dt class="govuk-heading-s">Grid Reference</dt>
      <dd class="govuk-body-s">${sett.gridReference}</dd>
    </div>
    <div>
      <dt class="govuk-heading-s">Entrances</dt>
      <dd class="govuk-body-s">${sett.entrances}</dd>
    </div>
  </dl>
    `;
};

// Define a new named proj4js projection.
proj.defs('EPSG:27700', MapUtils.osProjString);

// Retrieve a copy of our OS projection.
const eastNorthProj = proj('EPSG:27700');

// Retrieve a copy of proj4js' WGS84 projection.
const lngLatProj = proj('EPSG:4326');

// Define a new marker icon. This PNG icon is based on the NatureScot colours,
// so it's more consistent with the page design than the LeafletJS default one.
// I've inlined the png here for ease of distribution and because this PNG is
// nice and small.
const naturescotIcon = L.icon({
  iconUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAABHUlEQVRYw71WywkDIRCdQmzEQrymB+sI7DU9GEgFgdz2nFsKsIUQyMloWIIsRmfUmQfDsq47j/npA2jgcLyZaC6ajxYy89u6gV7En23B8T9L+yzFuSI4L5EpTGp6CXIiwxEBLqKJBD+iUpEDg1lyFKfLPZyvj++TFM1W7Orm5Pj5eocc6T2tI4gMbANVJagBQeSaqdpHsEf63kxZqwYYtGoEI6nCpkwsEpGaiHQX/5yITLzY2SVyCovdJ9jDEmmmdQW7QQKHERJ6kERjFcvaSbBSZJFhqcUEYeF7FWT/4BGUJIVE9erhBUmwjIhuxRoFoZ1XGAViODXMQKWdPcxCpZ0tzERRhcxGoZ0XDhI1tW0Rd40DLmTtrIETPbX4AOxTDkP3T13KAAAAAElFTkSuQmCC',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -31],
});

/**
 * Create the LeafletJS map and bind it to the supplied element.
 * @param {string | HTMLElement} element ID of the map HTML-Element as string or
 * the map HTML-ELement itself.
 * @returns {L.Map} The LeafletJS map.
 */
const buildAndBindMap = (element) => {
  const osCRS = new L.Proj.CRS('EPSG:27700', MapUtils.osProjString, {
    resolutions: [1000, 500, 200, 100, 50, 25, 10, 5, 2.5, 1.25],
  });

  const natureScotOsTiles = L.tileLayer.wms(
    'https://map.publicsectormapping.gov.scot/osmao-snh00-00004-19b94/service',
    {
      layers: 'viaEuropa_m0102',
      format: 'image/png',
      maxZoom: 11,
      minZoom: 0,
      continuousWorld: true,
      transparent: true,
      version: '1.3.0',
      attribution: `Contains OS data &copy; Crown copyright and database rights [${new Date().getFullYear()}]`,
    },
  );

  const map = new L.map(element, {
    crs: osCRS,
    continuousWorld: true,
    worldCopyJump: false,
    minZoom: 0,
    maxZoom: 9,
    layers: [natureScotOsTiles],
    gestureHandling: false,
    loadingControl: false,
    zoomControl: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragging: false,
    scrollWheelZoom: false,
  });

  return map;
};

/**
 * Do everything required to display the map.
 * @param {string | HTMLElement} mapElement ID of the map HTML-Element as string
 * or the map HTML-ELement itself.
 * @param {string | HTMLElement} overlayElement ID of the overlay HTML-Element
 * as string or the overlay HTML-ELement itself.
 * @param {object[]} setts An array of Setts.
 * @param {string} setts[].id The ID of each Sett.
 * @param {string} setts[].gridReference The Grid Reference of each Sett.
 * @param {string} setts[].entrances The number of Entrances to each Sett.
 */
window.initMapPreview = (mapElement, overlayElement, setts) => {
  const map = buildAndBindMap(mapElement);

  map.setView([57.450_86, -3.905_76], 2);

  if (setts !== undefined) {
    // Loop over all the Setts.
    const markers = setts.map((sett) => {
      // Convert the supplied grid ref to an easting and a northing.
      const eastNorth = MapUtils.gridRefToEastNorth(sett.gridReference);

      // Transform the easting and northing in to a longitude and a latitude.
      const lngLat = proj(eastNorthProj, lngLatProj, eastNorth);

      // Create a new LeafletJS marker
      const marker = L.marker([lngLat[1], lngLat[0]], {icon: naturescotIcon});
      marker.bindPopup(renderSettPopup(sett));
      return marker;
    });

    for (const marker of markers) {
      map.addLayer(marker);
    }

    if (markers.length > 0) {
      map.fitBounds(
        L.latLngBounds(
          markers.map((marker) => {
            return marker.getLatLng();
          }),
        ),
      );

      const overlay =
        typeof overlayElement === 'string' ? document.querySelector(`#${overlayElement}`) : overlayElement;

      // We're already setting 'display: flex' at the id level, so for CSS
      // specificity to override this, we need to set it on the element.
      overlay.style = 'display: none;';
    }
  }
};

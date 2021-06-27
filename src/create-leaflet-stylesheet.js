// create stylesheet element via js bc of linaria build problems

const headElement = document.getElementsByTagName('head')[0];
const leafletStylesheetElement = document.createElement('link');
leafletStylesheetElement.rel = 'stylesheet';
leafletStylesheetElement.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
leafletStylesheetElement.integrity =
  'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
leafletStylesheetElement.crossOrigin = '';
headElement.appendChild(leafletStylesheetElement);

const fetch = require("node-fetch");

const baseUrl = "https://api.geonet.org.nz/";
const defaultHeaders = {
  "Accept-Version": "application/vnd.geo+json;version=2"
};

function quakes(mmi = 3) {
  return fetch(`${baseUrl}/quake?MMI=${mmi}`, { headers: defaultHeaders });
}

module.exports = {
  quakes
};


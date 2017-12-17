const fetch = require("node-fetch");

const baseUrl = "https://api.geonet.org.nz";
const defaultHeaders = {
  "Accept-Version": "application/vnd.geo+json;version=2"
};

function getQuakes(mmi = 3) {
  return fetch(`${baseUrl}/quake?MMI=${mmi}`, { headers: defaultHeaders }).then(
    res => res.json()
  );
}

module.exports = {
  getQuakes
};

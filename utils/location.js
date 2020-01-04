const axios = require('axios');

const GlobalError = require('../models/GlobalError');

const API_KEY = 'AIzaSyBic0pcTO_Z7D2mlTT4VjBBp5GHTxBYIuw';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  ); /* encodeURIComponent is the global function in node */

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new GlobalError(
      'Could not find location for this address.',
      422 /* Unprocessable Entity code */
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;

// Handles incoming requests from frontend

const { getRankedListings } = require("../services/matchingService");

function getListings(req, res) {
  const { lat, lng } = req.query;

  let userLocation = null;

  if (lat && lng) {
    userLocation = { // for now, we just take lat/lng from query params - later, we can get this from browser geolocation
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  }

  const filters = {};

  const results = getRankedListings(userLocation, filters);

  res.json(results);
}

module.exports = {
  getListings,
};
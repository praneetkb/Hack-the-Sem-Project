// Matching engine: matches buyers and sellers based on location and price

const { listings } = require("../data/store");
const households = require("../data/households");
const { getDistance } = require("../utils/distance");

// to calculate score (prioritizing proximity over price for now)
const WEIGHTS = {
  proximity: 0.7, // in km
  price: 0.3, // in $/kWh 
};

// helper to normalize both values for scoring (0 to 1, where 1 is best)
function normalize(value, min, max) {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

// main matching function
function getRankedListings(userLocation, filters = {}) {
  if (!userLocation) return listings;

  // step 1: get and add distance to each listing
  const enriched = listings.map((listing) => {
    const household = households.find((h) => h.id === listing.householdId);
    const distance = household ? getDistance(
      userLocation.lat,
      userLocation.lng,
      household.location.lat,
      household.location.lng
    ) : 999;

    return {
      ...listing,
      distance, // new field added
    };
  });

  // step 2: find min/max for normalization
  const distances = enriched.map((l) => l.distance);
  const prices = enriched.map((l) => l.price || 0);

  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // step 3: score each listing
  const scored = enriched.map((listing) => {

    // proximity score: closer is better, so we invert it (1 - normalized distance)
    const distanceScore = 1 - normalize(listing.distance, minDist, maxDist);

    // price score: cheaper is better, so we invert it as well (1 - normalized price)
    const priceScore = 1 - normalize(listing.price || 0, minPrice, maxPrice);

    // final weighted scored tells us how good the match is (can add more factors later)
    const score =
      distanceScore * WEIGHTS.proximity +
      priceScore * WEIGHTS.price;

    return {
      ...listing,
      score,
    };
  });

  // step 4: sort by best match (best score first)
  let sorted = scored.sort((a, b) => b.score - a.score);

  // step 5: optional filters for user - can add later

  return sorted;
}

module.exports = {
  getRankedListings,
};
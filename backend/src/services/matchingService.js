// Matching engine: matches buyers and sellers based on location and price

const { listings } = require("../data/store");
const households = require("../data/households");
const { getDistance } = require("../utils/distance");

// to calculate score (equal priority)
const WEIGHTS = {
  proximity: 0.7, // in km
  price: 0.3, // in $/kWh 
};

// helper to normalize both values for scoring (0 to 1, where 1 is best)
function normalize(value, min, max) {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

return distances
  .map(({ listing, dist }) => {
    const distanceScore = 1 - normalize(dist, Math.min(...distances.map(d => d.dist)), Math.max(...distances.map(d => d.dist)));
    const priceScore = 1 - normalize(listing.pricePerKwh, Math.min(...activeListings.map(l => l.pricePerKwh)), Math.max(...activeListings.map(l => l.pricePerKwh)));

    return {
      ...listing,
      matchScore: distanceScore * 0.7 + priceScore * 0.3,
    };
  })
  .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

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
  const prices = enriched.map((l) => l.pricePerKwh || 0);

  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // step 3: score each listing
  const scored = enriched.map((listing) => {

    // proximity score: closer is better, so we invert it (1 - normalized distance)
    const distanceScore = 1 - normalize(listing.distance, minDist, maxDist);

    // price score: cheaper is better, so we invert it as well (1 - normalized price)
    const priceScore = 1 - normalize(listing.pricePerKwh || 0, minPrice, maxPrice);

    // final weighted scored tells us how good the match is 
    // Stronger penalty for bad distance using square
    const adjustedDistanceScore = Math.pow(distanceScore, 2);

    const score =
    adjustedDistanceScore * WEIGHTS.proximity +
    priceScore * WEIGHTS.price;

    return {
      ...listing,
      score,
      matchScore: score,
    };
  });

  // step 4: sort by best match (best score first)
  let sorted = scored.sort((a, b) => b.score - a.score);

  return sorted;
}

module.exports = {
  getRankedListings,
};
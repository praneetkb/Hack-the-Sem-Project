// Calculates surplus energy + creates and updates listings

const { listings } = require('../data/store');

// calculate surplus 
const calculateSurplus = (production, consumption) => {
  surplus = production - consumption;
  return surplus > 0 ? surplus : 0; // return surplus if positive, otherwise return 0
};

// create or update listing if surplus exists (one listing per household, update if exists) 
const surplusListing = (household, surplus) => {
  const existingListing = listings.find(
    (l) => l.householdId === household.id
  );

  // if listing exists, update it with new surplus and reset expiry
  if (existingListing) {
    existingListing.availableKWh = surplus;
    existingListing.createdAt = new Date();
    existingListing.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // reset expiry to 1 hour from now
    return existingListing;
  }

  // if no listing exists and there is a surplus, create new listing
  if (surplus > 0) {
    const newListing = {
      id: `listing_${household.id}`, // one listing per house
      householdId: household.id, // to identify the seller / which household is selling
      location: household.location, // placeholder for using real location later (coordinates or address)  
      availableKWh: surplus,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      price: 0.10, // Example price per unit
    };

    listings.push(newListing);
    console.log(`Created listing for ${household.id}`);
  }

  return null; // no surplus energy
};

// remove expired listings (expires after 1 hour)
const removeExpiredListings = () => {
  const now = new Date();

  for (let i = listings.length - 1; i >= 0; i--) {
    if (listings[i].expiresAt < now) {
      console.log("Listing expired:", listings[i].id);
      listings.splice(i, 1); // 
    }
  }
};

module.exports = {
  calculateSurplus,
  surplusListing,
  removeExpiredListings
};
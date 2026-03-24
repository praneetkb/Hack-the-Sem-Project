// Background job: updates energy data + listings

const households = require("../data/households");
const { fetchMeterData } = require("../services/meterService");
const { calculateSurplus, surplusListing, removeExpiredListings } = require("../services/energyService");
const { meterReadings } = require("../data/store");

const runMeterJob = async () => {
  console.log("Running meter job...");

  for (const household of households) {
    try {
      const data = await fetchMeterData(household);

      if (!data) continue;

      const { production, consumption } = data;

      // store reading
      meterReadings.push({
        householdId: household.id,
        production,
        consumption,
        timestamp: new Date(),
      });

      // calculate surplus
      const surplus = calculateSurplus(production, consumption);

      // update listing (ONE per household)
      surplusListing(household, surplus);

    } catch (error) {
      console.error(
        `Error fetching meter data for household ${household.id}:`,
        error
      );
    }
  }

  removeExpiredListings();
};

// run every 2 minutes
const startMeterJob = () => {
  const interval = 2 * 60 * 1000;

  console.log("Starting meter job every 2 minutes...");

  setInterval(runMeterJob, interval);
};

module.exports = {
  startMeterJob,
};
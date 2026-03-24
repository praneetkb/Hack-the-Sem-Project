// Simulate realistic production + consumption data for households

function getTimeOfDay() {
    const hour = new Date().getHours();
  
    // night = no production
    if (hour < 6 || hour > 18) return 0;
  
    // peak at noon
    const peak = 12;
    return Math.max(0, 1 - Math.abs(hour - peak) / 6); // value between 0 and 1, depending on how close to noon
  }
  
  // household usage (kWh)
  function getConsumption() {
    return 9 + Math.random() * 13; // 9 to 22 kWh per day, varies by household (size of family, appliances, etc)
  }
  
  // household production (kWh) 
  // depends on time of day and size of solar system
  // baseCapacity = size of solar system in kW 
  function getProduction(baseCapacity = 6) {
    const factor = getTimeOfDay();
  
    // varies by household and time of the day. Random variation to simulate weather/clouds
    return baseCapacity * factor * (0.8 + Math.random() * 0.5); // 80% to 130% of expected production 
  }
  
  // main function
  async function fetchMeterData(household) {
    try {
      // each house has slightly different solar system size
      const baseCapacity = household.capacity || 3 + Math.random() * 7; // 3kW to 10kW systems 
  
      // generate production and consumption
      const production = getProduction(baseCapacity);
      const consumption = getConsumption(); 
  
      return {
        production,
        consumption,
      };
  
      // fallback 
    } catch (error) {
      console.error("Simulation error:", error);
  
      return {
        production: 0,
        consumption: 0,
      };
    }
  }
  
  module.exports = {
    fetchMeterData,
  };
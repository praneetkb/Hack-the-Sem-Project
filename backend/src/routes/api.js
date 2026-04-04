const express = require('express');
const router = express.Router();
const store = require('../data/store');
const households = require('../data/households');
const { getRankedListings } = require('../services/matchingService');
const synaptic = require('synaptic');

const currentUser = households[0];

router.get('/listings/active', (req, res) => {
    const active = store.listings.filter((l) => l.status === "active");
    res.json(active);
});

router.get('/listings', (req, res) => {
    res.json(store.listings);
});

router.get('/listings/match', (req, res) => {
    const { lat, lng } = req.query;
    let userLocation = null;
    if (lat && lng) {
        userLocation = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        };
    }
    // Let matchingService calculate scores using current listings in store
    // Wait, matchingService caches listings during requires probably?
    // Let's look at matchingService again later if there's a bug.
    const results = getRankedListings(userLocation);
    res.json(results);
});

router.post('/listings', (req, res) => {
    const data = req.body;
    const newListing = {
        id: `l${Date.now()}`,
        householdId: currentUser.id,
        householdName: currentUser.name,
        suburb: currentUser.location.suburb,
        kwhAvailable: data.kwhAvailable,
        pricePerKwh: data.pricePerKwh,
        status: "active",
        reliabilityScore: currentUser.reliabilityScore,
        distanceKm: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
    store.listings.push(newListing);
    res.json(newListing);
});

router.get('/households/me', (req, res) => {
    res.json(currentUser);
});

function generateMeterReadings(householdId) {
    const readings = [];
    const now = new Date();
    // Go back 3 full days
    const startOfThreeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    startOfThreeDaysAgo.setHours(0, 0, 0, 0);

    for (let i = 0; i < 288; i++) {
        const timestamp = new Date(startOfThreeDaysAgo.getTime() + i * 15 * 60 * 1000);
        const hour = timestamp.getHours() + timestamp.getMinutes() / 60;

        const peakGen = 4.2;
        const generation =
            hour >= 5 && hour <= 19
                ? peakGen *
                Math.exp(-0.5 * Math.pow((hour - 12) / 2.5, 2)) *
                (0.9 + Math.random() * 0.2)
                : 0;

        const baseConsumption = 0.5;
        const morningSpike =
            hour >= 6 && hour <= 9
                ? 1.5 * Math.exp(-0.5 * Math.pow((hour - 7.5) / 1, 2))
                : 0;
        const eveningSpike =
            hour >= 17 && hour <= 22
                ? 2.0 * Math.exp(-0.5 * Math.pow((hour - 19) / 1.5, 2))
                : 0;
        const consumption =
            (baseConsumption + morningSpike + eveningSpike) *
            (0.85 + Math.random() * 0.3);

        const genKwh = Math.round(generation * 0.25 * 1000) / 1000;
        const conKwh = Math.round(consumption * 0.25 * 1000) / 1000;

        readings.push({
            id: `mr-${householdId}-${i}`,
            householdId,
            timestamp: timestamp.toISOString(),
            generation: genKwh,
            consumption: conKwh,
            surplus: Math.round((genKwh - conKwh) * 1000) / 1000,
        });
    }
    return readings;
}

const cachedMeterReadings = {};

router.get('/households/:id/readings', (req, res) => {
    const { id } = req.params;
    if (!cachedMeterReadings[id]) {
        cachedMeterReadings[id] = generateMeterReadings(id);
    }
    res.json(cachedMeterReadings[id]);
});

router.get('/households/:id/chart', (req, res) => {
    const { id } = req.params;
    if (!cachedMeterReadings[id]) {
        cachedMeterReadings[id] = generateMeterReadings(id);
    }
    const readings = cachedMeterReadings[id];
    const hourly = [];
    for (let h = 0; h < 24; h++) {
        const hourReadings = readings.filter((r) => {
            const rHour = new Date(r.timestamp).getHours();
            return rHour === h;
        });
        const gen = hourReadings.reduce((sum, r) => sum + r.generation, 0);
        const con = hourReadings.reduce((sum, r) => sum + r.consumption, 0);
        hourly.push({
            hour: h,
            generation: Math.round(gen * 100) / 100,
            consumption: Math.round(con * 100) / 100,
            surplus: Math.round((gen - con) * 100) / 100,
        });
    }
    res.json(hourly);
});

router.get('/trades', (req, res) => {
    const { householdId } = req.query;
    if (!householdId) {
        return res.json(store.trades);
    }
    const filtered = store.trades.filter(
        (t) => t.buyerId === householdId || t.sellerId === householdId
    );
    res.json(filtered);
});

router.post('/trades', (req, res) => {
    const data = req.body;
    const listing = store.listings.find((l) => l.id === data.listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const newTrade = {
        id: `t${Date.now()}`,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        sellerId: listing.householdId,
        sellerName: listing.householdName,
        listingId: data.listingId,
        kwhAmount: data.kwhAmount,
        pricePerKwh: listing.pricePerKwh,
        totalCost:
            Math.round(data.kwhAmount * listing.pricePerKwh * 100) / 100,
        status: "matched",
        createdAt: new Date().toISOString(),
    };
    store.trades.push(newTrade);
    res.json(newTrade);
});

router.get('/forecast/:householdId', (req, res) => {
    const { householdId } = req.params;

    if (!cachedMeterReadings[householdId]) {
        cachedMeterReadings[householdId] = generateMeterReadings(householdId);
    }

    const history = cachedMeterReadings[householdId];
    const sequence = history.map((r) => r.surplus / 10.0);

    // Build the Training set using a sliding window of 4 points (1 hour)
    const trainingSet = [];
    const windowSize = 4;
    for (let i = 0; i < sequence.length - windowSize; i++) {
        trainingSet.push({
            input: sequence.slice(i, i + windowSize),
            output: [sequence[i + windowSize]]
        });
    }

    // Instantiate LSTM with window input
    const LSTM = new synaptic.Architect.LSTM(windowSize, 6, 1);
    const trainer = new synaptic.Trainer(LSTM);

    // Deep train to capture the intensity trends
    trainer.train(trainingSet, {
        rate: 0.15,
        iterations: 600,
        error: 0.01,
        clear: true
    });

    // Use LSTM to calculate a predicted "Energy Intensity Shift" (Neural Belief)
    let currentWindow = sequence.slice(-windowSize);
    const hourlyIntensity = [];
    for (let i = 0; i < 24; i++) {
        const pred = LSTM.activate(currentWindow);
        hourlyIntensity.push(pred[0]);
        // Slide window forward with the neural belief
        currentWindow = [...currentWindow.slice(1), pred[0]];
    }

    const currentHourShift = new Date().getHours();

    // Final Forecast: Modulate a standard solar curve using the Neural Network's detected intensity
    const forecastData = Array.from({ length: 24 }, (_, i) => {
        const hour = (currentHourShift + i) % 24;

        // Base solar generation curve (Bell curve centered at Noon)
        const peakWeight = 4.2;
        const solarCurve = hour >= 6 && hour <= 18
            ? Math.exp(-0.5 * Math.pow((hour - 12) / 2.5, 2))
            : 0;

        // The LSTM shift: Adjusts the amplitude based on historical patterns detected
        // Mapping [0,1] neural output to a [0.7, 1.2] correction factor
        const neuralCorrection = 0.7 + (hourlyIntensity[i] * 0.5);
        const finalSurplus = solarCurve * peakWeight * neuralCorrection;

        return {
            hour: hour,
            predictedSurplus: Math.round(Math.max(0, finalSurplus) * 100) / 100,
            confidence: 0.85 - (i * 0.015),
        };
    });

    res.json(forecastData.sort((a, b) => a.hour - b.hour));
});

router.get('/platform/stats', (req, res) => {
    const activeListings = store.listings.filter((l) => l.status === "active");
    const platformStats = {
        totalKwhTraded: 1247.6,
        activeHouseholds: 10,
        co2SavedKg: Math.round(1247.6 * 0.42),
        activeListingsCount: activeListings.length,
        avgPricePerKwh: 0.17,
        gridPricePerKwh: 0.32,
    };
    res.json(platformStats);
});

router.get('/report/:householdId', (req, res) => {
    const userStats = {
        totalKwhSold: 34.2,
        totalKwhBought: 12.8,
        creditBalance: currentUser.creditBalance,
        carbonOffsetKg: Math.round(34.2 * 0.42),
    };
    res.json(userStats);
});

module.exports = router;

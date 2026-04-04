import { useEffect, useState } from "react";
import { getForecast } from "@/lib/api";
import { Sparkles } from "lucide-react";
import type { ForecastPoint } from "@/types";

export function EnergyForecastCard({ householdId }: { householdId: string }) {
    const [forecast, setForecast] = useState<ForecastPoint[]>([]);

    useEffect(() => {
        getForecast(householdId).then(setForecast);
    }, [householdId]);

    if (!forecast.length) return <div className="animate-pulse bg-surface-low h-full min-h-[250px] rounded-xl" />;

    const maxSurplus = Math.max(...forecast.map((f) => f.predictedSurplus));

    return (
        <div className="bg-surface-lowest rounded-xl p-6 shadow-soft h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="headline-sm text-on-surface">24-Hour Yield Forecast</h2>
            </div>

            {/* Simple Dynamic CSS Bar Chart */}
            <div className="flex-1 flex items-end gap-[2px] mt-auto h-32">
                {forecast.map((point) => {
                    const heightPercent = maxSurplus > 0 ? (point.predictedSurplus / maxSurplus) * 100 : 0;
                    return (
                        <div key={point.hour} className="group relative flex-1 flex flex-col justify-end h-full">
                            <div
                                className="w-full bg-primary/30 rounded-t-sm transition-all duration-500 group-hover:bg-primary/80 border-t border-primary/50"
                                style={{ height: `${heightPercent}%` }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-highest text-on-surface text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                    {point.hour}:00 - {point.predictedSurplus} kWh
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant mt-3 font-medium border-t border-surface-low pt-2">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
            </div>
            <p className="body-md text-on-surface-variant mt-4 text-center text-xs">
                Prediction dynamically generated via 72-hour historical averaging.
            </p>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  XYChart, 
  AnimatedAxis, 
  AnimatedLineSeries, 
  Tooltip
} from '@visx/xychart';
import { curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';
import { Group } from '@visx/group';

interface CountryForestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  country: string | null;
}

interface TimeseriesDataPoint {
  year: number;
  protected_pct: number;
  forest_land_BiocapPerCap: number;
}

const CountryForestDrawer: React.FC<CountryForestDrawerProps> = ({ 
  isOpen, 
  onClose, 
  country 
}) => {
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [firstYearForest, setFirstYearForest] = useState<number | null>(null);

  // Fetch timeseries data when the country changes
  useEffect(() => {
    if (!country) {
      setTimeseriesData([]);
      setFirstYearForest(null);
      return;
    }

    const fetchTimeseriesData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/timeseries/${country}`);
        if (response.data && response.data.length > 0) {
          // Ensure data is sorted by year
          const sortedData = [...response.data].sort((a, b) => a.year - b.year);
          
          // Save the first year's forest value for the baseline
          if (sortedData[0] && sortedData[0].forest_land_BiocapPerCap) {
            setFirstYearForest(sortedData[0].forest_land_BiocapPerCap);
          }
          
          setTimeseriesData(sortedData);
        } else {
          setError("No timeseries data available for this country");
        }
      } catch (err) {
        console.error("Error fetching timeseries data:", err);
        setError("Failed to load timeseries data");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeseriesData();
  }, [country]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-zinc-900 w-full h-full md:w-96 md:ml-auto overflow-auto p-4 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img
              src={`https://flagcdn.com/w20/${country && typeof country === 'string' ? country.toLowerCase().slice(0, 2) : 'xx'}.png`}
              alt={`${country} flag`}
              className="w-5 h-3.5 mr-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <h2 className="text-white text-xl font-bold">{country} Forest Analysis</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-md"
          >
            Close
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-zinc-400">
            Loading data...
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900 rounded-md p-4 text-center text-red-400">
            {error}
          </div>
        ) : timeseriesData.length === 0 ? (
          <div className="text-center py-6 text-zinc-400">
            No time-series data available for {country}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Protected Area Percentage Chart */}
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-white font-medium mb-2">Protected Area Percentage Over Time</h3>
              <div className="h-48">
                <XYChart
                  height={180}
                  xScale={{ type: 'linear', domain: [Math.min(...timeseriesData.map(d => d.year)), Math.max(...timeseriesData.map(d => d.year))] }}
                  yScale={{ type: 'linear', domain: [0, Math.max(15, Math.max(...timeseriesData.map(d => d.protected_pct)) * 1.1)] }}
                  margin={{ top: 20, right: 10, bottom: 30, left: 40 }}
                >
                  <AnimatedAxis 
                    orientation="bottom" 
                    label="Year"
                    labelProps={{
                      fill: 'white',
                      fontSize: 10,
                      textAnchor: 'middle',
                    }}
                    tickLabelProps={() => ({
                      fill: 'white',
                      fontSize: 9,
                      textAnchor: 'middle',
                    })}
                    numTicks={5}
                  />
                  <AnimatedAxis 
                    orientation="left" 
                    label="%" 
                    labelProps={{
                      fill: 'white',
                      fontSize: 10,
                      textAnchor: 'middle',
                    }}
                    tickLabelProps={() => ({
                      fill: 'white',
                      fontSize: 9,
                      textAnchor: 'end',
                    })}
                    tickFormat={(v) => `${v}%`}
                    numTicks={5}
                  />
                  
                  {/* 15% reference line */}
                  <Group>
                    <line
                      x1={0}
                      x2={Math.max(...timeseriesData.map(d => d.year))}
                      y1={15}
                      y2={15}
                      stroke="#94a3b8"
                      strokeWidth={1}
                      strokeDasharray="4,4"
                    />
                    <text
                      x={Math.min(...timeseriesData.map(d => d.year)) + 2}
                      y={15 - 5}
                      fill="#94a3b8"
                      fontSize={9}
                      textAnchor="start"
                    >
                      15% threshold
                    </text>
                  </Group>
                  
                  <AnimatedLineSeries
                    dataKey="protected-pct"
                    data={timeseriesData}
                    xAccessor={(d) => d.year}
                    yAccessor={(d) => d.protected_pct}
                    stroke="#3b82f6" // blue-500
                    curve={curveMonotoneX}
                  />
                  
                  <Tooltip
                    snapTooltipToDatumX
                    snapTooltipToDatumY
                    showVerticalCrosshair
                    showHorizontalCrosshair
                    renderTooltip={({ tooltipData }) => {
                      if (!tooltipData || !tooltipData.nearestDatum) return null;
                      const datum = tooltipData.nearestDatum.datum as TimeseriesDataPoint;
                      
                      return (
                        <div className="bg-zinc-900 p-2 rounded-lg shadow-xl border border-zinc-700 text-xs">
                          <div className="text-white font-bold">{datum.year}</div>
                          <div className="text-zinc-300">
                            Protected: {datum.protected_pct?.toFixed(1)}%
                          </div>
                        </div>
                      );
                    }}
                  />
                </XYChart>
              </div>
            </div>
            
            {/* Forest Biocap Chart */}
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-white font-medium mb-2">Forest Biocapacity per Capita</h3>
              <div className="h-48">
                <XYChart
                  height={180}
                  xScale={{ type: 'linear', domain: [Math.min(...timeseriesData.map(d => d.year)), Math.max(...timeseriesData.map(d => d.year))] }}
                  yScale={{ 
                    type: 'linear', 
                    domain: [
                      Math.min(0, Math.min(...timeseriesData.map(d => d.forest_land_BiocapPerCap)) * 0.9), 
                      Math.max(...timeseriesData.map(d => d.forest_land_BiocapPerCap)) * 1.1
                    ] 
                  }}
                  margin={{ top: 20, right: 10, bottom: 30, left: 40 }}
                >
                  <AnimatedAxis 
                    orientation="bottom" 
                    label="Year"
                    labelProps={{
                      fill: 'white',
                      fontSize: 10,
                      textAnchor: 'middle',
                    }}
                    tickLabelProps={() => ({
                      fill: 'white',
                      fontSize: 9,
                      textAnchor: 'middle',
                    })}
                    numTicks={5}
                  />
                  <AnimatedAxis 
                    orientation="left" 
                    label="GHA pc" 
                    labelProps={{
                      fill: 'white',
                      fontSize: 10,
                      textAnchor: 'middle',
                    }}
                    tickLabelProps={() => ({
                      fill: 'white',
                      fontSize: 9,
                      textAnchor: 'end',
                    })}
                    tickFormat={(v) => format(".2f")(v)}
                    numTicks={5}
                  />
                  
                  {/* Baseline from first year forest value */}
                  {firstYearForest !== null && (
                    <Group>
                      <line
                        x1={Math.min(...timeseriesData.map(d => d.year))}
                        x2={Math.max(...timeseriesData.map(d => d.year))}
                        y1={firstYearForest}
                        y2={firstYearForest}
                        stroke="#94a3b8"
                        strokeWidth={1}
                        strokeDasharray="4,4"
                      />
                      <text
                        x={Math.min(...timeseriesData.map(d => d.year)) + 2}
                        y={firstYearForest - 5}
                        fill="#94a3b8"
                        fontSize={9}
                        textAnchor="start"
                      >
                        First year baseline
                      </text>
                    </Group>
                  )}
                  
                  <AnimatedLineSeries
                    dataKey="forest-biocap"
                    data={timeseriesData}
                    xAccessor={(d) => d.year}
                    yAccessor={(d) => d.forest_land_BiocapPerCap}
                    stroke="#10b981" // emerald-500
                    curve={curveMonotoneX}
                  />
                  
                  <Tooltip
                    snapTooltipToDatumX
                    snapTooltipToDatumY
                    showVerticalCrosshair
                    showHorizontalCrosshair
                    renderTooltip={({ tooltipData }) => {
                      if (!tooltipData || !tooltipData.nearestDatum) return null;
                      const datum = tooltipData.nearestDatum.datum as TimeseriesDataPoint;
                      
                      return (
                        <div className="bg-zinc-900 p-2 rounded-lg shadow-xl border border-zinc-700 text-xs">
                          <div className="text-white font-bold">{datum.year}</div>
                          <div className="text-zinc-300">
                            Forest: {datum.forest_land_BiocapPerCap?.toFixed(3)} gha pc
                          </div>
                          {firstYearForest !== null && (
                            <div className="text-zinc-300">
                              Change: {(datum.forest_land_BiocapPerCap - firstYearForest).toFixed(3)} gha pc
                              {datum.forest_land_BiocapPerCap < firstYearForest ? ' 🔻' : ' 🔺'}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                </XYChart>
              </div>
            </div>
            
            {/* Interpretation */}
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-white font-medium mb-2">Interpretation</h3>
              <div className="text-zinc-300 text-sm space-y-2">
                <p>
                  This analysis shows the relationship between protected area designations and actual forest biocapacity changes.
                </p>
                {timeseriesData.length > 0 && (
                  <>
                    {timeseriesData[timeseriesData.length - 1].protected_pct >= 15 ? (
                      <p>
                        {country} has designated <span className="font-medium text-white">{timeseriesData[timeseriesData.length - 1].protected_pct.toFixed(1)}%</span> of its land area as protected, which is {timeseriesData[timeseriesData.length - 1].protected_pct >= 15 ? 'above' : 'below'} the 15% international threshold.
                      </p>
                    ) : (
                      <p>
                        {country} has designated <span className="font-medium text-white">{timeseriesData[timeseriesData.length - 1].protected_pct.toFixed(1)}%</span> of its land area as protected, which is below the 15% international threshold.
                      </p>
                    )}
                    
                    {firstYearForest !== null && timeseriesData[timeseriesData.length - 1].forest_land_BiocapPerCap < firstYearForest ? (
                      <p className="text-red-400">
                        Despite this, forest biocapacity per capita has decreased by <span className="font-medium">{(firstYearForest - timeseriesData[timeseriesData.length - 1].forest_land_BiocapPerCap).toFixed(3)} gha</span> since the first recorded year, suggesting that protected status may not be effectively preventing deforestation or forest degradation.
                      </p>
                    ) : firstYearForest !== null ? (
                      <p className="text-green-400">
                        Forest biocapacity per capita has increased by <span className="font-medium">{(timeseriesData[timeseriesData.length - 1].forest_land_BiocapPerCap - firstYearForest).toFixed(3)} gha</span> since the first recorded year, suggesting that conservation efforts may be working.
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryForestDrawer;
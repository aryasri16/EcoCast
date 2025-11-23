import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  XYChart, 
  AnimatedAxis, 
  AnimatedLineSeries, 
  Tooltip,
  AnimatedAreaSeries
} from '@visx/xychart';
import { curveMonotoneX } from 'd3-shape';
import { format } from 'd3-format';

interface EcoBalanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  country: string | null;
}

interface EcoBalanceDataPoint {
  year: number;
  eco_balance_percap?: number;
  eco_balance_total?: number;
  total_BiocapPerCap?: number;
  total_EFConsPerCap?: number;
  total_BiocapTotGHA?: number;
  total_EFConsTotGHA?: number;
}

const EcoBalanceDrawer: React.FC<EcoBalanceDrawerProps> = ({ 
  isOpen, 
  onClose, 
  country 
}) => {
  const [ecoBalanceData, setEcoBalanceData] = useState<EcoBalanceDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ecological balance data when the country changes
  useEffect(() => {
    if (!country) {
      setEcoBalanceData([]);
      return;
    }

    const fetchEcoBalanceData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/eco-balance/${country}`);
        if (response.data && response.data.length > 0) {
          // Ensure data is sorted by year
          const sortedData = [...response.data].sort((a, b) => a.year - b.year);
          setEcoBalanceData(sortedData);
        } else {
          setError("No ecological balance data available for this country");
        }
      } catch (err: any) {
        console.error("Error fetching ecological balance data:", err);
        if (err.response?.status === 404) {
          setError("Ecological balance data not available. Please run the pipeline to generate features.");
        } else {
          setError("Failed to load ecological balance data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEcoBalanceData();
  }, [country]);

  if (!isOpen) return null;

  // Calculate statistics
  const latestData = ecoBalanceData.length > 0 ? ecoBalanceData[ecoBalanceData.length - 1] : null;
  const hasPerCap = ecoBalanceData.some(d => d.eco_balance_percap !== null && d.eco_balance_percap !== undefined);
  const hasTotal = ecoBalanceData.some(d => d.eco_balance_total !== null && d.eco_balance_total !== undefined);

  // Determine status
  const getStatus = (balance: number | undefined) => {
    if (balance === undefined || balance === null) return { text: 'Unknown', color: 'text-zinc-400' };
    if (balance > 0) return { text: 'Ecological Reserve', color: 'text-green-400' };
    if (balance < 0) return { text: 'Ecological Deficit', color: 'text-red-400' };
    return { text: 'Balanced', color: 'text-yellow-400' };
  };

  const perCapStatus = getStatus(latestData?.eco_balance_percap);

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
            <h2 className="text-white text-xl font-bold">{country} Ecological Balance</h2>
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
        ) : ecoBalanceData.length === 0 ? (
          <div className="text-center py-6 text-zinc-400">
            No ecological balance data available for {country}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Status Card */}
            {latestData && (
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="text-white font-medium mb-3">Current Status (Latest Year: {latestData.year})</h3>
                {latestData.eco_balance_percap !== undefined && latestData.eco_balance_percap !== null && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Per-Capita Balance:</span>
                      <span className={`font-semibold ${perCapStatus.color}`}>
                        {latestData.eco_balance_percap.toFixed(3)} gha/capita
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Status:</span>
                      <span className={`font-semibold ${perCapStatus.color}`}>
                        {perCapStatus.text}
                      </span>
                    </div>
                    {latestData.total_BiocapPerCap !== undefined && latestData.total_EFConsPerCap !== undefined && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500">Biocapacity:</span>
                          <span className="text-zinc-300">{latestData.total_BiocapPerCap.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-500">Footprint:</span>
                          <span className="text-zinc-300">{latestData.total_EFConsPerCap.toFixed(3)}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Per-Capita Ecological Balance Chart */}
            {hasPerCap && (
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="text-white font-medium mb-2">Per-Capita Ecological Balance Over Time</h3>
                <p className="text-xs text-zinc-400 mb-3">
                  Positive = Reserve (biocapacity exceeds footprint)<br/>
                  Negative = Deficit (footprint exceeds biocapacity)
                </p>
                <div className="h-64">
                  <XYChart
                    height={240}
                    xScale={{ 
                      type: 'linear', 
                      domain: [
                        Math.min(...ecoBalanceData.map(d => d.year)), 
                        Math.max(...ecoBalanceData.map(d => d.year))
                      ] 
                    }}
                    yScale={{ 
                      type: 'linear',
                      domain: [
                        Math.min(0, Math.min(...ecoBalanceData.map(d => d.eco_balance_percap || 0)) * 1.1),
                        Math.max(0, Math.max(...ecoBalanceData.map(d => d.eco_balance_percap || 0)) * 1.1)
                      ]
                    }}
                    margin={{ top: 20, right: 10, bottom: 40, left: 50 }}
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
                      label="Balance (gha/capita)"
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
                      numTicks={5}
                    />
                    {/* Zero line */}
                    <AnimatedLineSeries
                      dataKey="zero"
                      data={[
                        { year: Math.min(...ecoBalanceData.map(d => d.year)), eco_balance_percap: 0 },
                        { year: Math.max(...ecoBalanceData.map(d => d.year)), eco_balance_percap: 0 }
                      ]}
                      xAccessor={(d) => d.year}
                      yAccessor={(d) => d.eco_balance_percap}
                      stroke="#666"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    {/* Balance line */}
                    <AnimatedLineSeries
                      dataKey="balance"
                      data={ecoBalanceData.filter(d => d.eco_balance_percap !== null && d.eco_balance_percap !== undefined)}
                      xAccessor={(d) => d.year}
                      yAccessor={(d) => d.eco_balance_percap || 0}
                      stroke="#10b981"
                      strokeWidth={2}
                      curve={curveMonotoneX}
                    />
                    <Tooltip
                      snapTooltipToDatumX
                      snapTooltipToDatumY
                      showVerticalCrosshair
                      showSeriesGlyphs
                      renderTooltip={({ tooltipData }) => {
                        if (!tooltipData) return null;
                        const datum = tooltipData.nearestDatum?.datum as EcoBalanceDataPoint;
                        if (!datum) return null;
                        return (
                          <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-white text-xs">
                            <div><strong>Year:</strong> {datum.year}</div>
                            <div><strong>Balance:</strong> {datum.eco_balance_percap?.toFixed(3)} gha/capita</div>
                            {datum.total_BiocapPerCap !== undefined && (
                              <div><strong>Biocapacity:</strong> {datum.total_BiocapPerCap.toFixed(3)}</div>
                            )}
                            {datum.total_EFConsPerCap !== undefined && (
                              <div><strong>Footprint:</strong> {datum.total_EFConsPerCap.toFixed(3)}</div>
                            )}
                          </div>
                        );
                      }}
                    />
                  </XYChart>
                </div>
              </div>
            )}

            {/* Biocapacity vs Footprint Comparison */}
            {latestData && latestData.total_BiocapPerCap !== undefined && latestData.total_EFConsPerCap !== undefined && (
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="text-white font-medium mb-3">Biocapacity vs Footprint</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Biocapacity</span>
                      <span className="text-green-400">{latestData.total_BiocapPerCap.toFixed(3)} gha/capita</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (latestData.total_BiocapPerCap / Math.max(latestData.total_BiocapPerCap, latestData.total_EFConsPerCap)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Footprint</span>
                      <span className="text-red-400">{latestData.total_EFConsPerCap.toFixed(3)} gha/capita</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (latestData.total_EFConsPerCap / Math.max(latestData.total_BiocapPerCap, latestData.total_EFConsPerCap)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3 text-sm text-zinc-300">
              <div className="font-semibold text-blue-400 mb-1">About Ecological Balance</div>
              <div className="space-y-1">
                <div>• <strong>Ecological Reserve:</strong> Country regenerates more biocapacity than it consumes</div>
                <div>• <strong>Ecological Deficit:</strong> Country consumes more than it regenerates (overshoot)</div>
                <div>• This metric complements CO₂, renewables, and economic indicators</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoBalanceDrawer;


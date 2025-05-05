import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';
import { 
  XYChart, 
  AnimatedAxis, 
  AnimatedGrid, 
  AnimatedGlyphSeries,
  Tooltip,
  Annotation,
  RectClipPath
} from '@visx/xychart';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';

interface ProtectedRealityScatterProps {
  data: any[];
  countries: string[];
  showGlobalContext: boolean;
  onDotClick: (iso: string) => void;
}

interface CountryDataPoint {
  iso3: string;
  protected_pct: number;
  forest_land_BiocapPerCap: number;
  delta_forest: number;
  isSelected?: boolean;
}

const ProtectedRealityScatter: React.FC<ProtectedRealityScatterProps> = ({
  data,
  countries,
  showGlobalContext,
  onDotClick
}) => {
  const [processedData, setProcessedData] = useState<CountryDataPoint[]>([]);
  
  // Process the data when it changes
  useEffect(() => {
    // Filter out any rows where delta_forest is NaN
    const validData = data.filter(d => 
      d && 
      d.iso3 && 
      d.protected_pct !== undefined && 
      d.protected_pct !== null && 
      d.delta_forest !== undefined && 
      d.delta_forest !== null &&
      !isNaN(d.delta_forest)
    );
    
    // Clamp negative protected_pct values to 0
    const clampedData = validData.map(d => ({
      ...d,
      protected_pct: Math.max(0, d.protected_pct),
      // Add a very small random jitter to avoid click overlap for dots with delta_forest = 0
      delta_forest: d.delta_forest === 0 ? d.delta_forest + (Math.random() * 0.01 - 0.005) : d.delta_forest,
      // Mark if the country is in the selected basket
      isSelected: countries.includes(d.iso3)
    }));
    
    setProcessedData(clampedData);
  }, [data, countries]);

  // Get color for a data point (blue for selected countries, gray for others)
  const getColor = (d: CountryDataPoint) => {
    if (d.isSelected) {
      return '#3b82f6'; // blue-500
    }
    return 'rgba(148, 163, 184, 0.4)'; // slate-400 with 40% opacity
  };

  // Calculate domain for the x-axis (protected_pct)
  const xMax = d3.max(processedData, d => d.protected_pct) || 60;
  const xDomain: [number, number] = [0, xMax + 5]; // Add some padding
  
  // Calculate domain for the y-axis (delta_forest)
  const yMin = d3.min(processedData, d => d.delta_forest) || -35;
  const yMax = d3.max(processedData, d => d.delta_forest) || 1;
  const yDomain: [number, number] = [yMin - 0.5, yMax + 0.5]; // Add some padding

  return (
    <div className="h-full w-full overflow-x-auto">
      {/* Title at the top of the chart */}
      <div className="text-white font-bold text-xl text-center mb-2">
        Protected Areas vs. Forest Biocapacity Change
      </div>
      
      <XYChart
        height={500}
        width={800}
        margin={{ top: 50, right: 60, bottom: 100, left: 90 }}
        xScale={{ type: 'linear', domain: xDomain }}
        yScale={{ type: 'linear', domain: yDomain }}
      >
        <AnimatedGrid columns={false} numTicks={5} stroke="#666" opacity={0.3} />
        
        {/* X-axis with improved visibility - manually position label */}
        <AnimatedAxis 
          orientation="bottom" 
          label="" // Empty label, we'll add our own
          labelOffset={60}
          tickLabelProps={() => ({
            fill: 'white',
            fontSize: 14,
            textAnchor: 'middle',
            dy: '0.5em',
          })}
          numTicks={7}
          stroke="white"
          tickStroke="white"
        />
        
        {/* Manual X-axis label without background */}
        <Group>
          <text
            x={400}
            y={450}
            fill="#ffffff"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
            style={{
              textShadow: '0px 0px 4px #000000, 0px 0px 8px #000000'
            }}
          >
            Protected Land Area (% of terrestrial area)
          </text>
        </Group>
        
        {/* Y-axis with improved visibility */}
        <AnimatedAxis 
          orientation="left" 
          label="" // Empty label, we'll add our own
          labelOffset={70}
          tickLabelProps={() => ({
            fill: 'white',
            fontSize: 14,
            textAnchor: 'end',
            dx: '-0.5em',
          })}
          numTicks={7}
          stroke="white"
          tickStroke="white"
        />
        
        {/* Manual Y-axis label without background */}
        <Group>
          <text
            transform="rotate(-90)"
            x={-250} // y-center of chart
            y={25}
            fill="#ffffff"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
            style={{
              textShadow: '0px 0px 4px #000000, 0px 0px 8px #000000'
            }}
          >
            Forest Biocapacity Change (gha per capita)
          </text>
        </Group>
        
        {/* Draw shaded red rect in the lower-right quadrant (x >= 15 && y < 0) */}
        <Group>
          <rect
            x={15} // x >= 15
            y={yDomain[0]} // Start from bottom of chart
            width={xDomain[1] - 15} // Extend to right edge of chart
            height={Math.abs(0 - yDomain[0])} // Height up to y=0
            fill="#ef4444" // red-500
            fillOpacity={0.15}
            stroke="#ef4444"
            strokeOpacity={0.5}
            strokeWidth={2}
          />
          <text
            x={(15 + xDomain[1]) / 2}
            y={yDomain[0] / 2}
            fill="#ef4444" /* red-500 */
            fontSize={18}
            fontWeight="bold"
            textAnchor="middle"
            style={{
              textShadow: '0px 0px 4px #000000, 0px 0px 8px #000000',
              paintOrder: 'stroke',
              stroke: 'rgba(0,0,0,0.8)',
              strokeWidth: 3
            }}
          >
            "Paper parks" zone
          </text>
        </Group>
        
        {/* Reference line at y=0 with improved visibility */}
        <Group>
          <line
            x1={0}
            x2={xDomain[1]}
            y1={0}
            y2={0}
            stroke="white"
            strokeDasharray="4,4"
            strokeWidth={2}
          />
          <text
            x={10}
            y={-12}
            fill="#4ade80" /* green-400 */
            fontSize={14}
            fontWeight="bold"
            textAnchor="start"
            style={{
              textShadow: '0px 0px 4px #000000, 0px 0px 8px #000000',
              paintOrder: 'stroke',
              stroke: '#000000',
              strokeWidth: 3
            }}
          >
            No forest change
          </text>
        </Group>
        
        {/* Reference line at x=15 with improved visibility */}
        <Group>
          <line
            x1={15}
            x2={15}
            y1={yDomain[0]}
            y2={yDomain[1]}
            stroke="white"
            strokeDasharray="4,4"
            strokeWidth={2}
          />
          <text
            x={15 + 10}
            y={yDomain[1] - 12}
            fill="#fbbf24" /* amber-400 */
            fontSize={14}
            fontWeight="bold"
            textAnchor="start"
            style={{
              textShadow: '0px 0px 4px #000000, 0px 0px 8px #000000',
              paintOrder: 'stroke',
              stroke: '#000000',
              strokeWidth: 3
            }}
          >
            15% protection threshold
          </text>
        </Group>

        {/* Points for all countries (if global context is enabled) */}
        {showGlobalContext && (
          <AnimatedGlyphSeries
            dataKey="all-countries"
            data={processedData.filter(d => !d.isSelected)}
            xAccessor={(d) => d.protected_pct}
            yAccessor={(d) => d.delta_forest}
            colorAccessor={getColor}
            size={6}
          />
        )}
        
        {/* Points for selected countries (always shown) */}
        <AnimatedGlyphSeries
          dataKey="selected-countries"
          data={processedData.filter(d => d.isSelected)}
          xAccessor={(d) => d.protected_pct}
          yAccessor={(d) => d.delta_forest}
          colorAccessor={getColor}
          size={12}
          onPointerUp={(d) => onDotClick(d.iso3)}
        />
        
        {/* Annotations for selected countries */}
        {processedData
          .filter(d => d.isSelected)
          .map((country) => (
            <Annotation
              key={`annotation-${country.iso3}`}
              dataKey={`${country.iso3}-label`}
              datum={{ x: country.protected_pct, y: country.delta_forest }}
              dx={15}
              dy={-15}
            >
              <text
                fontSize={14}
                fontWeight="bold"
                fill="#3b82f6"
                textAnchor="start"
                style={{ textShadow: '0 0 5px rgba(0,0,0,0.7)' }}
              >
                {country.iso3}
              </text>
            </Annotation>
          ))
        }
        
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showHorizontalCrosshair
          renderTooltip={({ tooltipData }) => {
            if (!tooltipData || !tooltipData.nearestDatum) return null;
            const datum = tooltipData.nearestDatum.datum as CountryDataPoint;
            
            const isForestLoss = datum.delta_forest < 0;
            const emoji = isForestLoss ? '🔻' : '🔺';
            
            return (
              <div className="bg-zinc-900 p-4 rounded-lg shadow-xl border border-zinc-700">
                <div className="text-white font-bold text-lg mb-1">{datum.iso3}</div>
                <div className="text-zinc-300 text-md mt-1">
                  Protected: <span className="font-semibold text-white">{datum.protected_pct.toFixed(1)}%</span>
                </div>
                <div className="text-zinc-300 text-md">
                  Δ Forest: <span className="font-semibold text-white">{datum.delta_forest.toFixed(3)}</span> gha ppc {emoji}
                </div>
                <div className="text-zinc-300 text-md">
                  Current forest: <span className="font-semibold text-white">{datum.forest_land_BiocapPerCap.toFixed(3)}</span> gha ppc
                </div>
                {datum.protected_pct >= 15 && datum.delta_forest < 0 && (
                  <div className="text-red-400 text-md mt-2 font-medium">
                    ⚠️ Protection not preventing forest loss
                  </div>
                )}
              </div>
            );
          }}
        />
      </XYChart>
    </div>
  );
};

export default ProtectedRealityScatter;
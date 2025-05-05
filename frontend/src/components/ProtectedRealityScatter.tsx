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
      <XYChart
        height={400}
        width={600}
        margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
        xScale={{ type: 'linear', domain: xDomain }}
        yScale={{ type: 'linear', domain: yDomain }}
      >
        <AnimatedGrid columns={false} numTicks={5} />
        <AnimatedAxis 
          orientation="bottom" 
          label="Protected Land Area (%)"
          labelOffset={40}
          labelProps={{
            fill: 'white',
            fontSize: 12,
            textAnchor: 'middle',
          }}
          tickLabelProps={() => ({
            fill: 'white',
            fontSize: 10,
            textAnchor: 'middle',
          })}
          numTicks={5}
        />
        <AnimatedAxis 
          orientation="left" 
          label="Forest Land Change (gha per capita)" 
          labelOffset={50}
          labelProps={{
            fill: 'white',
            fontSize: 12,
            textAnchor: 'middle',
          }}
          tickLabelProps={() => ({
            fill: 'white',
            fontSize: 10,
            textAnchor: 'end',
          })}
          numTicks={5}
        />
        
        {/* Draw shaded red rect in the lower-right quadrant (x >= 15 && y < 0) */}
        <Group>
          <rect
            x={15} // x >= 15
            y={yDomain[0]} // Start from bottom of chart
            width={xDomain[1] - 15} // Extend to right edge of chart
            height={Math.abs(0 - yDomain[0])} // Height up to y=0
            fill="#ef4444" // red-500
            fillOpacity={0.1}
            stroke="#ef4444"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
          <text
            x={(15 + xDomain[1]) / 2}
            y={yDomain[0] / 2}
            fill="white"
            fontSize={10}
            fontWeight="bold"
            textAnchor="middle"
          >
            "Paper parks" zone
          </text>
        </Group>
        
        {/* Reference line at y=0 */}
        <Group>
          <line
            x1={0}
            x2={xDomain[1]}
            y1={0}
            y2={0}
            stroke="#94a3b8"
            strokeDasharray="4,4"
          />
        </Group>
        
        {/* Reference line at x=15 */}
        <Group>
          <line
            x1={15}
            x2={15}
            y1={yDomain[0]}
            y2={yDomain[1]}
            stroke="#94a3b8"
            strokeDasharray="4,4"
          />
          <text
            x={15 + 2}
            y={yDomain[1] - 5}
            fill="#94a3b8"
            fontSize={10}
            textAnchor="start"
            alignmentBaseline="hanging"
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
            size={4}
          />
        )}
        
        {/* Points for selected countries (always shown) */}
        <AnimatedGlyphSeries
          dataKey="selected-countries"
          data={processedData.filter(d => d.isSelected)}
          xAccessor={(d) => d.protected_pct}
          yAccessor={(d) => d.delta_forest}
          colorAccessor={getColor}
          size={8}
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
              dx={10}
              dy={-10}
            >
              <text
                fontSize={10}
                fontWeight="bold"
                fill="#3b82f6"
                textAnchor="start"
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
              <div className="bg-zinc-900 p-3 rounded-lg shadow-xl border border-zinc-700">
                <div className="text-white font-bold">{datum.iso3}</div>
                <div className="text-zinc-300 text-sm mt-1">
                  Protected: {datum.protected_pct.toFixed(1)}%
                </div>
                <div className="text-zinc-300 text-sm">
                  Δ Forest: {datum.delta_forest.toFixed(3)} gha ppc {emoji}
                </div>
                <div className="text-zinc-300 text-sm">
                  Current forest: {datum.forest_land_BiocapPerCap.toFixed(3)} gha ppc
                </div>
                {datum.protected_pct >= 15 && datum.delta_forest < 0 && (
                  <div className="text-red-400 text-sm mt-1 font-medium">
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
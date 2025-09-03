import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CamelotWheelProps {
  currentKey?: string;
  compatibleKeys?: string[];
  onKeySelect?: (key: string) => void;
}

const CamelotWheel: React.FC<CamelotWheelProps> = ({
  currentKey = '1A',
  compatibleKeys = [],
  onKeySelect
}) => {
  // Camelot wheel keys in order
  const outerKeys = ['1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B', '12B'];
  const innerKeys = ['1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A', '12A'];
  
  const keyNames = {
    '1A': 'C♭ min', '1B': 'E♭ maj',
    '2A': 'G♭ min', '2B': 'A♭ maj',
    '3A': 'D♭ min', '3B': 'E maj',
    '4A': 'A♭ min', '4B': 'B maj',
    '5A': 'E♭ min', '5B': 'F♯ maj',
    '6A': 'B♭ min', '6B': 'D♭ maj',
    '7A': 'F min', '7B': 'A♭ maj',
    '8A': 'C min', '8B': 'E♭ maj',
    '9A': 'G min', '9B': 'B♭ maj',
    '10A': 'D min', '10B': 'F maj',
    '11A': 'A min', '11B': 'C maj',
    '12A': 'E min', '12B': 'G maj',
  };

  const getKeyPosition = (key: string, radius: number, index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180); // 30 degrees per key, start at top
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x: 150 + x, y: 150 + y };
  };

  const getKeyClass = (key: string) => {
    if (key === currentKey) {
      return 'fill-primary text-primary-foreground stroke-primary';
    }
    if (compatibleKeys.includes(key)) {
      return 'fill-accent/20 text-accent stroke-accent hover:fill-accent/30';
    }
    if (key.includes('A')) {
      return 'fill-camelot-minor/10 text-camelot-minor stroke-camelot-minor/50 hover:fill-camelot-minor/20';
    }
    return 'fill-camelot-major/10 text-camelot-major stroke-camelot-major/50 hover:fill-camelot-major/20';
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="text-center text-foreground">Camelot Wheel</CardTitle>
        {currentKey && (
          <p className="text-center text-sm text-muted-foreground">
            Current: <span className="text-primary font-medium">{currentKey}</span> ({keyNames[currentKey as keyof typeof keyNames]})
          </p>
        )}
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-lg">
          {/* Background circles */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            className="opacity-50"
          />
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            className="opacity-50"
          />

          {/* Outer ring (Major keys - B) */}
          {outerKeys.map((key, index) => {
            const pos = getKeyPosition(key, 100, index);
            return (
              <g key={key}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  className={`${getKeyClass(key)} cursor-pointer transition-all duration-200`}
                  strokeWidth="2"
                  onClick={() => onKeySelect?.(key)}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold pointer-events-none"
                  fill="currentColor"
                >
                  {key}
                </text>
              </g>
            );
          })}

          {/* Inner ring (Minor keys - A) */}
          {innerKeys.map((key, index) => {
            const pos = getKeyPosition(key, 60, index);
            return (
              <g key={key}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="16"
                  className={`${getKeyClass(key)} cursor-pointer transition-all duration-200`}
                  strokeWidth="2"
                  onClick={() => onKeySelect?.(key)}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold pointer-events-none"
                  fill="currentColor"
                >
                  {key}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <circle
            cx="150"
            cy="150"
            r="25"
            fill="hsl(var(--surface-elevated))"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          <text
            x="150"
            y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-foreground"
          >
            KEY
          </text>
        </svg>
      </CardContent>
    </Card>
  );
};

export default CamelotWheel;
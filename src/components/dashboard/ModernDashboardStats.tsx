import React from 'react';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Disc, 
  Clock, 
  Music, 
  TrendingUp, 
  Headphones, 
  BarChart3,
  Activity,
  Hash
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const bpmData = [
  { bpm: '90-100', count: 12 },
  { bpm: '100-110', count: 25 },
  { bpm: '110-120', count: 45 },
  { bpm: '120-130', count: 68 },
  { bpm: '130-140', count: 34 },
  { bpm: '140+', count: 18 }
];

const keyData = [
  { key: 'C', count: 24, color: 'hsl(var(--primary))' },
  { key: 'D', count: 18, color: 'hsl(var(--accent))' },
  { key: 'E', count: 22, color: 'hsl(var(--waveform))' },
  { key: 'F', count: 16, color: 'hsl(var(--cue))' },
  { key: 'G', count: 20, color: 'hsl(var(--beatgrid))' },
  { key: 'A', count: 14, color: 'hsl(var(--energy-mid))' },
  { key: 'B', count: 12, color: 'hsl(var(--energy-high))' }
];

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
};

const ModernDashboardStats: React.FC = () => {
  const stats = [
    {
      title: "Tracks Analyzed",
      value: "1,247",
      description: "Total tracks in library",
      icon: Music,
      trend: { value: 12, label: "from last month" }
    },
    {
      title: "Average BPM",
      value: "124.3",
      description: "Across all tracks",
      icon: Activity,
      trend: { value: 2.3, label: "from last week" }
    },
    {
      title: "Top Key",
      value: "8A",
      description: "A Minor (Camelot)",
      icon: Hash,
      trend: { value: 8, label: "occurrence rate" }
    },
    {
      title: "Total Duration",
      value: "127.5h",
      description: "Analyzed content",
      icon: Clock,
      trend: { value: 18, label: "from last month" }
    },
    {
      title: "Recent Sessions",
      value: "24",
      description: "This week",
      icon: Headphones,
      trend: { value: -5, label: "from last week" }
    },
    {
      title: "Average Energy",
      value: "7.2/10",
      description: "Collection energy",
      icon: TrendingUp,
      trend: { value: 0.8, label: "energy boost" }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* BPM Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                BPM Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bpmData}>
                    <XAxis 
                      dataKey="bpm" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Disc className="h-5 w-5 text-accent" />
                Key Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={keyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {keyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4">
                {keyData.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.key} ({item.count})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernDashboardStats;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music,
  TrendingUp,
  Clock,
  Disc3,
  Play,
  Upload,
  Heart
} from 'lucide-react';

const DashboardStats: React.FC = () => {
  const stats = [
    { label: 'Tracks Analyzed', value: '247', icon: Music, trend: '+12' },
    { label: 'Total Projects', value: '18', icon: Disc3, trend: '+3' },
    { label: 'Hours Mixed', value: '156', icon: Clock, trend: '+24' },
    { label: 'Playlists Created', value: '31', icon: Heart, trend: '+7' },
  ];

  const recentProjects = [
    { name: 'Summer House Mix', tracks: 24, duration: '1h 32m', key: '6A→8A', status: 'completed' },
    { name: 'Deep Techno Set', tracks: 18, duration: '58m', key: '9B→11B', status: 'in-progress' },
    { name: 'Tropical Vibes', tracks: 16, duration: '1h 12m', key: '4A→5A', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-surface border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-primary">
                      {stat.trend} this week
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex-col gap-2 bg-primary hover:bg-primary/90">
              <Upload className="w-5 h-5" />
              Analyze New Track
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <TrendingUp className="w-5 h-5" />
              Generate Playlist
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Disc3 className="w-5 h-5" />
              Build New Set
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card className="bg-surface border-border">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-foreground">Recent Projects</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">{project.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.tracks} tracks</span>
                    <span>{project.duration}</span>
                    <Badge variant="outline" className="text-xs">
                      Key: {project.key}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={project.status === 'completed' ? 'default' : 'secondary'}
                    className={project.status === 'completed' ? 'bg-primary/20 text-primary' : ''}
                  >
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDataSources } from "@/lib/mockData";
import { Database, ExternalLink, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function Sources() {
  const statusIcons = {
    online: <CheckCircle className="w-4 h-4 text-green-500" />,
    degraded: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    offline: <XCircle className="w-4 h-4 text-red-500" />,
  };

  const statusColors = {
    online: "bg-green-500/20 text-green-400 border-green-500/30",
    degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    offline: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Data Sources
          </h1>
        </div>
        <p className="text-muted-foreground">
          Status and information for connected astronomical data providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockDataSources.map((source) => (
          <Card
            key={source.id}
            className="p-6 space-y-4"
            data-testid={`card-source-${source.id.toLowerCase()}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold" data-testid="text-source-name">
                    {source.name}
                  </h3>
                  {statusIcons[source.status]}
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[source.status]}
                  data-testid="badge-source-status"
                >
                  {source.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {source.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Objects</div>
                <div className="text-lg font-semibold font-mono" data-testid="text-object-count">
                  {source.objectCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Events</div>
                <div className="text-lg font-semibold font-mono" data-testid="text-event-count">
                  {source.eventCount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-mono text-xs" data-testid="text-last-sync">
                  {format(new Date(source.lastSync), "PPp")}
                </span>
              </div>

              {source.url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                  data-testid="button-view-source"
                >
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Visit Data Portal
                  </a>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold font-mono text-primary mb-1">
              {mockDataSources.reduce((sum, s) => sum + s.objectCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Objects</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-primary mb-1">
              {mockDataSources.reduce((sum, s) => sum + s.eventCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-primary mb-1">
              {mockDataSources.filter((s) => s.status === "online").length}/
              {mockDataSources.length}
            </div>
            <div className="text-sm text-muted-foreground">Sources Online</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

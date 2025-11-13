import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPatterns } from "@/lib/mockData";
import { Network, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function Patterns() {
  const categoryColors: Record<string, string> = {
    BLACK_HOLE_CONTEXT: "bg-red-500/20 text-red-400 border-red-500/30",
    COSMIC_WEB_CLUSTER: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    EVENT_CORRELATION: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ANOMALY: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Pattern Analysis
          </h1>
        </div>
        <p className="text-muted-foreground">
          AI-detected patterns, correlations, and anomalies in cosmic data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPatterns.map((pattern) => (
          <Card
            key={pattern.id}
            className="p-6 space-y-4 hover-elevate transition-all"
            data-testid={`card-pattern-${pattern.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge
                  variant="outline"
                  className={`mb-3 ${categoryColors[pattern.category]}`}
                  data-testid="badge-pattern-category"
                >
                  {pattern.category.replace("_", " ")}
                </Badge>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-pattern-title">
                  {pattern.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pattern.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-3">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                {pattern.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {metric.label}
                    </div>
                    <div className="font-mono text-sm text-primary" data-testid={`text-metric-${idx}`}>
                      {typeof metric.value === "number"
                        ? metric.value >= 1000 || metric.value < 0.01
                          ? metric.value.toExponential(2)
                          : metric.value.toFixed(2)
                        : metric.value}
                      {metric.unit && ` ${metric.unit}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {pattern.regionHint && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-2">Sky Region</h4>
                <div className="font-mono text-xs text-muted-foreground">
                  RA: {pattern.regionHint.ra.toFixed(2)}° | Dec:{" "}
                  {pattern.regionHint.dec.toFixed(2)}° | Radius:{" "}
                  {pattern.regionHint.radiusDeg.toFixed(2)}°
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                Detected {format(new Date(pattern.createdAt), "PPp")}
              </div>
              <Button variant="ghost" size="sm" data-testid="button-view-details">
                <ExternalLink className="w-3 h-3 mr-2" />
                Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {mockPatterns.length === 0 && (
        <Card className="p-12 text-center">
          <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Patterns Detected</h3>
          <p className="text-sm text-muted-foreground">
            Pattern analysis is running. Check back soon for new discoveries.
          </p>
        </Card>
      )}
    </div>
  );
}

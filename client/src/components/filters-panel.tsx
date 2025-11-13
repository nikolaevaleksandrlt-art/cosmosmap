import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { CosmicObjectType, CosmicEventType, DataSourceId } from "@shared/schema";

interface FiltersPanelProps {
  objectTypes: CosmicObjectType[];
  eventTypes: CosmicEventType[];
  sources: DataSourceId[];
  distanceRange: [number, number];
  onObjectTypesChange: (types: CosmicObjectType[]) => void;
  onEventTypesChange: (types: CosmicEventType[]) => void;
  onSourcesChange: (sources: DataSourceId[]) => void;
  onDistanceRangeChange: (range: [number, number]) => void;
}

const allObjectTypes: CosmicObjectType[] = [
  "STAR",
  "GALAXY",
  "BLACK_HOLE",
  "NEBULA",
  "CLUSTER",
  "PLANET",
  "OTHER",
];

const allEventTypes: CosmicEventType[] = [
  "GW_EVENT",
  "GAMMA_BURST",
  "X_RAY_FLARE",
  "SUPERNOVA",
  "TRANSIT",
  "FRB",
  "OTHER",
];

const allSources: DataSourceId[] = ["NASA", "ESA", "LIGO", "GAIA", "CUSTOM"];

export function FiltersPanel({
  objectTypes,
  eventTypes,
  sources,
  distanceRange,
  onObjectTypesChange,
  onEventTypesChange,
  onSourcesChange,
  onDistanceRangeChange,
}: FiltersPanelProps) {
  const toggleObjectType = (type: CosmicObjectType) => {
    if (objectTypes.includes(type)) {
      onObjectTypesChange(objectTypes.filter((t) => t !== type));
    } else {
      onObjectTypesChange([...objectTypes, type]);
    }
  };

  const toggleEventType = (type: CosmicEventType) => {
    if (eventTypes.includes(type)) {
      onEventTypesChange(eventTypes.filter((t) => t !== type));
    } else {
      onEventTypesChange([...eventTypes, type]);
    }
  };

  const toggleSource = (source: DataSourceId) => {
    if (sources.includes(source)) {
      onSourcesChange(sources.filter((s) => s !== source));
    } else {
      onSourcesChange([...sources, source]);
    }
  };

  return (
    <Card className="p-6 space-y-6" data-testid="panel-filters">
      <div>
        <h3 className="text-sm font-semibold mb-4">Object Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {allObjectTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`obj-${type}`}
                checked={objectTypes.includes(type)}
                onCheckedChange={() => toggleObjectType(type)}
                data-testid={`checkbox-object-${type.toLowerCase()}`}
              />
              <Label
                htmlFor={`obj-${type}`}
                className="text-sm cursor-pointer flex-1"
              >
                {type.replace("_", " ")}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Event Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {allEventTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`evt-${type}`}
                checked={eventTypes.includes(type)}
                onCheckedChange={() => toggleEventType(type)}
                data-testid={`checkbox-event-${type.toLowerCase()}`}
              />
              <Label
                htmlFor={`evt-${type}`}
                className="text-sm cursor-pointer flex-1"
              >
                {type.replace("_", " ")}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Distance Range</h3>
          <Badge variant="secondary" className="font-mono text-xs" data-testid="text-distance-range">
            {distanceRange[0].toLocaleString()} - {distanceRange[1].toLocaleString()} ly
          </Badge>
        </div>
        <Slider
          value={distanceRange}
          min={0}
          max={3000000}
          step={10000}
          onValueChange={(value) =>
            onDistanceRangeChange(value as [number, number])
          }
          className="mb-2"
          data-testid="slider-distance-range"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Data Sources</h3>
        <div className="flex flex-wrap gap-2">
          {allSources.map((source) => (
            <Badge
              key={source}
              variant={sources.includes(source) ? "default" : "outline"}
              className="cursor-pointer hover-elevate"
              onClick={() => toggleSource(source)}
              data-testid={`badge-source-${source.toLowerCase()}`}
            >
              {source}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

import { useState } from "react";
import { CosmosViewer } from "@/components/cosmos-viewer";
import { ObjectDetailPanel } from "@/components/object-detail-panel";
import { FiltersPanel } from "@/components/filters-panel";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mockCosmicObjects, mockCosmicEvents } from "@/lib/mockData";
import type { CosmicObject, CosmicEvent, CosmicObjectType, CosmicEventType, DataSourceId } from "@shared/schema";

export default function Dashboard() {
  const [selectedObject, setSelectedObject] = useState<CosmicObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  // Filters
  const [objectTypes, setObjectTypes] = useState<CosmicObjectType[]>([
    "STAR",
    "GALAXY",
    "BLACK_HOLE",
    "NEBULA",
    "CLUSTER",
    "PLANET",
    "OTHER",
  ]);
  const [eventTypes, setEventTypes] = useState<CosmicEventType[]>([
    "GW_EVENT",
    "GAMMA_BURST",
    "X_RAY_FLARE",
    "SUPERNOVA",
    "TRANSIT",
    "FRB",
    "OTHER",
  ]);
  const [sources, setSources] = useState<DataSourceId[]>([
    "NASA",
    "ESA",
    "LIGO",
    "GAIA",
    "CUSTOM",
  ]);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 3000000]);

  // Filter data
  const filteredObjects = mockCosmicObjects.filter((obj) => {
    if (!objectTypes.includes(obj.type)) return false;
    if (obj.source && !sources.includes(obj.source)) return false;
    if (obj.distanceLy !== undefined) {
      if (obj.distanceLy < distanceRange[0] || obj.distanceLy > distanceRange[1]) {
        return false;
      }
    }
    return true;
  });

  const filteredEvents = mockCosmicEvents.filter((evt) => {
    if (!eventTypes.includes(evt.type)) return false;
    if (evt.source && !sources.includes(evt.source)) return false;
    return true;
  });

  const handleObjectSelect = (obj: CosmicObject | null) => {
    setSelectedObject(obj);
    setSelectedEvent(null);
    setDetailPanelOpen(!!obj);
  };

  const handleEventSelect = (evt: CosmicEvent | null) => {
    setSelectedEvent(evt);
    setSelectedObject(null);
    setDetailPanelOpen(!!evt);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar with filters */}
      <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
        <div>
          <h1 className="text-xl font-semibold" data-testid="text-page-title">
            Cosmos Explorer
          </h1>
          <p className="text-sm text-muted-foreground">
            {filteredObjects.length} objects · {filteredEvents.length} events
          </p>
        </div>

        <Sheet open={filtersPanelOpen} onOpenChange={setFiltersPanelOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" data-testid="button-filters">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
            <FiltersPanel
              objectTypes={objectTypes}
              eventTypes={eventTypes}
              sources={sources}
              distanceRange={distanceRange}
              onObjectTypesChange={setObjectTypes}
              onEventTypesChange={setEventTypes}
              onSourcesChange={setSources}
              onDistanceRangeChange={setDistanceRange}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Cosmos viewer */}
      <div className="flex-1 relative">
        <CosmosViewer
          objects={filteredObjects}
          events={filteredEvents}
          selectedObject={selectedObject}
          selectedEvent={selectedEvent}
          onObjectSelect={handleObjectSelect}
          onEventSelect={handleEventSelect}
        />
      </div>

      {/* Detail panel */}
      <ObjectDetailPanel
        object={selectedObject}
        event={selectedEvent}
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
      />
    </div>
  );
}

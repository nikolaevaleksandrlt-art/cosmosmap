import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, MapPin, Ruler, Weight } from "lucide-react";
import type { CosmicObject, CosmicEvent } from "@shared/schema";
import { format } from "date-fns";

interface ObjectDetailPanelProps {
  object?: CosmicObject | null;
  event?: CosmicEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ObjectDetailPanel({
  object,
  event,
  open,
  onOpenChange,
}: ObjectDetailPanelProps) {
  if (!object && !event) return null;

  const typeColors: Record<string, string> = {
    STAR: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    GALAXY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    BLACK_HOLE: "bg-red-500/20 text-red-400 border-red-500/30",
    NEBULA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    CLUSTER: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    PLANET: "bg-green-500/20 text-green-400 border-green-500/30",
    OTHER: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    GW_EVENT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    GAMMA_BURST: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    X_RAY_FLARE: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    SUPERNOVA: "bg-red-500/20 text-red-400 border-red-500/30",
    TRANSIT: "bg-green-500/20 text-green-400 border-green-500/30",
    FRB: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-96 overflow-y-auto" data-testid="panel-object-detail">
        {object && (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <SheetTitle className="text-xl" data-testid="text-object-name">
                    {object.name}
                  </SheetTitle>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${typeColors[object.type]}`}
                    data-testid="badge-object-type"
                  >
                    {object.type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Coordinates */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Coordinates
                </h4>
                <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Right Ascension</div>
                    <div className="text-foreground" data-testid="text-ra">
                      {object.ra.toFixed(4)}°
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Declination</div>
                    <div className="text-foreground" data-testid="text-dec">
                      {object.dec.toFixed(4)}°
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Physical Properties */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Physical Properties</h4>
                <div className="space-y-2">
                  {object.distanceLy !== undefined && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Ruler className="w-4 h-4" />
                        Distance
                      </div>
                      <div className="font-mono text-sm text-foreground" data-testid="text-distance">
                        {object.distanceLy.toLocaleString()} ly
                      </div>
                    </div>
                  )}
                  {object.massSolar !== undefined && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Weight className="w-4 h-4" />
                        Mass
                      </div>
                      <div className="font-mono text-sm text-foreground" data-testid="text-mass">
                        {object.massSolar >= 1000
                          ? `${(object.massSolar / 1000).toExponential(2)} ×10³ M☉`
                          : object.massSolar >= 1
                          ? `${object.massSolar.toFixed(2)} M☉`
                          : `${object.massSolar.toExponential(2)} M☉`}
                      </div>
                    </div>
                  )}
                  {object.redshift !== undefined && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Redshift</div>
                      <div className="font-mono text-sm text-foreground" data-testid="text-redshift">
                        z = {object.redshift.toFixed(6)}
                      </div>
                    </div>
                  )}
                  {object.hostSystemName && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Host System</div>
                      <div className="text-sm text-foreground" data-testid="text-host-system">
                        {object.hostSystemName}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Tags */}
              {object.tags && object.tags.length > 0 && (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {object.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                          data-testid={`badge-tag-${tag}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Source */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Data Source</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Provider</div>
                    <Badge variant="outline" data-testid="badge-source">
                      {object.source || "Unknown"}
                    </Badge>
                  </div>
                  {object.sourceId && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">ID</div>
                      <div className="font-mono text-xs text-foreground" data-testid="text-source-id">
                        {object.sourceId}
                      </div>
                    </div>
                  )}
                  {object.sourceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      asChild
                      data-testid="button-source-url"
                    >
                      <a href={object.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Source Data
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Metadata</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Created: {format(new Date(object.createdAt), "PPpp")}</div>
                  <div>Updated: {format(new Date(object.updatedAt), "PPpp")}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {event && (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <SheetTitle className="text-xl" data-testid="text-event-type">
                    {event.type.replace("_", " ")}
                  </SheetTitle>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${typeColors[event.type]}`}
                    data-testid="badge-event-type"
                  >
                    Event
                  </Badge>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Time */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Event Time</h4>
                <div className="font-mono text-sm text-foreground" data-testid="text-event-time">
                  {format(new Date(event.timeIso), "PPpp")}
                </div>
              </div>

              <Separator />

              {/* Coordinates */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Sky Position
                </h4>
                <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">RA</div>
                    <div className="text-foreground">{event.ra.toFixed(4)}°</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Dec</div>
                    <div className="text-foreground">{event.dec.toFixed(4)}°</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Event Properties */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Event Properties</h4>
                <div className="space-y-2">
                  {event.energy !== undefined && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Energy</div>
                      <div className="font-mono text-sm text-foreground" data-testid="text-energy">
                        {event.energy.toExponential(2)} erg
                      </div>
                    </div>
                  )}
                  {event.instrument && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Instrument</div>
                      <div className="text-sm text-foreground" data-testid="text-instrument">
                        {event.instrument}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Source */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Data Source</h4>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Provider</div>
                  <Badge variant="outline">{event.source || "Unknown"}</Badge>
                </div>
                {event.sourceId && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">ID</div>
                    <div className="font-mono text-xs text-foreground">{event.sourceId}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

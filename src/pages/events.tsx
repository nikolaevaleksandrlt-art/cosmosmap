import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ObjectDetailPanel } from "@/components/object-detail-panel";
import { Search, ArrowUpDown } from "lucide-react";
import { mockCosmicEvents } from "@/lib/mockData";
import type { CosmicEvent } from "@shared/schema";
import { format } from "date-fns";

export default function Events() {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof CosmicEvent>("timeIso");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredEvents = mockCosmicEvents
    .filter((evt) => {
      const searchLower = search.toLowerCase();
      return (
        evt.type.toLowerCase().includes(searchLower) ||
        evt.instrument?.toLowerCase().includes(searchLower) ||
        evt.source?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof CosmicEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (evt: CosmicEvent) => {
    setSelectedEvent(evt);
    setDetailPanelOpen(true);
  };

  const typeColors: Record<string, string> = {
    GW_EVENT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    GAMMA_BURST: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    X_RAY_FLARE: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    SUPERNOVA: "bg-red-500/20 text-red-400 border-red-500/30",
    TRANSIT: "bg-green-500/20 text-green-400 border-green-500/30",
    FRB: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    OTHER: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">
          Cosmic Events
        </h1>
        <p className="text-muted-foreground">
          Catalog of {mockCosmicEvents.length} astronomical events detected across the sky
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events by type, instrument, or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Badge variant="secondary" className="font-mono" data-testid="text-results-count">
            {filteredEvents.length} results
          </Badge>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("timeIso")}
                    data-testid="button-sort-time"
                  >
                    Time
                    <ArrowUpDown className="ml-2 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("type")}
                    data-testid="button-sort-type"
                  >
                    Type
                    <ArrowUpDown className="ml-2 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("energy")}
                    data-testid="button-sort-energy"
                  >
                    Energy
                    <ArrowUpDown className="ml-2 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((evt) => (
                <TableRow
                  key={evt.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleRowClick(evt)}
                  data-testid={`row-event-${evt.id}`}
                >
                  <TableCell className="font-mono text-sm" data-testid="text-event-time">
                    {format(new Date(evt.timeIso), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColors[evt.type]}>
                      {evt.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {evt.ra.toFixed(2)}°, {evt.dec.toFixed(2)}°
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {evt.energy ? `${evt.energy.toExponential(1)} erg` : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {evt.instrument || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {evt.source || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ObjectDetailPanel
        event={selectedEvent}
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
      />
    </div>
  );
}

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
import { mockCosmicObjects } from "@/lib/mockData";
import type { CosmicObject } from "@shared/schema";

export default function Objects() {
  const [search, setSearch] = useState("");
  const [selectedObject, setSelectedObject] = useState<CosmicObject | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof CosmicObject>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredObjects = mockCosmicObjects
    .filter((obj) => {
      const searchLower = search.toLowerCase();
      return (
        obj.name.toLowerCase().includes(searchLower) ||
        obj.type.toLowerCase().includes(searchLower) ||
        obj.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
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

  const handleSort = (field: keyof CosmicObject) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (obj: CosmicObject) => {
    setSelectedObject(obj);
    setDetailPanelOpen(true);
  };

  const typeColors: Record<string, string> = {
    STAR: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    GALAXY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    BLACK_HOLE: "bg-red-500/20 text-red-400 border-red-500/30",
    NEBULA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    CLUSTER: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    PLANET: "bg-green-500/20 text-green-400 border-green-500/30",
    OTHER: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">
          Cosmic Objects
        </h1>
        <p className="text-muted-foreground">
          Catalog of {mockCosmicObjects.length} astronomical objects from multiple data sources
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search objects by name, type, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Badge variant="secondary" className="font-mono" data-testid="text-results-count">
            {filteredObjects.length} results
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
                    onClick={() => handleSort("name")}
                    data-testid="button-sort-name"
                  >
                    Name
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
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("distanceLy")}
                    data-testid="button-sort-distance"
                  >
                    Distance
                    <ArrowUpDown className="ml-2 w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObjects.map((obj) => (
                <TableRow
                  key={obj.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleRowClick(obj)}
                  data-testid={`row-object-${obj.id}`}
                >
                  <TableCell className="font-medium" data-testid="text-object-name">
                    {obj.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeColors[obj.type]}>
                      {obj.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {obj.distanceLy
                      ? `${obj.distanceLy.toLocaleString()} ly`
                      : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {obj.ra.toFixed(2)}°, {obj.dec.toFixed(2)}°
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {obj.source || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {obj.tags && obj.tags.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {obj.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {obj.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{obj.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ObjectDetailPanel
        object={selectedObject}
        open={detailPanelOpen}
        onOpenChange={setDetailPanelOpen}
      />
    </div>
  );
}

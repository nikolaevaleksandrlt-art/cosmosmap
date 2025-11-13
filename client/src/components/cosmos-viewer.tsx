import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { CosmicObject, CosmicEvent } from "@shared/schema";
import { format } from "date-fns";

interface CosmosViewerProps {
  objects: CosmicObject[];
  events: CosmicEvent[];
  selectedObject?: CosmicObject | null;
  selectedEvent?: CosmicEvent | null;
  onObjectSelect?: (obj: CosmicObject | null) => void;
  onEventSelect?: (evt: CosmicEvent | null) => void;
}

export function CosmosViewer({
  objects,
  events,
  selectedObject,
  selectedEvent,
  onObjectSelect,
  onEventSelect,
}: CosmosViewerProps) {
  const [viewMode, setViewMode] = useState<string>("2d-sky");
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Calculate time range from events
  const eventTimes = events.map((e) => new Date(e.timeIso).getTime());
  const minTime = eventTimes.length > 0 ? Math.min(...eventTimes) : Date.now() - 86400000 * 30;
  const maxTime = eventTimes.length > 0 ? Math.max(...eventTimes) : Date.now();

  // Temporal playback
  useEffect(() => {
    if (viewMode === "temporal" && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 86400000; // Add 1 day
          if (next > maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, viewMode, maxTime]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvas = () => {
      // Set canvas size with device pixel ratio
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (viewMode === "2d-sky") {
        render2DSkyMap(ctx, rect.width, rect.height);
      } else if (viewMode === "deep-3d") {
        renderDeep3D(ctx, rect.width, rect.height);
      } else if (viewMode === "real-data") {
        renderRealData(ctx, rect.width, rect.height);
      } else if (viewMode === "temporal") {
        renderTemporal(ctx, rect.width, rect.height);
      }
    };

    updateCanvas();

    const resizeObserver = new ResizeObserver(updateCanvas);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [viewMode, objects, events, selectedObject, selectedEvent, zoom, currentTime]);

  const render2DSkyMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw stars in background
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw cosmic objects
    objects.forEach((obj) => {
      // Convert RA/Dec to screen coordinates (simplified projection)
      const x = ((obj.ra / 360) * width) % width;
      const y = ((90 - obj.dec) / 180) * height;

      const isSelected = selectedObject?.id === obj.id;
      const size = isSelected ? 8 : 5;

      // Color based on type
      const colors = {
        STAR: "#FDB813",
        GALAXY: "#9333EA",
        BLACK_HOLE: "#DC2626",
        NEBULA: "#06B6D4",
        CLUSTER: "#F59E0B",
        PLANET: "#10B981",
        OTHER: "#6B7280",
      };

      ctx.fillStyle = colors[obj.type];
      ctx.shadowBlur = isSelected ? 20 : 10;
      ctx.shadowColor = colors[obj.type];
      
      ctx.beginPath();
      ctx.arc(x, y, size * zoom, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;

      // Label for selected
      if (isSelected) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px Inter";
        ctx.fillText(obj.name, x + 12, y - 8);
      }
    });

    // Draw events
    events.forEach((evt) => {
      const x = ((evt.ra / 360) * width) % width;
      const y = ((90 - evt.dec) / 180) * height;

      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const renderDeep3D = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Advanced 3D visualization with perspective
    const centerX = width / 2;
    const centerY = height / 2;
    const rotation = Date.now() * 0.0001; // Slow rotation

    // Draw 3D grid with perspective
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 1;
    
    // Perspective grid
    for (let z = -500; z <= 500; z += 100) {
      const scale = 800 / (800 + z);
      const gridSize = 100 * scale;
      
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 * scale})`;
      
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - gridSize * 5, centerY + i * gridSize);
        ctx.lineTo(centerX + gridSize * 5, centerY + i * gridSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + i * gridSize, centerY - gridSize * 5);
        ctx.lineTo(centerX + i * gridSize, centerY + gridSize * 5);
        ctx.stroke();
      }
    }

    // Draw connection lines between nearby objects
    ctx.strokeStyle = "rgba(139, 92, 246, 0.1)";
    ctx.lineWidth = 0.5;
    objects.forEach((obj1, i) => {
      if (obj1.x === undefined || obj1.y === undefined || obj1.z === undefined) return;
      
      objects.slice(i + 1).forEach((obj2) => {
        if (obj2.x === undefined || obj2.y === undefined || obj2.z === undefined) return;
        
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const dz = obj1.z - obj2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 150) {
          const scale1 = 800 / (800 + obj1.z * 20);
          const scale2 = 800 / (800 + obj2.z * 20);
          
          const x1 = centerX + obj1.x * scale1 * zoom;
          const y1 = centerY - obj1.y * scale1 * zoom;
          const x2 = centerX + obj2.x * scale2 * zoom;
          const y2 = centerY - obj2.y * scale2 * zoom;
          
          ctx.globalAlpha = 0.1 * (1 - dist / 150);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });

    // Sort objects by depth (back to front)
    const sortedObjects = [...objects].sort((a, b) => {
      const za = a.z || 0;
      const zb = b.z || 0;
      return za - zb;
    });

    // Draw objects with perspective
    sortedObjects.forEach((obj) => {
      if (obj.x === undefined || obj.y === undefined || obj.z === undefined) return;

      // Perspective projection
      const perspectiveScale = 800 / (800 + obj.z * 20);
      const x = centerX + obj.x * perspectiveScale * zoom;
      const y = centerY - obj.y * perspectiveScale * zoom;

      // Size based on perspective
      const baseSize = selectedObject?.id === obj.id ? 8 : 5;
      const size = baseSize * perspectiveScale;

      const colors = {
        STAR: "#FDB813",
        GALAXY: "#9333EA",
        BLACK_HOLE: "#DC2626",
        NEBULA: "#06B6D4",
        CLUSTER: "#F59E0B",
        PLANET: "#10B981",
        OTHER: "#6B7280",
      };

      // Depth-based opacity
      const opacity = Math.max(0.2, Math.min(1, perspectiveScale));

      ctx.fillStyle = colors[obj.type];
      ctx.shadowBlur = 20 * perspectiveScale;
      ctx.shadowColor = colors[obj.type];
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add depth rings for selected objects
      if (selectedObject?.id === obj.id) {
        ctx.strokeStyle = colors[obj.type];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });
  };

  const renderRealData = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw base starfield
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 0.8;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Create density heatmap based on object distribution
    const gridSize = 50;
    const densityGrid: number[][] = [];
    const rows = Math.ceil(height / gridSize);
    const cols = Math.ceil(width / gridSize);

    for (let r = 0; r < rows; r++) {
      densityGrid[r] = new Array(cols).fill(0);
    }

    // Calculate object density per grid cell
    objects.forEach((obj) => {
      const x = ((obj.ra / 360) * width) % width;
      const y = ((90 - obj.dec) / 180) * height;
      const col = Math.floor(x / gridSize);
      const row = Math.floor(y / gridSize);
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        densityGrid[row][col] += 1;
      }
    });

    // Find max density for normalization
    let maxDensity = 0;
    densityGrid.forEach((row) => {
      row.forEach((density) => {
        if (density > maxDensity) maxDensity = density;
      });
    });

    // Draw heatmap with gradient
    densityGrid.forEach((row, r) => {
      row.forEach((density, c) => {
        if (density > 0) {
          const intensity = density / Math.max(maxDensity, 1);
          const alpha = intensity * 0.4;
          
          // Gradient from blue to red based on density
          const hue = 240 - intensity * 180; // Blue (240) to red (60)
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
          ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
        }
      });
    });

    // Draw density contours
    const contourLevels = [0.3, 0.6, 0.9];
    contourLevels.forEach((level, idx) => {
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - idx * 0.08})`;
      ctx.lineWidth = 2;

      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const density = densityGrid[r][c] / Math.max(maxDensity, 1);
          if (density >= level) {
            const x = c * gridSize;
            const y = r * gridSize;
            
            ctx.beginPath();
            ctx.rect(x, y, gridSize, gridSize);
            ctx.stroke();
          }
        }
      }
    });

    // Overlay objects with instrument-based markers
    objects.forEach((obj) => {
      const x = ((obj.ra / 360) * width) % width;
      const y = ((90 - obj.dec) / 180) * height;

      const isSelected = selectedObject?.id === obj.id;
      const size = isSelected ? 6 : 4;

      // Instrument observation indicators
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = isSelected ? 15 : 8;
      ctx.shadowColor = "#3B82F6";

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Add data quality rings
      if (obj.source) {
        const sourceColors = {
          NASA: "#3B82F6",
          ESA: "#8B5CF6",
          LIGO: "#EC4899",
          GAIA: "#10B981",
          CUSTOM: "#6B7280",
        };

        ctx.strokeStyle = sourceColors[obj.source] || "#6B7280";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Add data coverage indicators in corners
    const coverageData = [
      { label: "HST", coverage: 78, color: "#3B82F6" },
      { label: "JWST", coverage: 45, color: "#8B5CF6" },
      { label: "Chandra", coverage: 62, color: "#EC4899" },
      { label: "Gaia", coverage: 94, color: "#10B981" },
    ];

    const boxX = width - 180;
    const boxY = 20;
    const boxW = 160;
    const boxH = 120;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = "#3B82F6";
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Inter";
    ctx.fillText("Data Coverage", boxX + 10, boxY + 20);

    coverageData.forEach((item, idx) => {
      const y = boxY + 40 + idx * 18;
      ctx.fillStyle = item.color;
      ctx.fillRect(boxX + 10, y - 8, 8, 8);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "10px Inter";
      ctx.fillText(`${item.label}: ${item.coverage}%`, boxX + 24, y);
    });
  };

  const renderTemporal = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw base stars
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Filter events by current time
    const visibleEvents = events.filter((e) => {
      const eventTime = new Date(e.timeIso).getTime();
      return eventTime <= currentTime;
    });

    // Draw event trails showing temporal progression
    visibleEvents.forEach((evt) => {
      const x = ((evt.ra / 360) * width) % width;
      const y = ((90 - evt.dec) / 180) * height;

      const eventTime = new Date(evt.timeIso).getTime();
      const age = currentTime - eventTime;
      const maxAge = 30 * 86400000; // 30 days

      if (age > maxAge) return;

      // Expanding ripple effect
      const rippleRadius = (age / maxAge) * 100;
      const opacity = Math.max(0.1, 1 - age / maxAge);

      // Event type colors
      const eventColors = {
        GW_EVENT: "#3B82F6",
        GAMMA_BURST: "#EC4899",
        X_RAY_FLARE: "#8B5CF6",
        SUPERNOVA: "#EF4444",
        TRANSIT: "#10B981",
        FRB: "#6366F1",
        OTHER: "#6B7280",
      };

      const color = eventColors[evt.type] || "#3B82F6";

      // Outer ripple
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, rippleRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner pulse
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      const pulseSize = 8 + Math.sin((Date.now() / 500) + eventTime) * 3;
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Event label for recent events
      if (age < 7 * 86400000) {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "10px Inter";
        ctx.fillText(evt.type.replace("_", " "), x + 15, y - 5);
      }

      ctx.globalAlpha = 1;
    });

    // Draw timeline indicator
    const timelineY = height - 30;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, timelineY - 10, width, 50);
    
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, timelineY);
    ctx.lineTo(width - 20, timelineY);
    ctx.stroke();

    // Mark event times on timeline
    const timeSpan = Math.max(maxTime - minTime, 86400000); // At least 1 day span
    events.forEach((evt) => {
      const eventTime = new Date(evt.timeIso).getTime();
      if (eventTime > currentTime) return;
      
      const position = ((eventTime - minTime) / timeSpan) * (width - 40) + 20;
      const eventColors = {
        GW_EVENT: "#3B82F6",
        GAMMA_BURST: "#EC4899",
        X_RAY_FLARE: "#8B5CF6",
        SUPERNOVA: "#EF4444",
        TRANSIT: "#10B981",
        FRB: "#6366F1",
        OTHER: "#6B7280",
      };
      
      ctx.fillStyle = eventColors[evt.type] || "#3B82F6";
      ctx.beginPath();
      ctx.arc(position, timelineY, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Current time marker
    const currentPosition = ((currentTime - minTime) / timeSpan) * (width - 40) + 20;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(currentPosition, timelineY, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 360;
    const y = 90 - ((e.clientY - rect.top) / rect.height) * 180;

    // Find nearest object
    let nearest: CosmicObject | null = null;
    let minDist = Infinity;

    objects.forEach((obj) => {
      const dist = Math.sqrt((obj.ra - x) ** 2 + (obj.dec - y) ** 2);
      if (dist < minDist && dist < 5) {
        minDist = dist;
        nearest = obj;
      }
    });

    onObjectSelect?.(nearest);
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={viewMode} onValueChange={setViewMode} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-card border-b border-card-border">
          <TabsList className="bg-muted" data-testid="tabs-view-mode">
            <TabsTrigger value="2d-sky" data-testid="tab-2d-sky">
              2D Sky Map
            </TabsTrigger>
            <TabsTrigger value="deep-3d" data-testid="tab-deep-3d">
              Deep 3D
            </TabsTrigger>
            <TabsTrigger value="real-data" data-testid="tab-real-data">
              Real Data
            </TabsTrigger>
            <TabsTrigger value="temporal" data-testid="tab-temporal">
              Temporal
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs" data-testid="text-coordinates">
              RA: --h --m --s | Dec: --° --' --"
            </Badge>
          </div>
        </div>

        <TabsContent value="2d-sky" className="flex-1 m-0 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair"
            data-testid="canvas-cosmos"
          />
        </TabsContent>

        <TabsContent value="deep-3d" className="flex-1 m-0 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair"
            data-testid="canvas-cosmos"
          />
        </TabsContent>

        <TabsContent value="real-data" className="flex-1 m-0 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair"
            data-testid="canvas-cosmos"
          />
        </TabsContent>

        <TabsContent value="temporal" className="flex-1 m-0 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair"
            data-testid="canvas-cosmos"
          />
        </TabsContent>
      </Tabs>

      {/* Viewport Controls */}
      <Card className="absolute bottom-4 right-4 p-3 bg-card/90 backdrop-blur-xl border-card-border">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setZoom(1)}
              data-testid="button-reset-view"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" variant="ghost" data-testid="button-layers">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
        </div>
      </Card>

      {/* Temporal Controls */}
      {viewMode === "temporal" && (
        <div className="h-20 bg-card/90 backdrop-blur border-t border-card-border p-4 flex items-center gap-4">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCurrentTime(minTime)}
              data-testid="button-skip-back"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="default"
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setCurrentTime(maxTime)}
              data-testid="button-skip-forward"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              min={minTime}
              max={maxTime}
              step={86400000}
              onValueChange={([value]) => setCurrentTime(value)}
              className="flex-1"
              data-testid="slider-timeline"
            />
          </div>

          <div className="font-mono text-lg min-w-[200px] text-right" data-testid="text-current-time">
            {format(new Date(currentTime), "yyyy-MM-dd HH:mm")}
          </div>
        </div>
      )}
    </div>
  );
}

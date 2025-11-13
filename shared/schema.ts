import { z } from "zod";

export type CosmicObjectType =
  | "STAR"
  | "GALAXY"
  | "BLACK_HOLE"
  | "NEBULA"
  | "CLUSTER"
  | "PLANET"
  | "OTHER";

export type CosmicEventType =
  | "GW_EVENT"
  | "GAMMA_BURST"
  | "X_RAY_FLARE"
  | "SUPERNOVA"
  | "TRANSIT"
  | "FRB"
  | "OTHER";

export type DataSourceId = "NASA" | "ESA" | "LIGO" | "GAIA" | "CUSTOM";

export type PatternCategory =
  | "BLACK_HOLE_CONTEXT"
  | "COSMIC_WEB_CLUSTER"
  | "EVENT_CORRELATION"
  | "ANOMALY";

export interface CosmicObject {
  id: string;
  name: string;
  type: CosmicObjectType;
  ra: number;
  dec: number;
  distanceLy?: number;
  massSolar?: number;
  redshift?: number;
  hostSystemName?: string;
  tags?: string[];
  source?: DataSourceId;
  sourceId?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface CosmicEvent {
  id: string;
  type: CosmicEventType;
  timeIso: string;
  ra: number;
  dec: number;
  energy?: number;
  instrument?: string;
  relatedObjectIds?: string[];
  source?: DataSourceId;
  sourceId?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface PatternSummary {
  id: string;
  category: PatternCategory;
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: number;
    unit?: string;
  }>;
  relatedObjectIds?: string[];
  relatedEventIds?: string[];
  regionHint?: {
    ra: number;
    dec: number;
    radiusDeg: number;
  };
  createdAt: string;
}

export interface RegionSummary {
  centerRa: number;
  centerDec: number;
  radiusDeg: number;
  objectCount: number;
  eventCount: number;
  objectsByType: Record<string, number>;
  eventsByType: Record<string, number>;
  avgDensity?: number;
  topObjects: CosmicObject[];
  recentEvents: CosmicEvent[];
}

export interface DataSource {
  id: DataSourceId;
  name: string;
  status: "online" | "offline" | "degraded";
  lastSync: string;
  objectCount: number;
  eventCount: number;
  description: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const cosmicObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["STAR", "GALAXY", "BLACK_HOLE", "NEBULA", "CLUSTER", "PLANET", "OTHER"]),
  ra: z.number(),
  dec: z.number(),
  distanceLy: z.number().optional(),
  massSolar: z.number().optional(),
  redshift: z.number().optional(),
  hostSystemName: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: z.enum(["NASA", "ESA", "LIGO", "GAIA", "CUSTOM"]).optional(),
  sourceId: z.string().optional(),
  sourceUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional(),
});

export const cosmicEventSchema = z.object({
  id: z.string(),
  type: z.enum(["GW_EVENT", "GAMMA_BURST", "X_RAY_FLARE", "SUPERNOVA", "TRANSIT", "FRB", "OTHER"]),
  timeIso: z.string(),
  ra: z.number(),
  dec: z.number(),
  energy: z.number().optional(),
  instrument: z.string().optional(),
  relatedObjectIds: z.array(z.string()).optional(),
  source: z.enum(["NASA", "ESA", "LIGO", "GAIA", "CUSTOM"]).optional(),
  sourceId: z.string().optional(),
  sourceUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

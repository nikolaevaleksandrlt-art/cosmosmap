// Centralized color constants for cosmic object and event types
// Uses consistent theming throughout the application

export const OBJECT_TYPE_COLORS = {
  STAR: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  GALAXY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  BLACK_HOLE: "bg-red-500/20 text-red-400 border-red-500/30",
  NEBULA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  CLUSTER: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  PLANET: "bg-green-500/20 text-green-400 border-green-500/30",
  OTHER: "bg-gray-500/20 text-gray-400 border-gray-500/30",
} as const;

export const EVENT_TYPE_COLORS = {
  GW_EVENT: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  GAMMA_BURST: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  X_RAY_FLARE: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  SUPERNOVA: "bg-red-500/20 text-red-400 border-red-500/30",
  TRANSIT: "bg-green-500/20 text-green-400 border-green-500/30",
  FRB: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  OTHER: "bg-gray-500/20 text-gray-400 border-gray-500/30",
} as const;

export const PATTERN_CATEGORY_COLORS = {
  BLACK_HOLE_CONTEXT: "bg-red-500/20 text-red-400 border-red-500/30",
  COSMIC_WEB_CLUSTER: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  EVENT_CORRELATION: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ANOMALY: "bg-orange-500/20 text-orange-400 border-orange-500/30",
} as const;

export const DATA_SOURCE_STATUS_COLORS = {
  online: "bg-green-500/20 text-green-400 border-green-500/30",
  degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  offline: "bg-red-500/20 text-red-400 border-red-500/30",
} as const;

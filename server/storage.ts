import { 
  type CosmicObject, 
  type CosmicEvent, 
  type PatternSummary, 
  type DataSource 
} from "@shared/schema";
import { mockCosmicObjects, mockCosmicEvents, mockPatterns, mockDataSources } from "../client/src/lib/mockData";

export interface IStorage {
  // Cosmic Objects
  getAllObjects(): Promise<CosmicObject[]>;
  getObjectById(id: string): Promise<CosmicObject | undefined>;
  getObjectsByType(type: CosmicObject["type"]): Promise<CosmicObject[]>;
  
  // Cosmic Events
  getAllEvents(): Promise<CosmicEvent[]>;
  getEventById(id: string): Promise<CosmicEvent | undefined>;
  getEventsByType(type: CosmicEvent["type"]): Promise<CosmicEvent[]>;
  
  // Patterns
  getAllPatterns(): Promise<PatternSummary[]>;
  
  // Data Sources
  getAllSources(): Promise<DataSource[]>;
}

export class MemStorage implements IStorage {
  private objects: Map<string, CosmicObject>;
  private events: Map<string, CosmicEvent>;
  private patterns: PatternSummary[];
  private sources: DataSource[];

  constructor() {
    // Initialize with mock data
    this.objects = new Map(mockCosmicObjects.map(obj => [obj.id, obj]));
    this.events = new Map(mockCosmicEvents.map(evt => [evt.id, evt]));
    this.patterns = [...mockPatterns];
    this.sources = [...mockDataSources];
  }

  async getAllObjects(): Promise<CosmicObject[]> {
    return Array.from(this.objects.values());
  }

  async getObjectById(id: string): Promise<CosmicObject | undefined> {
    return this.objects.get(id);
  }

  async getObjectsByType(type: CosmicObject["type"]): Promise<CosmicObject[]> {
    return Array.from(this.objects.values()).filter(obj => obj.type === type);
  }

  async getAllEvents(): Promise<CosmicEvent[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: string): Promise<CosmicEvent | undefined> {
    return this.events.get(id);
  }

  async getEventsByType(type: CosmicEvent["type"]): Promise<CosmicEvent[]> {
    return Array.from(this.events.values()).filter(evt => evt.type === type);
  }

  async getAllPatterns(): Promise<PatternSummary[]> {
    return this.patterns;
  }

  async getAllSources(): Promise<DataSource[]> {
    return this.sources;
  }
}

export const storage = new MemStorage();

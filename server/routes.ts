import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cosmic Objects endpoints
  app.get("/api/objects", async (req, res) => {
    try {
      const { type } = req.query;
      
      if (type && typeof type === "string") {
        const validTypes = ["STAR", "GALAXY", "BLACK_HOLE", "NEBULA", "CLUSTER", "PLANET", "OTHER"];
        if (validTypes.includes(type)) {
          const objects = await storage.getObjectsByType(type as any);
          return res.json(objects);
        }
      }
      
      const objects = await storage.getAllObjects();
      res.json(objects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch objects" });
    }
  });

  app.get("/api/objects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const object = await storage.getObjectById(id);
      
      if (!object) {
        return res.status(404).json({ error: "Object not found" });
      }
      
      res.json(object);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch object" });
    }
  });

  // Cosmic Events endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const { type } = req.query;
      
      if (type && typeof type === "string") {
        const validTypes = ["GW_EVENT", "GAMMA_BURST", "X_RAY_FLARE", "SUPERNOVA", "TRANSIT", "FRB", "OTHER"];
        if (validTypes.includes(type)) {
          const events = await storage.getEventsByType(type as any);
          return res.json(events);
        }
      }
      
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Patterns endpoint
  app.get("/api/patterns", async (req, res) => {
    try {
      const patterns = await storage.getAllPatterns();
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patterns" });
    }
  });

  // Data Sources endpoint
  app.get("/api/sources", async (req, res) => {
    try {
      const sources = await storage.getAllSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data sources" });
    }
  });

  // AI Chat endpoint
  const chatRequestSchema = z.object({
    message: z.string().min(1),
    context: z.object({
      selectedObject: z.string().optional(),
      selectedEvent: z.string().optional(),
    }).optional(),
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const validation = chatRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request", details: validation.error });
      }
      
      const { message, context } = validation.data;
      
      // Simulate AI response with context awareness
      let response = `I understand you're asking about: "${message}". `;
      
      if (context?.selectedObject) {
        const obj = await storage.getObjectById(context.selectedObject);
        if (obj) {
          response += `Regarding ${obj.name}, this is a ${obj.type} located at coordinates (RA: ${obj.ra}°, Dec: ${obj.dec}°). `;
        }
      }
      
      if (context?.selectedEvent) {
        const evt = await storage.getEventById(context.selectedEvent);
        if (evt) {
          response += `The ${evt.type} event occurred at ${new Date(evt.timeIso).toLocaleString()}. `;
        }
      }
      
      response += "As an AI assistant for cosmic exploration, I can help you analyze astronomical data, explain celestial phenomena, and navigate the universe. What would you like to know?";
      
      res.json({ 
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

export interface EventCategory {
  id: number;
  title: string;
}

export interface EventGeometry {
  date?: string;
  type: string;
  coordinates: number[];
}

export interface EventSource {
  id: string;
  url: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  link?: string;
  categories: EventCategory[];
  geometries: EventGeometry[];
  sources: EventSource[];
  closed?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  events?: Event[];
  timestamp: string;
}

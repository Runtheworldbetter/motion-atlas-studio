export const TRACE_LIMITS = {
  characters: 20000,
  events: 18,
  actors: 4,
  actorLength: 32,
  labelLength: 140,
  detailLength: 400,
} as const;

export const TRACE_STATUSES = ['info', 'working', 'success', 'warning', 'error'] as const;
export type TraceStatus = typeof TRACE_STATUSES[number];
export interface TraceEvent {
  time: number;
  actor: string;
  label: string;
  status: TraceStatus;
  detail: string;
  originalIndex: number;
}
export interface TraceModel {
  title: string;
  events: TraceEvent[];
  actors: string[];
  start: number;
  end: number;
  span: number;
}

function boundedText(value: unknown, name: string, limit: number, required = true): string {
  if (typeof value !== 'string' || (required && !value.trim())) {
    throw new Error(`${name} must be ${required ? 'a nonempty' : 'a'} string.`);
  }
  const text = value.trim();
  if (text.length > limit) throw new Error(`${name} must be ${limit} characters or fewer.`);
  return text;
}

export function parseTrace(input: string): TraceModel {
  if (input.length > TRACE_LIMITS.characters) throw new Error('Keep the trace below 20,000 characters.');
  let raw: unknown;
  try {raw = JSON.parse(input);} catch {throw new Error('Enter valid JSON with an events array.');}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('The trace must be an object with an events array.');
  }
  const source = raw as Record<string, unknown>;
  if (!Array.isArray(source.events) || source.events.length < 2 || source.events.length > TRACE_LIMITS.events) {
    throw new Error('Use between 2 and 18 events.');
  }
  const title = source.title === undefined ? 'Your event trace' : boundedText(source.title, 'Title', 72);
  const events = source.events.map((rawEvent, index): TraceEvent => {
    const name = `Event ${index + 1}`;
    if (!rawEvent || typeof rawEvent !== 'object' || Array.isArray(rawEvent)) {
      throw new Error(`${name} must be an object.`);
    }
    const event = rawEvent as Record<string, unknown>;
    if (typeof event.time !== 'number' || !Number.isFinite(event.time) || event.time < 0 || event.time > 86400) {
      throw new Error(`${name}: time must be elapsed seconds from 0 to 86,400.`);
    }
    const status = event.status === undefined ? 'info' : event.status;
    if (!TRACE_STATUSES.includes(status as TraceStatus)) {
      throw new Error(`${name}: status must be info, working, success, warning, or error.`);
    }
    return {
      time: event.time,
      actor: boundedText(event.actor, `${name} actor`, TRACE_LIMITS.actorLength),
      label: boundedText(event.label, `${name} label`, TRACE_LIMITS.labelLength),
      status: status as TraceStatus,
      detail: event.detail === undefined ? '' : boundedText(event.detail, `${name} detail`, TRACE_LIMITS.detailLength, false),
      originalIndex: index,
    };
  }).sort((a, b) => a.time - b.time || a.originalIndex - b.originalIndex);
  const actors = [...new Set(events.map(event => event.actor))];
  if (actors.length > TRACE_LIMITS.actors) throw new Error('Use at most 4 actors so every lane stays readable.');
  const start = events[0].time;
  const end = events[events.length - 1].time;
  return {title, events, actors, start, end, span: end - start};
}

export function formatTraceTime(seconds: number): string {
  if (seconds < 60) return `${Number(seconds.toFixed(3))}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Number((seconds % 60).toFixed(3));
  return `${minutes}m ${remainder}s`;
}

/** Spacing uses event time. Equal-time events share a timestamp, without inventing an order. */
export function tracePosition(model: TraceModel, event: TraceEvent): number {
  return model.span === 0 ? 0.5 : (event.time - model.start) / model.span;
}

export interface Preference {vote: -1 | 0 | 1; note: string;}
export type Preferences = Record<string, Preference>;
export const PREFERENCE_KEY = 'motion-atlas-public-preferences-v2';

export function validatePreferences(value: unknown, validIds: ReadonlySet<string>): Preferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a preferences object.');
  const input = value as Record<string, unknown>;
  const result: Preferences = {};
  for (const [id, item] of Object.entries(input)) {
    if (!validIds.has(id)) continue;
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Invalid preference for ${id}.`);
    const row = item as Record<string, unknown>;
    if (![-1, 0, 1].includes(row.vote as number) || typeof row.note !== 'string' || row.note.length > 1200) {
      throw new Error(`Invalid vote or note for ${id}. Notes can contain at most 1,200 characters.`);
    }
    result[id] = {vote: row.vote as -1 | 0 | 1, note: row.note};
  }
  return result;
}

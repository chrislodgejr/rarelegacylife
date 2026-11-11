// Spam signals for the public forms. The contact form bots seen since 2026-10-10 send one word of
// random letters as the name ("aBcDeFgHiJkLmNoP": 16 to 24 letters, 6 or more capitals mixed in).
// Real names have spaces or at most a couple of inner capitals (McDonald, DeAngelo, even VanDerWerffMcDonald run together has 5).
export function looksLikeRandomName(name: string): boolean {
  const trimmed = name.trim();
  if (/\s/.test(trimmed) || trimmed.length < 12) return false;
  const capitals = trimmed.replace(/[^A-Z]/g, "").length;
  return capitals >= 6 && /[a-z][A-Z]/.test(trimmed);
}

// How long the form was open before it was sent: bots post at once, or replay an old page.
export function sentTooFastOrStale(startedAtRaw: unknown): boolean {
  const startedAt = Number(startedAtRaw);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  const elapsed = Date.now() - startedAt;
  return elapsed < 2_000 || elapsed > 4 * 60 * 60 * 1_000;
}

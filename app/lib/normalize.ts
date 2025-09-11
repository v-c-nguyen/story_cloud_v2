export default function normalize(input: any): string {
  if (input === undefined || input === null) return "";
  const s = typeof input === "string" ? input : String(input);
  return s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

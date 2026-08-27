export const categories = [
  "Elektronikk",
  "Møbler",
  "Fritid",
  "Klær",
  "Musikk",
  "Annet",
] as const;


// Useful TypeScript type based on the list above
export type Category = (typeof categories)[number];


// Converts URL slugs to the actual category names
export const categoryMap: Record<string, Category> = {
  elektronikk: "Elektronikk",
  mobler: "Møbler",
  fritid: "Fritid",
  klaer: "Klær",
  musikk: "Musikk",
  annet: "Annet",
};
export const pageHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — [Temple Name]` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — [Temple Name]` },
    { property: "og:description", content: description },
  ],
});

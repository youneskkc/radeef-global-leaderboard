import fs from "node:fs/promises";

const file = new URL("../client/src/data/rankings.json", import.meta.url);
const data = JSON.parse(await fs.readFile(file, "utf8"));
const key = process.env.OPENPAGERANK_API_KEY;
if (!key) throw new Error("OPENPAGERANK_API_KEY is required");

const response = await fetch("https://openpagerank.keywordseverywhere.com/v1/domains/bulk", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ domains: data.sites.map((site) => site.domain), include_history: false }),
});
if (!response.ok) throw new Error(`OpenPageRank returned HTTP ${response.status}`);
const payload = await response.json();
const byDomain = new Map(payload.results.map((item) => [item.domain, item]));
const byHost = new Map();
for (const item of payload.results) for (const host of item.hosts ?? []) byHost.set(host.host, host);

for (const site of data.sites) {
  const result = byHost.get(site.domain) ?? byDomain.get(site.domain);
  site.score = result?.found ? result.open_page_rank : null;
  site.rank = result?.found ? result.rank : null;
  site.rankUniverse = byHost.has(site.domain) ? "hosts" : "domains";
}
const ranked = [...data.sites].sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || (a.rank ?? Infinity) - (b.rank ?? Infinity));
ranked.forEach((site, index) => { site.position = index + 1; });
data.sites = ranked;
data.asOf = payload.as_of ?? new Date().toISOString().slice(0, 10);
data.updatedAt = new Date().toISOString();
await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
console.log(`Updated ${data.sites.length} sites; ${data.sites.filter((site) => site.score !== null).length} ranked; as_of=${data.asOf}`);

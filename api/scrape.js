// api/scrape.js
// Vercel serverless function — runs Node.js server-side, no CORS issues.
// Fetches a ScryCheck deck result page and returns parsed deck data as JSON.
//
// Usage: GET /api/scrape?url=https://scrycheck.com/deck/abc123

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;

  // Validate: must be a scrycheck.com/deck/ URL
  if (!url || !url.startsWith("https://scrycheck.com/deck/")) {
    return res.status(400).json({
      error: "Invalid URL. Must be a ScryCheck deck result URL (https://scrycheck.com/deck/...)",
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PodCheck/1.0; +https://pod-check.vercel.app)",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `ScryCheck returned ${response.status}` });
    }

    const html = await response.text();

    const data = parseDeckPage(html, url);

    if (!data.power && !data.commander) {
      return res.status(422).json({ error: "Could not parse deck data from ScryCheck page." });
    }

    // Cache for 5 minutes — ScryCheck results don't change often
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Scrape error:", err);
    return res.status(500).json({ error: "Failed to fetch ScryCheck page." });
  }
}

function decodeEntities(str) {
  if (!str) return str;
  return str
    .replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseDeckPage(html, url) {
  // ── Commander name ──────────────────────────────────────────────────────
  // Title format: "Commander Name — Power X.X | ScryCheck"
  const titleMatch = html.match(/<title>([^<]+?)\s*(?:—|–|-)\s*Power/i);
  const h1Match = html.match(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/i);
  let commander = titleMatch?.[1]?.trim() || h1Match?.[1]?.trim() || "Unknown Commander";
  // Decode HTML entities and strip trailing " Commander Deck Analysis" suffix
  commander = decodeEntities(commander).replace(/\s*Commander Deck Analysis.*$/i, "").trim();

  // ── Power level ─────────────────────────────────────────────────────────
  // Title format is always "Commander Name — Power 4.6 | ScryCheck"
  const titlePowerMatch = html.match(/Power\s+([\d.]+)\s*\|/i);
  const power = titlePowerMatch ? parseFloat(titlePowerMatch[1]) : null;

  // ── Margin of error ─────────────────────────────────────────────────────
  const marginMatch = html.match(/\d+\.\d+(?:±|&plusmn;|&#177;)([\d.]+)/);
  const margin = marginMatch ? parseFloat(marginMatch[1]) : null;

  // ── Tier label ──────────────────────────────────────────────────────────
  const tierMatch = html.match(
    /(cEDH|Fringe cEDH|High Power|Playing with Power|Deck With a Plan|Casual|Upgraded Precon|Precon|First Draft|Pile)/i
  );
  const tier = tierMatch?.[1] || null;

  // ── Bracket ─────────────────────────────────────────────────────────────
  // "Bracket 3" or "B3" pattern near the bracket section
  const bracketMatch = html.match(/Bracket\s+(\d)/i) || html.match(/·B(\d)\b/);
  const bracket = bracketMatch ? parseInt(bracketMatch[1]) : null;

  // ── Vectors ─────────────────────────────────────────────────────────────
  // Each vector score appears right after its label, e.g. "Speed\n48\n48"
  // The HTML typically has them as  Speed</...>48  etc.
  function extractVector(label) {
    // Match label followed shortly by a 1-3 digit number
    const re = new RegExp(label + "[\\s\\S]{0,60}?(\\d{1,3})(?=\\D)", "i");
    const m = html.match(re);
    if (!m) return null;
    const val = parseInt(m[1]);
    return val >= 0 && val <= 100 ? val : null;
  }

  const vectors = {
    speed: extractVector("Speed"),
    consistency: extractVector("Consistency"),
    interaction: extractVector("Interaction"),
    manaBase: extractVector("Mana base"),
    threats: extractVector("Threats"),
  };

  // ── Win turn ────────────────────────────────────────────────────────────
  const winMatch = html.match(/T(\d+)\s*(?:best|typical)/i);
  const winTurn = winMatch ? parseInt(winMatch[1]) : null;

  // ── Combos ──────────────────────────────────────────────────────────────
  const combosMatch = html.match(/(\d+)\s*(?:combo|combos)\s*(?:total|detected)/i);
  const combos = combosMatch ? parseInt(combosMatch[1]) : 0;

  // ── Game changers ───────────────────────────────────────────────────────
  const gcMatch = html.match(/(\d+)\s*Game [Cc]hanger/);
  const gameChangers = gcMatch ? parseInt(gcMatch[1]) : 0;

  return {
    commander,
    power,
    margin,
    tier,
    bracket,
    vectors,
    winTurn,
    combos,
    gameChangers,
    scrychecUrl: url,
  };
}

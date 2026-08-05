const SOURCE_URL = "https://raw.githubusercontent.com/puneetdixit200/placements26/main/data/placements.json";

export async function GET() {
  const response = await fetch(SOURCE_URL, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return Response.json(
      { error: "Unable to load placement data", status: response.status },
      { status: 502 },
    );
  }

  const data = await response.json();

  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

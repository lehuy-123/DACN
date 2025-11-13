import fetch from "node-fetch";

export async function getRealRoute(start, end, apiKey) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features) {
    console.error("Route fetch error:", data);
    return [];
  }

  const coords = data.features[0].geometry.coordinates;
  return coords.map(([lng, lat]) => ({ lat, lng }));
}

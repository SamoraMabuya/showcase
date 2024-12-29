// app/api/plaiceholder/route.ts
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return new Response("Image URL is required", { status: 400 });
    }

    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return Response.json({ blurDataURL: base64 });
  } catch (error) {
    console.error("Plaiceholder error:", error);
    return Response.json({ error: "Failed to generate blur" }, { status: 500 });
  }
}

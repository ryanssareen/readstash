import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ReadStash/1.0; +https://readstash.vercel.app)",
      },
    });

    clearTimeout(timeout);

    const html = await res.text();

    const getMetaContent = (property: string): string | null => {
      const patterns = [
        new RegExp(
          `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
          "i"
        ),
        new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
          "i"
        ),
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return match[1];
      }
      return null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title =
      getMetaContent("og:title") ||
      getMetaContent("twitter:title") ||
      titleMatch?.[1]?.trim() ||
      "";

    const description =
      getMetaContent("og:description") ||
      getMetaContent("twitter:description") ||
      getMetaContent("description") ||
      "";

    const image =
      getMetaContent("og:image") || getMetaContent("twitter:image") || null;

    let domain: string;
    try {
      domain = new URL(url).hostname.replace("www.", "");
    } catch {
      domain = url;
    }

    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    return NextResponse.json({ title, description, image, favicon });
  } catch {
    return NextResponse.json(
      { title: "", description: "", image: null, favicon: null },
      { status: 200 }
    );
  }
}

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Extract video ID
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (!match) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const videoId = match[1];

  try {
    // Fetch the YouTube page to get captions info
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await pageRes.text();

    // Extract captions JSON from the page
    const captionsMatch = html.match(/"captions":\s*({.*?"playerCaptionsTracklistRenderer".*?})\s*,\s*"videoDetails"/s);
    if (!captionsMatch) {
      return res.status(404).json({ error: "이 영상에서 자막을 찾을 수 없습니다" });
    }

    let captionsData: any;
    try {
      captionsData = JSON.parse(captionsMatch[1]);
    } catch {
      return res.status(404).json({ error: "자막 데이터를 파싱할 수 없습니다" });
    }

    const tracks =
      captionsData?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!tracks || tracks.length === 0) {
      return res.status(404).json({ error: "이 영상에서 자막을 찾을 수 없습니다" });
    }

    // Prefer English captions
    const englishTrack =
      tracks.find((t: any) => t.languageCode === "en") ||
      tracks.find((t: any) => t.languageCode?.startsWith("en")) ||
      tracks[0];

    if (!englishTrack?.baseUrl) {
      return res.status(404).json({ error: "영어 자막을 찾을 수 없습니다" });
    }

    // Fetch the caption XML
    const captionRes = await fetch(englishTrack.baseUrl);
    const captionXml = await captionRes.text();

    // Parse XML to extract text
    const textSegments: string[] = [];
    const segmentRegex = /<text[^>]*>(.*?)<\/text>/gs;
    let segMatch;
    while ((segMatch = segmentRegex.exec(captionXml)) !== null) {
      const decoded = segMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, " ")
        .trim();
      if (decoded) textSegments.push(decoded);
    }

    if (textSegments.length === 0) {
      return res.status(404).json({ error: "자막 내용이 비어있습니다" });
    }

    const transcript = textSegments.join(" ");
    return res.status(200).json({ transcript });
  } catch (err) {
    console.error("YouTube transcript error:", err);
    return res.status(500).json({ error: "자막을 불러오는 중 오류가 발생했습니다" });
  }
}

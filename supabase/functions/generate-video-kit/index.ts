import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    if (status === 402) throw new Error("AI usage credits required. Please add credits to your workspace.");
    const text = await response.text();
    throw new Error(`AI request failed: ${status} — ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { article, tone } = await req.json();

    if (!article || typeof article !== "string") {
      return new Response(
        JSON.stringify({ error: "Article text is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedArticle = article.slice(0, 15000).trim();
    const selectedTone = tone || "Neutral";

    // Step 1: Generate Script
    const scriptPrompt = `Summarize the following article into a 60-90 second engaging news narration script.

Structure:
- Hook (first 5–10 seconds)
- Main Key Points
- Context
- Closing statement

Tone: ${selectedTone}

Article:
${sanitizedArticle}

Return clean narration text only. No scene labels, no headers, just the narration.`;

    const script = await callAI(LOVABLE_API_KEY, scriptPrompt);

    // Step 2: Scene Breakdown
    const scenePrompt = `Break the following script into exactly 6 short scenes.

For each scene provide:
- Scene number (1-6)
- Narration text (the portion of the script for this scene)
- Visual description suggestion (what should appear on screen)

Return valid JSON only. Format:
{
  "scenes": [
    {
      "scene": 1,
      "narration": "...",
      "visual": "..."
    }
  ]
}

Script:
${script}`;

    const sceneRaw = await callAI(LOVABLE_API_KEY, scenePrompt);
    let scenes = null;
    try {
      const jsonMatch = sceneRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scenes = JSON.parse(jsonMatch[0]);
      }
    } catch {
      scenes = { scenes: [] };
    }

    // Step 3: Subtitle SRT
    const srtPrompt = `Convert the following narration script into SRT subtitle format for a 60-90 second video.
Generate realistic timestamps starting from 00:00:00,000.
Each subtitle block should be 2-5 seconds long with 1-2 short lines of text.

Return only valid SRT formatted text. No explanations, just the SRT content.

Script:
${script}`;

    const subtitles = await callAI(LOVABLE_API_KEY, srtPrompt);

    // Step 4: Thumbnail Ideas
    const thumbnailPrompt = `Based on the following news script, generate:
- 5 engaging YouTube title ideas (compelling and click-worthy)
- 3 thumbnail text overlays (maximum 5 words each, punchy and bold)

Return valid JSON only. Format:
{
  "titles": ["title1", "title2", "title3", "title4", "title5"],
  "thumbnails": ["text1", "text2", "text3"]
}

Script:
${script}`;

    const thumbnailRaw = await callAI(LOVABLE_API_KEY, thumbnailPrompt);
    let thumbnails = null;
    try {
      const jsonMatch = thumbnailRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        thumbnails = JSON.parse(jsonMatch[0]);
      }
    } catch {
      thumbnails = { titles: [], thumbnails: [] };
    }

    return new Response(
      JSON.stringify({
        script,
        scenes: scenes?.scenes ?? [],
        subtitles,
        titles: thumbnails?.titles ?? [],
        thumbnailTexts: thumbnails?.thumbnails ?? [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-video-kit error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST API for generating trends
app.post("/api/generate-trends", async (req, res) => {
  if (!ai) {
    return res.status(400).json({
      error: "Missing Gemini API Key.",
      suggestion: "Please add your GEMINI_API_KEY in the Secrets panel in AI Studio settings.",
    });
  }

  const { niche, description, audience, tone, count = 5 } = req.body;

  if (!niche) {
    return res.status(400).json({ error: "Niche is required." });
  }

  try {
    const prompt = `You are a high-level social media virality expert and short-form video content director.
Generate a list of exactly ${count} highly optimized, trending, and viral short-form video concepts tailored for the "${niche}" niche.
Description of creator/brand/context: ${description || "General short-form creator"}
Target Audience: ${audience || "General social media viewers, digital natives"}
Brand/Content Tone: ${tone || "Highly engaging, high energy, captivating"}

Craft each concept such that it is engineered to optimize watch time, trigger comments or shares, and trigger algorithmic reach on both YouTube Shorts and Instagram Reels.

Organize the response strictly as a JSON object matching the requested schema. Ensure the scripts include detailed visual actions, pacing guidelines, B-roll recommendations, and exact dialogue that keeps the run-time under 60 seconds (strictly pacing for short-form).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are the world's best Short-Form Video Producer and Virality Agent.
Your job is to generate trend ideas, specific verbal hooks, trending audio styles, full scripts under 60 seconds, custom action-driven CTAs, hashtags, and keywords.
You write highly engaging, original hook lines. Your scripts contain stage direction in brackets [like this] and spoken dialogue to make it super ready for production.
Each video idea must have precise reach analysis for YouTube Shorts and Instagram Reels respectively to help the user understand how to distribute and optimize.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["trends"],
          properties: {
            trends: {
              type: Type.ARRAY,
              description: "List of viral video trends generated based on creator parameters",
              items: {
                type: Type.OBJECT,
                required: [
                  "id",
                  "video_concept",
                  "audio_trend",
                  "hook",
                  "hashtags",
                  "script",
                  "cta",
                  "keywords",
                  "yt_potential",
                  "yt_reason",
                  "ig_potential",
                  "ig_reason",
                  "niche_suitability"
                ],
                properties: {
                  id: {
                    type: Type.STRING,
                    description: "A short unique alphanumeric string or incremental ID like T1, T2"
                  },
                  video_concept: {
                    type: Type.STRING,
                    description: "High-level visual concept and framing format (e.g. 'The 3 Step Reveal', 'Shattering a Myth')"
                  },
                  audio_trend: {
                    type: Type.STRING,
                    description: "The audio trend style (e.g., 'Uplifting cinematic low-fi beat', 'Fast-cut cinematic bass drops with specific audio timing', 'Original sound voiceover with trending synth pad')"
                  },
                  hook: {
                    type: Type.STRING,
                    description: "The physical and verbal hook for the first 1-3 seconds. Must be extremely high conversion and catch attention immediately."
                  },
                  hashtags: {
                    type: Type.STRING,
                    description: "Space-separated or comma-separated hashtags tailored to modern shorts/reels algorithms (mix of broad, mid, and hyper-targeted)."
                  },
                  script: {
                    type: Type.STRING,
                    description: "Complete verbatim script including staging cues [Bracketed physical action or B-roll description] and spoken lines. Must be paced to be under 45-60 seconds when read aloud."
                  },
                  cta: {
                    type: Type.STRING,
                    description: "High-engagement Call-To-Action (e.g. 'Comment SECRETS and I'll dm you the link', 'Share this with a friend who needs to stop wasting time')"
                  },
                  keywords: {
                    type: Type.STRING,
                    description: "A list of 5-8 SEO-friendly search keywords separated by commas."
                  },
                  yt_potential: {
                    type: Type.INTEGER,
                    description: "YouTube Shorts search/recommendation algorithm potential from 1 (low) to 10 (exceptionally high viral probability)."
                  },
                  yt_reason: {
                    type: Type.STRING,
                    description: "Detailed reason for the YT rating (e.g. search habits, retention markers, specific Shorts shelf trends)."
                  },
                  ig_potential: {
                    type: Type.INTEGER,
                    description: "Instagram Reels audio/explore algorithm potential from 1 (low) to 10 (exceptionally high viral probability)."
                  },
                  ig_reason: {
                    type: Type.STRING,
                    description: "Detailed reason for the IG rating (e.g. trending audios hubs, visual aesthetic match, shareability in DMs)."
                  },
                  niche_suitability: {
                    type: Type.STRING,
                    description: "Snippet explaining why this specific video directly links back to the selected creator niche and builds follower trust."
                  }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No data returned from Gemini.");
    }

    const data = JSON.parse(responseText.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Trend Generation Error:", error);
    return res.status(500).json({
      error: "Failed to generate trends due to content filtering or API error.",
      details: error.message || String(error),
    });
  }
});

// REST API for generating multi-day social challenge series
app.post("/api/generate-challenge", async (req, res) => {
  if (!ai) {
    return res.status(400).json({
      error: "Missing Gemini API Key.",
      suggestion: "Please add your GEMINI_API_KEY in the Secrets panel in AI Studio settings.",
    });
  }

  const { niche, challengeType = "30 Day Series Growth Challenge", audience, tone, daysCount = 30 } = req.body;

  if (!niche) {
    return res.status(400).json({ error: "Niche is required." });
  }

  try {
    const prompt = `You are a world-class viral growth strategist specializing in high-retention multi-part serial short-form videos.
Generate a structured, day-by-day chronological schedule for a social media challenge titled "${challengeType}" consisting of exactly ${daysCount} individual days of content, specifically tailored for the "${niche}" niche.

Target audience: ${audience || "General social media viewers searching for useful daily videos"}
Content voice & tone: ${tone || "Engaging and actionable"}

For each day, output an innovative video outline engineered to build compounding user loyalty across the ${daysCount}-day challenge cycle. Each entry must provide high value, specific hooks, specific audio directions, CTAs, and optimized hashtags.
Ensure the entries are creative and diverse (e.g. myths, mistakes, hacks, deep-dives, stories) so it keeps viewers returning for the next episode.
Format your output strictly using the requested JSON schema. Restrict long descriptions to keep the JSON concise and prevent truncation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are the master of short-form series formatting (e.g. 'Day X out of ${daysCount} of proving/teaching...').
Every day of your generated calendar must feel valuable on its own, yet keep the viewer hooked to see the rest of the playlist.
Structure the results clearly and focus directly on the chosen creator niche (${niche}). Keep the responses extremely organized.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["seriesName", "niche", "targetAudience", "days"],
          properties: {
            seriesName: {
              type: Type.STRING,
              description: "The name of the social media challenge series (e.g., '30-Day Nutritional Shift Challenge')"
            },
            niche: {
              type: Type.STRING,
              description: "The social media category targeted"
            },
            targetAudience: {
              type: Type.STRING
            },
            days: {
              type: Type.ARRAY,
              description: `Exactly ${daysCount} chronological sequence day entries. Every entry must map Day 1 to Day ${daysCount} strictly.`,
              items: {
                type: Type.OBJECT,
                required: [
                  "day",
                  "title",
                  "concept",
                  "hook",
                  "audio_sound",
                  "hashtags",
                  "cta",
                  "keywords",
                  "vibe_action",
                  "platform_reach"
                ],
                properties: {
                  day: {
                    type: Type.INTEGER,
                    description: "Chronological day number from 1 to the end"
                  },
                  title: {
                    type: Type.STRING,
                    description: "Catchy title for this specific day's theme"
                  },
                  concept: {
                    type: Type.STRING,
                    description: "Crisp short-form concept format."
                  },
                  hook: {
                    type: Type.STRING,
                    description: "First verbal statement (e.g. 'This is Day 1 of uncovering astrology secrets...')"
                  },
                  audio_sound: {
                    type: Type.STRING,
                    description: "Sound design recommendation or trending beat style."
                  },
                  hashtags: {
                    type: Type.STRING,
                    description: "Viral hashtags separated by spaces."
                  },
                  cta: {
                    type: Type.STRING,
                    description: "Interactive CTA (e.g. 'Comment CHART and I'll send you the calculator link')"
                  },
                  keywords: {
                    type: Type.STRING,
                    description: "Search keywords separated by commas."
                  },
                  vibe_action: {
                    type: Type.STRING,
                    description: "Visual cues or filming directions for creator."
                  },
                  platform_reach: {
                    type: Type.STRING,
                    description: "Algorithmic advantage (e.g., 'YouTube Shorts Advantage', 'Instagram Reels Advantage', 'Balanced Fit')"
                  }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No data returned from Gemini.");
    }

    const data = JSON.parse(responseText.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Challenge Generation Error:", error);
    return res.status(500).json({
      error: "Failed to generate social challenge due to size limits or server error.",
      details: error.message || String(error),
    });
  }
});

// Configure Vite or Static Assets Static Server base on environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Express with Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static site in Cloud Run...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Viral Trend Agent server running on http://localhost:${PORT}`);
  });
}

setupServer();

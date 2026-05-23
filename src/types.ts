export interface Trend {
  id: string; // T1, T2, etc.
  video_concept: string;
  audio_trend: string;
  hook: string;
  hashtags: string;
  script: string;
  cta: string;
  keywords: string;
  yt_potential: number; // 1 to 10
  yt_reason: string;
  ig_potential: number; // 1 to 10
  ig_reason: string;
  niche_suitability: string;
}

export interface GeneratorParams {
  niche: string;
  description: string;
  audience: string;
  tone: string;
  count: number;
}

export interface ChallengeDay {
  day: number;
  title: string;
  concept: string;
  hook: string;
  audio_sound: string;
  hashtags: string;
  cta: string;
  keywords: string;
  vibe_action: string;
  platform_reach: string; // e.g. "YouTube Shorts Advantage", "Instagram Reels Advantage", "Both Platforms Balanced"
}

export interface ChallengeSeries {
  seriesName: string; // e.g. "30 Day Series Growth Challenge", "75 Day Hard Challenge"
  niche: string;
  targetAudience: string;
  days: ChallengeDay[];
}


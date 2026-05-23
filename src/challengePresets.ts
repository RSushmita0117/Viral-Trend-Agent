import { ChallengeDay, ChallengeSeries } from "./types";

// Procedural generator to instantly create 30 or 75 days of customized content for any custom niche
export function generateLocalChallenge(
  niche: string,
  challengeType: "30 Day Series Growth Challenge" | "75 Day Hard Challenge",
  audience: string,
  tone: string
): ChallengeSeries {
  const daysCount = challengeType === "75 Day Hard Challenge" ? 75 : 30;
  
  // Custom templates based on the niche string matching or fallback
  const nicheLower = niche.toLowerCase();
  
  let themePrefix = "Growth Hack";
  let promptCategory = "social metrics";
  let hooksList: string[] = [];
  let videoConcepts: string[] = [];
  let ctas: string[] = [];

  if (nicheLower.includes("nutri") || nicheLower.includes("diet") || nicheLower.includes("food")) {
    themePrefix = "Nutritional Hack";
    promptCategory = "nutrition and metabolic speed";
    hooksList = [
      "Stop eating your regular breakfast! Do this instead of ruining your metabolism.",
      "The invisible ingredient that is making you feel constantly bloated.",
      "Day X of showing you foods you thought were healthy, but actually inflate your fat cells.",
      "How I prepped 5 high-protein meals for literally under six dollars.",
      "If you crave sweet things at 9 PM, your body is begging you for this mineral.",
      "The exact food timing trick that bodybuilders use to look twice as lean.",
      "Drink this exact warm morning concoction to switch your digestion to hyperdrive."
    ];
    videoConcepts = [
      "Shattering a processed food myth with low-fi greenscreen comparison",
      "Fast-cut macro mealprep tutorial with timing stamps",
      "Grocery cart breakdown of toxic additives to stay away from",
      "Double cups test: High sugar juice vs actual fruit pulp visual comparison",
      "The clean gut breakfast platter live assembly with calorie math"
    ];
    ctas = [
      "Comment METABOLISM and I'll dm you my weekly meal prep map!",
      "Share this with a friend who is trying to heal their gut this month.",
      "Save this guide if you are tired of empty nutrition promises.",
      "Follow to complete this nutrition series with me daily!"
    ];
  } else if (nicheLower.includes("fit") || nicheLower.includes("gym") || nicheLower.includes("train") || nicheLower.includes("workout")) {
    themePrefix = "Fitness Core";
    promptCategory = "athletic gains, strength, and biomechanics";
    hooksList = [
      "This is why your lower back hurts during squats! Let's fix that stance.",
      "Day X of teaching you how to build real muscle without spending 2 hours in the gym.",
      "Why your biceps aren't growing? You are doing this major mistake.",
      "The cheat code to getting your first pull-up in exactly three weeks.",
      "Do this 5-minute activation drill before you touch the barbell today.",
      "The science-backed recovery method that works 10x better than ice baths.",
      "This single wrist-angle adjustment instantly doubled my lat activation."
    ];
    videoConcepts = [
      "Side-by-side stance comparison explaining joint load",
      "Cinematic tempo training with aggressive bass drops to highlight contractions",
      "The 3-Step home mobility warmup for maximum range of motion",
      "Busting common posture mistakes with red and green overlays",
      "Revealing cheap home workout accessories with real efficiency scores"
    ];
    ctas = [
      "Comment WORKOUT and I'll send you my secret chest day spreadsheet!",
      "Tag your gym partner who keeps skipping their warmups.",
      "Follow to unlock the remaining days of this physique series.",
      "Save this video so you can reference it during your next push workout!"
    ];
  } else if (nicheLower.includes("creator") || nicheLower.includes("business") || nicheLower.includes("saas") || nicheLower.includes("marketing")) {
    themePrefix = "Creator Growth";
    promptCategory = "algorithmic distribution and audience retention hooks";
    hooksList = [
      "Your first 3 seconds are completely boring, and here is how to fix it.",
      "Day X of proving that anyone can gain 10k followers with raw FaceTime style videos.",
      "The digital tool that basically writes your TikTok scripts automatically.",
      "We analyzed 100 viral videos and this is the creepy pattern they all shared.",
      "Stop chasing perfect aesthetic editing. Authentic talking head is crushing it.",
      "The secret B-roll timing that double-hooks the viewer's low attention span.",
      "I changed my Instagram call-to-action to this phrase and leads shot up by 200%."
    ];
    videoConcepts = [
      "Splitscreen comparison: Boring hook vs. high engagement hook",
      "Raw screen share of digital growth tools with speed indicators",
      "Analyzing a viral creator's exact hook timings with overlay timers",
      "Aesthetic workspace setup demonstrating audio sync secrets",
      "Whiteboard workflow demonstrating how to turn comments into clients"
    ];
    ctas = [
      "Comment VIRAL and I will dm you our entire capcut preset list!",
      "Share this secret with another creator who is tired of low-view jail.",
      "Save this right now before the algorithm removes this secret hack.",
      "Follow for daily short-form hacks that actually pay creators real cash."
    ];
  } else if (nicheLower.includes("teach") || nicheLower.includes("learn") || nicheLower.includes("skill") || nicheLower.includes("educat")) {
    themePrefix = "Skill Teaching";
    promptCategory = "rapid learning shortcuts and cognitive recall";
    hooksList = [
      "Stop trying to memorize words! Do this brain-association trick instead.",
      "Day X of proving you can learn Spanish in 10 minutes of active micro-drills.",
      "This simple memory method is what genius students use to ace exams.",
      "The worst way to practice a new hobby, and the immediate science bypass.",
      "Learn the most important 20% of this skill that will get you 80% of results.",
      "If you want to speak like a native, you need to stop translating in your head.",
      "Use this active recall trick before you sleep to double memory storage."
    ];
    videoConcepts = [
      "Writing a prompt/word on a tablet with clean visual overlay translations",
      "A side-by-side comparison of active memory vs passive reading",
      "5-second fast-spaced quiz challenges to test user recall speeds",
      "Cinematic study ambience with structured timestamp breakdowns",
      "Demonstrating the 'Feynman Technique' on a digital whiteboard live"
    ];
    ctas = [
      "Comment FLUENT and I'll send you our 30-day language habit map!",
      "Share this with a fellow student who has a big exam coming up.",
      "Save this video so you can repeat this micro-quiz tomorrow morning.",
      "Follow to unlock everyday hacks to learn any complex skill instantly."
    ];
  } else if (nicheLower.includes("psych") || nicheLower.includes("stoic") || nicheLower.includes("mind") || nicheLower.includes("brain")) {
    themePrefix = "Psychology Core";
    promptCategory = "cognitive filters, sub-conscious triggers, and emotional shielding";
    hooksList = [
      "The psychological trick to know if someone is lying to you in 5 seconds.",
      "Day X of practicing modern Stoicism to build bulletproof mental toughness.",
      "Why your brain seeks comfort, and how that is keeping you broke of energy.",
      "The '2-Minute Rule' to immediately delete overthinking and take action.",
      "How to read anyone's body language instantly without pointing out the obvious.",
      "If you feel anxious in social settings, use this simple focal point hack.",
      "The silent habit that kills your focus faster than checking social media."
    ];
    videoConcepts = [
      "Calm, high-contrast black-background cinematic speaking with captions",
      "Demonstrating subconscious spacing gestures side-by-side",
      "Slow macro nature shot reflecting on resilience quote overlays",
      "Visualizing dopamine loops on a black tablet drawing",
      "Silent stoic walks with profound subtitle reflections and warm tones"
    ];
    ctas = [
      "Comment MINDSET and I will send you our daily stoic meditation calendar.",
      "Share this with someone who is currently battling heavy overthinking.",
      "Save this mental prompt to review before you get out of bed tomorrow.",
      "Follow to strengthen your internal psychological shields every day."
    ];
  } else if (nicheLower.includes("astro") || nicheLower.includes("star") || nicheLower.includes("tarot") || nicheLower.includes("sign")) {
    themePrefix = "Astrology Hub";
    promptCategory = "birth-chart dynamics, celestial alignments, and cosmic energy forecasting";
    hooksList = [
      "If your solar sign is here, this major planetary shift is going to hit you hard.",
      "Day X of explaining how to read your birth chart without hiring a cosmic psychic.",
      "The real reason why you are feeling so incredibly chaotic this week.",
      "What your moon sign actually says about how you handle secret arguments.",
      "If you have this specific placement, congratulations, your luck is about to pivot.",
      "Why your relationship feels out of sync right now, based on Venus movements.",
      "The biggest lie you've been told about Mercury retrograde and how to exploit it."
    ];
    videoConcepts = [
      "Cosmic stellar background with birth chart layout overlays",
      "Tapping tarot cards with warm candlelights and custom text stickers",
      "Detailed zoom into planetary transits with highlight circles",
      "Point-by-point zodiac ranking board with energetic colors",
      "Cozy close-up talking head revealing hidden energy markers"
    ];
    ctas = [
      "Comment CHART and I will run your exact placement details for the month!",
      "Tag a stubborn Taurus or emotional Cancer who needs to hear this.",
      "Save this cosmic warning to guide your choices over the next 48 hours.",
      "Follow to align your daily actions with the universal stellar movements."
    ];
  } else {
    // General high-conversion defaults
    themePrefix = `${niche.substring(0, 15)} Series`;
    promptCategory = `${niche} specific masterclass templates`;
    hooksList = [
      `This is Day X of proving that anyone can master the ${niche} domain!`,
      `The biggest mistake people keep making in ${niche} that ruins daily progress.`,
      `My secret formula to save 5 hours a week in ${niche} using simple automation.`,
      `Stop doing this outdated layout if you want to succeed in ${niche}!`,
      `How professionals actually map out their ${niche} structure in 3 quick steps.`,
      `If you are trying to perfect your ${niche} routine, look at this secret hack.`,
      `The ultimate tool that solves 90% of your problems when dealing with ${niche}.`
    ];
    videoConcepts = [
      "High-contrast screenshare of expert tools and productivity scores",
      "Point-by-point breakdown with beautiful whiteboard doodles",
      "The 3-Step home tutorial for intermediate and advanced amateurs",
      "Busting common amateur mistakes using interactive red and green overlays",
      "Shattering a myth with real-time before and after case study results"
    ];
    ctas = [
      `Comment ${niche.slice(0, 5).toUpperCase()} and I'll dm you our complete guide!`,
      "Share this video with a friend who is trying to level up in this area today.",
      "Save this to implement in your upcoming content planning sessions.",
      "Follow to keep getting these practical daily video breakdowns!"
    ];
  }

  const days: ChallengeDay[] = [];
  
  for (let i = 1; i <= daysCount; i++) {
    // Deterministic selection based on index to create beautiful, realistic, diverse days
    const hookTemplate = hooksList[(i - 1) % hooksList.length];
    const hook = hookTemplate.replace("Day X", `Day ${i}`);
    
    // Day themes / Progression
    let title = "";
    if (i === 1) {
      title = "The Catalyst Day: Sledgehammer Hook";
    } else if (i === daysCount) {
      title = `The Grand Finale: Conversion & Celebration`;
    } else if (i % 7 === 0) {
      title = `Weekly Milestone: The Myth Shatterer`;
    } else if (i % 3 === 0) {
      title = `${themePrefix}: The Secret Formula`;
    } else if (i % 5 === 0) {
      title = `Behind the Scenes: Shocking Mistakes`;
    } else {
      title = `${themePrefix}: Micro-Hack #${i}`;
    }

    const concept = videoConcepts[(i - 1) % videoConcepts.length];
    const cta = ctas[(i - 1) % ctas.length];
    
    // Vary audios
    const audios = [
      "Tense cinematic strings building volume rapidly",
      "Upbeat low-fi synth keyboard with subtle vinyl crackle",
      "Fast phonk hip-hop beat centered around cinematic bass drops",
      "Dreamy guitar arpeggios mapping premium storytelling aesthetics",
      "Energetic electronic riser aligned with dramatic typography pops"
    ];
    const audio_sound = audios[(i - 1) % audios.length];

    // Platforms
    const platforms = [
      "YouTube Shorts Advantage",
      "Instagram Reels Advantage",
      "Balanced Engagement Fit"
    ];
    const platform_reach = platforms[(i - 1) % platforms.length];

    // Tags & Keywords
    const hashtags = `#${themePrefix.toLowerCase().replace(" ", "")} #${nicheLower.replace(/[^a-z]/g, "")} #day${i} #growthchallenge #shorts #reels`;
    const keywords = `${themePrefix.toLowerCase()}, ${nicheLower} guidelines, viral daily content, micro learn, day ${i} challenge`;
    
    const vibeActions = [
      "Keep hands visible in frame to foster personal connection. Cut frame slightly zoom-in at 0:03.",
      "Start with a strong visual motion towards the camera. Add rapid typing sound effect in hook.",
      "Use green screen backdrop of statistical charts, point out values with direct eye contact.",
      "Aesthetic close up of action hand, macro shots editing or assembling with text subtitles.",
      "Direct eye-contact FaceTime camera, speak slightly lower and slower to increase emotional tone."
    ];
    const vibe_action = vibeActions[(i - 1) % vibeActions.length];

    days.push({
      day: i,
      title,
      concept,
      hook,
      audio_sound,
      hashtags,
      cta,
      keywords,
      vibe_action,
      platform_reach
    });
  }

  return {
    seriesName: `${challengeType} - ${niche} Niche Engine`,
    niche: niche,
    targetAudience: audience || "General Social Content Viewers",
    days
  };
}

// Pre-defined challenge suites representing different niches directly
export const STATIC_CHALLENGE_PRESETS = {
  nutrition: generateLocalChallenge("Nutritional hacks", "30 Day Series Growth Challenge", "Busy parents, athletes, and desk workers trying to heal digestion", "Cozy, highly authoritative & mythbusting"),
  fitness: generateLocalChallenge("Fitness & Gym workouts", "75 Day Hard Challenge", "Busy college students and post-grad desk workers", "Motivational, physical, science-backed"),
  creator: generateLocalChallenge("Creator & SaaS Marketing", "30 Day Series Growth Challenge", "Freelance video editors, SaaS founders, and side-hustlers", "Punchy, fast-cut, direct-benefit"),
  teaching: generateLocalChallenge("Language & Skills teaching", "30 Day Series Growth Challenge", "Ambitious students, self-learners, polyglots", "Interactive, engaging, easy mnemonic hacks"),
  psychology: generateLocalChallenge("Stoic & Practical Psychology", "30 Day Series Growth Challenge", "Overthinkers, busy executives seeking stoic guidance", "Deep, warm voiceover, minimal aesthetic"),
  astrology: generateLocalChallenge("Astrology & birth charts", "30 Day Series Growth Challenge", "Zodiac trackers, spiritual explorers, high-vibe seekers", "Celestial, cozy, conversational, highly relatable")
};

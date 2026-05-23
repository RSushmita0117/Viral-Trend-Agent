import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  FileSpreadsheet, 
  TrendingUp, 
  Tv, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle, 
  ArrowUpDown, 
  Sliders, 
  RefreshCw, 
  HelpCircle, 
  HelpCircle as QuestionIcon,
  Zap, 
  Chrome,
  Flame,
  User,
  AlertCircle,
  Video,
  ExternalLink,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Trend, GeneratorParams, ChallengeDay, ChallengeSeries } from "./types";
import { generateLocalChallenge } from "./challengePresets";

// Dynamic content creation tips to display on loading
const VIRAL_TIPS = [
  "Standard hook duration should be under 2.5 seconds to prevent viewers from scrolling past.",
  "Include B-Roll or high-contrast visual cuts every 2.5 - 3 seconds to reset user attention spans.",
  "Align sound effects or bass drops with text transitions to double Reel algorithmic reach.",
  "Direct viewers to comment a 'TRIGGER WORD' in the CTA to force algorithm comments-to-view ratios.",
  "Using a looping video structure where the end seamlessly flows back to the hook multiplies watch time.",
  "YouTube Shorts search algorithm prioritizes descriptive keywords in both title and the script's raw metadata.",
  "Instagram Reels rewards native share-button clicks—crafting concepts that trigger 'I must send this to my friend' excels."
];

// Presets for Creator Niches
const NICHE_PRESETS = [
  {
    icon: "🤖",
    label: "AI productivity",
    niche: "AI Productivity & Web Hacks",
    description: "Finding mindblowing automatic AI tools, browser shortcuts, and custom GPT prompts that save virtual assistants and creators 10+ hours a week.",
    audience: "Freelancers, designers, junior developers, busy remote creators, tech hobbyists.",
    tone: "Analytical, incredibly high-energy, value-dense, fast-cut, direct-benefit.",
  },
  {
    icon: "💵",
    label: "Finance Niche",
    niche: "Gen Z Personal Finance & Side Hustles",
    description: "Actionable budgeting hacks, breaking down investment trends for beginners, and uncovering secondary income stream experiments without the finance gurus jargon.",
    audience: "Millennials and Gen Z looking to attain early financial independence and escape 9-to-5 fatigue.",
    tone: "Empathetic, structured, visual-heavy, engaging, relatable with clever pop-culture punchlines.",
  },
  {
    icon: "🏋️‍♂️",
    label: "Gym & Fitness",
    niche: "High-Calorie Muscle Building Nutrition",
    description: "Cheap bulk-up grocery lists, simple protein shake recipes, and science-backed gym forms without fitness-influencer elitism.",
    audience: "Busy college students, desk workers, and young gym beginners looking for practical weight-gaining workflows.",
    tone: "Humorous, direct, physical, motivational, scientific but simple.",
  },
  {
    icon: "✈️",
    label: "Aesthetic Travel",
    niche: "Aesthetic Solo Travel & Hidden Gems",
    description: "Cinematic, eye-catching solo travel guides, highlighting hidden budget stays and secret, quiet villages across Europe.",
    audience: "Wanderlust-driven solo female travelers, remote working digital nomads, adventure enthusiasts.",
    tone: "Atmospheric, cozy, visual-focused, relaxed, storytelling, deeply elegant.",
  }
];

// Mock database to populate if API is not initialized or fails gracefully (so app is always fully interactive)
const INITIAL_DEMO_DATA: Trend[] = [
  {
    id: "T1",
    video_concept: "The 3-Second Rule Illusion",
    audio_trend: "Hypnotic synth pad [Start building volume at 0:02 to match the sudden reveal]",
    hook: "This single trick will save your next content project from completely dying! 👇",
    hashtags: "#creators #contentgrowth #editingsecrets #reelsgrowth #youtubeshorts",
    script: "[0:00 - Close-up of phone screen playing a blurry video]\nSpeaker: 'Stop spending hours on video scripts! Do this 3-second sequence instead.'\n[0:05 - Fast zoom cut to high contrast whiteboard drawing]\nSpeaker: 'Take your hook, frame it as an urgent danger, then show a 1-second B-Roll reset. Let me prove why this works...'",
    cta: "Comment SECRET and I'll send you our 10-step editing checklist instantly in your DMs!",
    keywords: "short form algorithm, watch time optimization, social media retention hacks",
    yt_potential: 9,
    yt_reason: "High keyword intent, people search for 'algorithm growth secrets' and the retention B-Roll keeps them locked in.",
    ig_potential: 8,
    ig_reason: "Aesthetic contrast performs well on Reels Explore grid, and comment-trigger increases explore delivery.",
    niche_suitability: "Directly solves the primary pain point of video editing retention for creators and freelancers."
  },
  {
    id: "T2",
    video_concept: "Myths We All Blindly Believe",
    audio_trend: "Deep organic low-fi beat [Drop the bass sharp at 0:03 sync with the screen text stomp]",
    hook: "Everything you got told about short-form virality is a complete lie! ❌",
    hashtags: "#shortform #creatorskills #videotutorials #igalgorithm #reelstips",
    script: "[0:00 - Pointing upwards to a big bold text bubble saying: SHIELD KEYWARDS]\nSpeaker: 'You do not need high production cameras! In fact, raw and cellular videos often gain 3x the reach.'\n[0:08 - Green screen overlay showing low-production viral video statistics]\nSpeaker: 'Here is the math: viewer empathy is higher when it feels like a real friend FaceTime audio...'",
    cta: "Save this video for your next filming batch so you don't ruin your pacing!",
    keywords: "editing with smartphone, vertical video standards, low production virality",
    yt_potential: 8,
    yt_reason: "Algorithm rewards cell-captured storytelling if the average viewer retention stays high through relatable visual pace.",
    ig_potential: 9,
    ig_reason: "Insanely high shareability! Creators will send this directly to fellow creators in Instagram Direct Messages.",
    niche_suitability: "Demystifies barrier to entry, building immediate trust and organic value for the niche focus."
  }
];

export default function App() {
  const [params, setParams] = useState<GeneratorParams>({
    niche: "AI Productivity & Social Marketing",
    description: "Revealing productivity shortcuts and modern tools that speed up standard creator work.",
    audience: "Freelancers, designers, junior creators, digital assistants.",
    tone: "High Energy & Direct",
    count: 5
  });

  const [trends, setTrends] = useState<Trend[]>(INITIAL_DEMO_DATA);
  const [selectedTrendId, setSelectedTrendId] = useState<string>("T1");
  const [activeTab, setActiveTab] = useState<"sheet" | "challenge" | "insights" | "teleprompter">("sheet");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState<boolean>(false);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Custom Challenge State Management
  const [challengeType, setChallengeType] = useState<"30 Day Series Growth Challenge" | "75 Day Hard Challenge">("30 Day Series Growth Challenge");
  const [challengeNiche, setChallengeNiche] = useState<string>("Creator & SaaS Marketing");
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeSeries>(() => 
    generateLocalChallenge("Creator & SaaS Marketing", "30 Day Series Growth Challenge", "Freelancers, designers, and remote developers", "High Energy & Bold")
  );
  const [selectedChallengeDay, setSelectedChallengeDay] = useState<number>(1);
  const [copyChallengeState, setCopyChallengeState] = useState<boolean>(false);
  
  // Spreadsheet States
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Trend } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [sortField, setSortField] = useState<"yt_potential" | "ig_potential" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [copystate, setCopystate] = useState<boolean>(false);
  const [isNewRowModalOpen, setIsNewRowModalOpen] = useState<boolean>(false);
  const [showCopyGuide, setShowCopyGuide] = useState<boolean>(false);

  // Advice dynamic cycler during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % VIRAL_TIPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Load niche preset helper
  const applyPreset = (preset: typeof NICHE_PRESETS[0]) => {
    setParams({
      niche: preset.niche,
      description: preset.description,
      audience: preset.audience,
      tone: preset.tone,
      count: 5
    });
  };

  // Sort helper
  const handleSort = (field: "yt_potential" | "ig_potential") => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortField(field);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const getSortedTrends = () => {
    if (!trends) return [];
    if (!sortField) return trends;
    
    return [...trends].sort((a, b) => {
      const aVal = Number(a[sortField]) || 0;
      const bVal = Number(b[sortField]) || 0;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  // API Trend Generation Handler
  const generateViralTrends = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/generate-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate trends from backend.");
      }

      if (data.trends && Array.isArray(data.trends)) {
        setTrends(data.trends);
        if (data.trends.length > 0) {
          setSelectedTrendId(data.trends[0].id);
        }
      } else {
        throw new Error("Invalid response format. Missing trends array.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong during generation. Using demo fallback parameters.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Challenge Series Generation Trigger
  const generateChallengeSeries = async (nicheToUse?: string, typeToUse?: typeof challengeType) => {
    setIsGeneratingChallenge(true);
    setErrorMessage(null);
    const targetNiche = nicheToUse || challengeNiche;
    const targetType = typeToUse || challengeType;
    const expectedDays = targetType === "75 Day Hard Challenge" ? 75 : 30;
    try {
      const response = await fetch("/api/generate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: targetNiche,
          challengeType: targetType,
          audience: params.audience,
          tone: params.tone,
          daysCount: expectedDays
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate challenge from backend.");
      }

      if (data.days && Array.isArray(data.days)) {
        setCurrentChallenge(data);
        setSelectedChallengeDay(1);
      } else {
        throw new Error("Invalid challenge format returned from AI model.");
      }
    } catch (err: any) {
      console.warn("Using offline challenge fallback generator due to:", err.message);
      // Fallback cleanly to high-fidelity procedural local generator
      const fallback = generateLocalChallenge(targetNiche, targetType, params.audience, params.tone);
      setCurrentChallenge(fallback);
      setSelectedChallengeDay(1);
      // Clear error or show minimal friendly warning
    } finally {
      setIsGeneratingChallenge(false);
    }
  };

  // TSV formatted copier for perfect copy-paste into Google Sheets
  const copyChallengeForGoogleSheets = () => {
    if (!currentChallenge || !currentChallenge.days || currentChallenge.days.length === 0) return;
    const headers = [
      "Challenge Day",
      "Episode Title",
      "Viral Hook Line (First 3s)",
      "Video Concept & Formatting",
      "Cinematic Audio style",
      "Interactive CTA Hook",
      "Visual Filming Action Directions",
      "Algorithmic Distribution Advantage",
      "SEO Search Keywords",
      "Viral Hashtags"
    ];

    const rows = currentChallenge.days.map(d => [
      `Day ${d.day}`,
      d.title,
      d.hook,
      d.concept,
      d.audio_sound,
      d.cta,
      d.vibe_action,
      d.platform_reach,
      d.keywords,
      d.hashtags
    ]);

    const tsvContent = [
      headers.join("\t"),
      ...rows.map(row => row.map(cell => {
        const cleanCell = cell === undefined || cell === null ? "" : String(cell);
        return cleanCell.replace(/\t/g, " ").replace(/\n/g, "  ");
      }).join("\t"))
    ].join("\n");

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopyChallengeState(true);
      setTimeout(() => setCopyChallengeState(false), 3000);
    });
  };

  // Downloader for CSV format
  const downloadChallengeCSV = () => {
    if (!currentChallenge || !currentChallenge.days || currentChallenge.days.length === 0) return;
    const headers = [
      "Challenge Day",
      "Episode Title",
      "Viral Hook Line",
      "Video Concept",
      "Cinematic Audio",
      "Interactive CTA Hook",
      "Visual Directions",
      "Algorithmic Advantage",
      "SEO Search Keywords",
      "Viral Hashtags"
    ];

    const rows = currentChallenge.days.map(d => [
      `Day ${d.day}`,
      d.title,
      d.hook,
      d.concept,
      d.audio_sound,
      d.cta,
      d.vibe_action,
      d.platform_reach,
      d.keywords,
      d.hashtags
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const cleanFileName = `Social_Challenge_${targetTypeToFilename(challengeType)}_${challengeNiche.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
    link.setAttribute("download", cleanFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function targetTypeToFilename(typeStr: string) {
    return typeStr.toLowerCase().replace(/[^a-z0-9]/g, "_");
  }

  // CSV Exporter
  const downloadCSV = () => {
    if (!trends || trends.length === 0) return;
    const headers = [
      "Concepts ID",
      "Video Concept",
      "Audio Trend Style",
      "Attention Hook (0-3s)",
      "Verbatim Script & Directions",
      "CTA Hook",
      "Viral Hashtags",
      "SEO Keywords",
      "Youtube Potential (1-10)",
      "YT Retention Factors",
      "Instagram Potential (1-10)",
      "IG Reels Logic",
      "Niche Strategy Match"
    ];

    const rows = trends.map(t => [
      t.id,
      t.video_concept,
      t.audio_trend,
      t.hook,
      t.script,
      t.cta,
      t.hashtags,
      t.keywords,
      t.yt_potential,
      t.yt_reason,
      t.ig_potential,
      t.ig_reason,
      t.niche_suitability
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const cleanFileName = `Trends_Sheet_${params.niche.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`;
    link.setAttribute("download", cleanFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tab-Separated Values Copier (Direct clipboard-to-Google Sheets perfect alignment helper)
  const copyForGoogleSheets = () => {
    if (!trends || trends.length === 0) return;
    const headers = [
      "ID",
      "Video Concept",
      "Audio Trend Style",
      "Attention Hook (0-3s)",
      "Verbatim Script & Video Actions",
      "CTA Hook",
      "Viral Hashtags",
      "SEO Search Keywords",
      "YouTube Shorts Score (1-10)",
      "YT Retention Factors",
      "Instagram Reels Score (1-10)",
      "IG Algorithm Logic",
      "Niche Match Strategy"
    ];

    const rows = trends.map(t => [
      t.id,
      t.video_concept,
      t.audio_trend,
      t.hook,
      t.script,
      t.cta,
      t.hashtags,
      t.keywords,
      t.yt_potential,
      t.yt_reason,
      t.ig_potential,
      t.ig_reason,
      t.niche_suitability
    ]);

    const tsvContent = [
      headers.join("\t"),
      ...rows.map(row => row.map(cell => {
        const cleanCell = cell === undefined || cell === null ? "" : String(cell);
        // Replace tabs and long newlines with space to keep standard cell limits clean
        return cleanCell.replace(/\t/g, " ").replace(/\n/g, "  ");
      }).join("\t"))
    ].join("\n");

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopystate(true);
      setTimeout(() => setCopystate(false), 3000);
    });
  };

  // Inline Cell Grid Update Helper
  const startEditing = (id: string, field: keyof Trend, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEditedCell = () => {
    if (!editingCell) return;
    const { id, field } = editingCell;
    setTrends(prev => {
      if (!prev) return [];
      return prev.map(t => {
        if (t.id === id) {
          // Keep score inputs parsed cleanly if editing score cells
          if (field === "yt_potential" || field === "ig_potential") {
            const parsed = parseInt(editValue);
            return { ...t, [field]: isNaN(parsed) ? 5 : Math.max(1, Math.min(10, parsed)) };
          }
          return { ...t, [field]: editValue };
        }
        return t;
      });
    });
    setEditingCell(null);
  };

  // Add Custom Trend Row
  const addBlankRow = () => {
    const newId = `T${(trends?.length || 0) + 1}`;
    const newRow: Trend = {
      id: newId,
      video_concept: "New Custom Video Idea",
      audio_trend: "Trending Lo-fi sound wave effect",
      hook: "Add your hooks here...",
      hashtags: "#newtrend #shorts #viral",
      script: "[0:00 - Close-up scene]\nSpeaker: Type dialogue details here...",
      cta: "Follow for daily micro lessons!",
      keywords: "custom keywords, seo tags",
      yt_potential: 7,
      yt_reason: "High retention blueprint format.",
      ig_potential: 7,
      ig_reason: "Strong community engagement hooks.",
      niche_suitability: "Custom fit for targeted follower growth."
    };
    setTrends(prev => [...(prev || []), newRow]);
    setSelectedTrendId(newId);
  };

  // Delete designated Trend Row
  const deleteRow = (id: string) => {
    if (trends.length <= 1) {
      alert("Please keep at least one viral idea row in your calendar.");
      return;
    }
    const filtered = trends.filter(t => t.id !== id);
    setTrends(filtered);
    if (selectedTrendId === id && filtered.length > 0) {
      setSelectedTrendId(filtered[0].id);
    }
  };

  const selectedTrend = trends.find(t => t.id === selectedTrendId) || trends[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900" id="main_app_wrapper">
      {/* Top Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 transition-shadow duration-200 shadow-xs" id="app_navbar_container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 ring-2 ring-white" id="brand_icon_circle">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                Viral Trend Agent <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full border border-indigo-100 font-sans">Active Sandbox</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Short-form Video virality producer, scripting engine & spreadsheet planner.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Copy Trigger */}
            <button 
              onClick={copyForGoogleSheets}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer ${
                copystate 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-inner" 
                  : "bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 hover:shadow-sm"
              }`}
              title="Copy spreadsheet tab data to clip"
              id="copy_sheets_button"
            >
              {copystate ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Grid Copied! Ready to Paste</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>Copy for Google Sheets</span>
                </>
              )}
            </button>

            {/* CSV Backup */}
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:shadow-md hover:shadow-indigo-50 shadow-xs"
              title="Download standard CSV spreadsheet file"
              id="download_csv_button"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>

            {/* Interactive Help */}
            <button 
              onClick={() => setShowCopyGuide(!showCopyGuide)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              title="Google Sheets flow guide guide"
              id="help_guide_trigger"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6" id="workspace_viewport">
        
        {/* Left Side: Creative Creator Control Panel & Niche Presets */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6" id="creator_left_sidebar">
          
          {/* Quick presets list for better engagement */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-display font-semibold text-slate-800 flex items-center gap-1.5 mb-3">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Creator Niche Presets
            </h2>
            <p className="text-xs text-slate-500 mb-4">Click to immediately load highly tailored expert short-form setups:</p>
            <div className="grid grid-cols-2 gap-2" id="niche_presets_matrix">
              {NICHE_PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(p)}
                  className={`flex flex-col items-start text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer text-xs ${
                    params.niche.toLowerCase().includes(p.label.split(" ")[0].toLowerCase())
                      ? "border-indigo-600 bg-indigo-50/50 shadow-xs text-indigo-950 font-medium"
                      : "border-slate-100 bg-[#FAFAFC] hover:bg-slate-50 hover:border-slate-200 text-slate-700"
                  }`}
                  id={`preset_btn_${i}`}
                >
                  <span className="text-lg mb-1">{p.icon}</span>
                  <span className="truncate w-full font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Config Setup Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex-1 flex flex-col gap-4">
            <h2 className="text-sm font-display font-semibold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Trend Customization Parameters
            </h2>

            {/* Input Niche */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Primary Niche / Creator Field</label>
              <input
                type="text"
                value={params.niche}
                onChange={(e) => setParams({ ...params, niche: e.target.value })}
                placeholder="e.g. Handmade Leather Purses, Tech Reviews"
                className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg p-2.5 transition-colors focus:outline-indigo-600 font-medium"
                id="input_niche_field"
              />
            </div>

            {/* Context/Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Brand Context / Unique Style</label>
              <textarea
                value={params.description}
                onChange={(e) => setParams({ ...params, description: e.target.value })}
                placeholder="Give details about your video visual style, specific product focus, or unique hooks..."
                rows={3}
                className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg p-2.5 transition-colors focus:outline-indigo-600 resize-none leading-relaxed"
                id="input_brand_description"
              />
            </div>

            {/* Target Audience */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Target Audience Profile</label>
              <input
                type="text"
                value={params.audience}
                onChange={(e) => setParams({ ...params, audience: e.target.value })}
                placeholder="e.g. College students, junior developers, busy moms"
                className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg p-2.5 transition-colors focus:outline-indigo-600 font-medium"
                id="input_audience_field"
              />
            </div>

            {/* Tone Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Viral Tone Accent</label>
              <select
                value={params.tone}
                onChange={(e) => setParams({ ...params, tone: e.target.value })}
                className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg p-2.5 cursor-pointer transition-colors focus:outline-indigo-600 font-medium"
                id="input_tone_select"
              >
                <option value="High Energy & Bold">High Energy & Bold (Fremont fast pace)</option>
                <option value="Cinematic & Atmospheric">Cinematic & Atmospheric (aesthetic vlogs)</option>
                <option value="Educational & Direct">Educational & Direct (mythbusting, tech hacks)</option>
                <option value="Storytelling & Empathetic">Storytelling & Empathetic (casual storytimes)</option>
                <option value="Sarcastic & Engaging">Sarcastic & Savage (humor, skits)</option>
              </select>
            </div>

            {/* Trends Density Count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex justify-between">
                <span>Total Concepts Count</span>
                <span className="font-bold text-indigo-600">{params.count} concepts</span>
              </label>
              <input
                type="range"
                min="3"
                max="8"
                step="1"
                value={params.count}
                onChange={(e) => setParams({ ...params, count: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 my-2"
                id="input_range_count"
              />
            </div>

            {/* Submit Active Agent */}
            <button
              onClick={generateViralTrends}
              disabled={isGenerating}
              className={`w-full mt-2 font-display font-medium text-xs flex items-center justify-center gap-2 py-3 rounded-xl transition-all cursor-pointer ${
                isGenerating 
                  ? "bg-indigo-300 text-indigo-50 cursor-not-allowed" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-[0.98]"
              }`}
              id="submit_generate_agent"
            >
              <Sparkles className="w-4 h-4 text-indigo-100" />
              <span>{isGenerating ? "Agent Analyzing Trends..." : "Generate Viral Blueprint"}</span>
            </button>

            {/* Informational message around database */}
            <div className="mt-2 bg-[#FAFCFE] border border-blue-100 rounded-xl p-3 flex gap-2.5">
              <ExternalLink className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-500 leading-normal">
                <span className="font-bold text-slate-700 block mb-0.5">Google Sheets Alternative Active</span>
                This sandbox relies on client-side state memory & instant TSV formatting. Copying coordinates outputs grid-aligned values seamlessly for direct pasting into your own document spreadsheets.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tabular Social Sheet & Detailed Production Control Cabinets */}
        <div className="flex-1 flex flex-col gap-6 min-w-0" id="right_content_island">
          
          {/* Main Panel Mode Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3" id="navigation_tabs_container">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("sheet")}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeTab === "sheet"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                id="tab_trigger_sheet"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Interactive Social Sheet</span>
              </button>

              <button
                onClick={() => setActiveTab("challenge")}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeTab === "challenge"
                    ? "bg-slate-900 text-white shadow-sm font-bold ring-2 ring-indigo-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                id="tab_trigger_challenges"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>30 / 75-Day Challenge Hub</span>
              </button>

              <button
                onClick={() => setActiveTab("insights")}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeTab === "insights"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                id="tab_trigger_insights"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Algorithm Reach Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab("teleprompter")}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeTab === "teleprompter"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                id="tab_trigger_teleprompter"
              >
                <Tv className="w-4 h-4" />
                <span>Studio Prompter & Live Preview</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Currently Managing: <span className="text-indigo-600 font-bold font-mono">{trends?.length || 0} Trends Row</span>
            </div>
          </div>

          {/* Error Message notification banner */}
          {errorMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-xs animate-fadeIn" id="error_banner_view">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Sandbox Generation Notice</span>
                <p className="leading-relaxed text-amber-800">{errorMessage}</p>
                <p className="mt-2 text-amber-500">Don't worry! We are displaying fully interactive customized demo templates below so you can test all features (interactive spreadsheet edits, direct copy, sorting, teleprompter views, audio cues, etc.).</p>
              </div>
            </div>
          )}

          {/* Loading Transition Cabinet */}
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden min-h-[400px]"
                id="loading_panel_view"
              >
                {/* Visual accent bubbles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full filter blur-xl opacity-80 translate-x-8 -translate-y-8" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full filter blur-xl opacity-80 -translate-x-8 translate-y-8" />
                
                <div className="relative flex flex-col items-center max-w-md">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin flex items-center justify-center" />
                    <Sparkles className="w-6 h-6 text-indigo-500 absolute top-12 left-12 animate-pulse" />
                  </div>

                  <h3 className="text-lg font-display font-semibold text-slate-800 tracking-tight">Coaching Social Algorithmic Signals...</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-8">AI is drafting scripts, evaluating audios, and mapping YouTube/Reels shelf potential.</p>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full relative">
                    <span className="absolute -top-3 left-4 text-[9px] font-bold bg-indigo-600 text-white rounded-md px-2 py-0.5 tracking-wider uppercase font-mono">Virality Metric Rule</span>
                    <p className="text-xs text-slate-600 font-medium italic leading-relaxed text-left py-1">
                      "{VIRAL_TIPS[tipIndex]}"
                    </p>
                  </div>

                  <div className="mt-6 flex gap-1 justify-center">
                    {VIRAL_TIPS.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-300 ${idx === tipIndex ? "w-4 bg-indigo-600" : "w-1 bg-slate-200"}`} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN TAB 1: Interative Spreadsheet Database */}
          {!isGenerating && activeTab === "sheet" && (
            <div className="flex flex-col gap-4 animate-fadeIn" id="spreadsheet_parent_tab_content">
              
              {/* Actions & Sorting bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100" id="sheet_control_subbar">
                <div className="flex gap-2">
                  <button 
                    onClick={addBlankRow}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                    id="add_new_row_action"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Concept Row</span>
                  </button>
                </div>

                <div className="flex gap-2.5 items-center">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Reach Sorting Priorities:
                  </span>
                  
                  <button
                    onClick={() => handleSort("yt_potential")}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all ${
                      sortField === "yt_potential" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    id="sort_by_yt_potential"
                  >
                    Shorts Reach {sortField === "yt_potential" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>

                  <button
                    onClick={() => handleSort("ig_potential")}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all ${
                      sortField === "ig_potential" 
                        ? "bg-pink-50 text-pink-700 border-pink-200" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    id="sort_by_ig_potential"
                  >
                    Reels Reach {sortField === "ig_potential" && (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </div>
              </div>

              {/* SpreadSheet Grid viewport */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs relative" id="grid_table_box">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left" id="creator_spreadsheet_grid">
                    <thead>
                      <tr className="bg-[#FAFBFD] border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-mono font-bold">
                        <th className="px-3 py-3 w-12 text-center border-r border-slate-200">ID</th>
                        <th className="px-4 py-3 min-w-[160px] border-r border-slate-200">Video Concept</th>
                        <th className="px-4 py-3 min-w-[140px] border-r border-slate-200">Audio Trend / Sound Vibe</th>
                        <th className="px-4 py-3 min-w-[150px] border-r border-slate-200">Hook Line (First 3s)</th>
                        <th className="px-4 py-3 min-w-[200px] border-r border-slate-200">Verbatim Script & Video Motions</th>
                        <th className="px-4 py-3 min-w-[120px] border-r border-slate-200">CTA Switch</th>
                        <th className="px-4 py-3 min-w-[120px] border-r border-slate-200">Keywords (SEO)</th>
                        <th className="px-4 py-3 min-w-[120px] border-r border-slate-200">Hashtags</th>
                        <th className="px-3 py-3 w-16 text-center border-r border-slate-200">YT Potential</th>
                        <th className="px-3 py-3 w-16 text-center border-r border-slate-200">IG Potential</th>
                        <th className="px-3 py-3 w-12 text-center">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {getSortedTrends().map((t) => (
                        <tr 
                          key={t.id} 
                          className={`hover:bg-[#FCFDFF] group transition-colors duration-100 ${selectedTrendId === t.id ? "bg-indigo-50/20" : ""}`}
                          onClick={() => setSelectedTrendId(t.id)}
                        >
                          {/* ID Cell */}
                          <td className="px-3 py-3 text-center border-r border-slate-100 font-bold font-mono text-indigo-600 bg-slate-50/50">
                            {t.id}
                          </td>

                          {/* Video Concept */}
                          <td className="px-4 py-3 border-r border-slate-100 font-medium whitespace-normal relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "video_concept" ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "video_concept", t.video_concept)}
                                className="cursor-text min-h-[22px]"
                              >
                                {t.video_concept}
                              </div>
                            )}
                          </td>

                          {/* Audio Trend */}
                          <td className="px-4 py-3 border-r border-slate-100 whitespace-normal text-slate-600 italic relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "audio_trend" ? (
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                rows={2}
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none resize-none text-[11px]"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "audio_trend", t.audio_trend)}
                                className="cursor-text min-h-[22px] leading-relaxed"
                              >
                                {t.audio_trend}
                              </div>
                            )}
                          </td>

                          {/* Hook */}
                          <td className="px-4 py-3 border-r border-slate-100 whitespace-normal font-semibold text-slate-900 relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "hook" ? (
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                rows={2}
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none resize-none"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "hook", t.hook)}
                                className="cursor-text min-h-[22px]"
                              >
                                {t.hook}
                              </div>
                            )}
                          </td>

                          {/* Verbatim Script */}
                          <td className="px-4 py-3 border-r border-slate-100 whitespace-normal text-[11.5px] max-w-[280px] font-mono leading-relaxed relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "script" ? (
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                rows={5}
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none text-[11px] resize-y"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "script", t.script)}
                                className="cursor-text min-h-[22px] line-clamp-3 overflow-hidden text-slate-600"
                                title="Click to edit full video script"
                              >
                                {t.script}
                              </div>
                            )}
                          </td>

                          {/* Call To Action */}
                          <td className="px-4 py-3 border-r border-slate-100 whitespace-normal text-indigo-700 font-semibold relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "cta" ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "cta", t.cta)}
                                className="cursor-text min-h-[22px]"
                              >
                                {t.cta}
                              </div>
                            )}
                          </td>

                          {/* Keywords */}
                          <td className="px-4 py-3 border-r border-slate-100 whitespace-normal text-slate-500 font-mono text-[11px] relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "keywords" ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none font-mono text-[10px]"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "keywords", t.keywords)}
                                className="cursor-text min-h-[22px]"
                              >
                                {t.keywords}
                              </div>
                            )}
                          </td>

                          {/* Hashtags */}
                          <td className="px-4 py-3 border-r border-slate-100 whitespace-normal text-indigo-500 font-mono text-[10px] relative hover:bg-amber-50/30">
                            {editingCell?.id === t.id && editingCell?.field === "hashtags" ? (
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                rows={2}
                                className="w-full bg-white border border-indigo-400 rounded-md p-1 focus:outline-none text-[10px]"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "hashtags", t.hashtags)}
                                className="cursor-text min-h-[22px]"
                              >
                                {t.hashtags}
                              </div>
                            )}
                          </td>

                          {/* YT Potential */}
                          <td className="px-3 py-3 text-center border-r border-slate-100 relative hover:bg-amber-50/30 font-bold font-mono">
                            {editingCell?.id === t.id && editingCell?.field === "yt_potential" ? (
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                className="w-10 bg-white border border-indigo-400 rounded-md text-center focus:outline-none"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "yt_potential", t.yt_potential)}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg cursor-text ${
                                  t.yt_potential >= 9 
                                    ? "bg-red-50 text-red-600 font-extrabold" 
                                    : t.yt_potential >= 7 
                                    ? "bg-amber-50 text-amber-700" 
                                    : "bg-slate-50 text-slate-500"
                                }`}
                              >
                                {t.yt_potential}
                              </div>
                            )}
                          </td>

                          {/* IG Potential */}
                          <td className="px-3 py-3 text-center border-r border-slate-100 relative hover:bg-amber-50/30 font-bold font-mono">
                            {editingCell?.id === t.id && editingCell?.field === "ig_potential" ? (
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditedCell}
                                autoFocus
                                className="w-10 bg-white border border-indigo-400 rounded-md text-center focus:outline-none"
                              />
                            ) : (
                              <div 
                                onClick={() => startEditing(t.id, "ig_potential", t.ig_potential)}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg cursor-text ${
                                  t.ig_potential >= 9 
                                    ? "bg-pink-50 text-pink-600 font-extrabold" 
                                    : t.ig_potential >= 7 
                                    ? "bg-amber-50 text-amber-700" 
                                    : "bg-slate-50 text-slate-500"
                                }`}
                              >
                                {t.ig_potential}
                              </div>
                            )}
                          </td>

                          {/* Deletion Button */}
                          <td className="px-3 py-3 text-center text-slate-400 hover:text-red-500 transition-colors">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRow(t.id);
                              }}
                              className="p-1 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                              title="Delete trend idea row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#FAFAFB] border-t border-slate-100 py-2.5 px-4 flex justify-between items-center text-[11px] text-slate-500">
                  <div className="flex gap-4">
                    <span>💡 <strong>Double-Click</strong> or tap on any cell (concept, audio, cta, hashtags, script, score) to edit raw data instantly!</span>
                  </div>
                  <div>
                    Sort Field: <span className="text-slate-700 font-semibold font-mono">{sortField ? `${sortField} [${sortDirection}]` : "Standard Default Order"}</span>
                  </div>
                </div>
              </div>

              {/* Direct Sheet pasting tutorial alert box */}
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-indigo-100 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Need this in Google Sheets immediately?</h4>
                    <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">We formatted clipboard exports as multi-column tabbed values. Clicking <strong>'Copy for Google Sheets'</strong> copies the matrix perfectly. You can literally head to a blank sheet and press Paste!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCopyGuide(true)}
                  className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-4 py-2 rounded-lg shrink-0 cursor-pointer transition-all"
                >
                  Show 3-Sec Tutorial Guide
                </button>
              </div>

            </div>
          )}

          {/* MAIN TAB: Multi-Day Series Growth Challenges Calendar */}
          {!isGenerating && activeTab === "challenge" && (
            <div className="flex flex-col gap-6 animate-fadeIn" id="challenge_series_tab_content">
              
              {/* Header Configuration Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-slate-800">Sequential Series & Challenges Engine</h3>
                      <p className="text-[11px] text-slate-500">Formulate and download high-retention 30-Day or 75-Day social media challenges designed for virality.</p>
                    </div>
                  </div>
                  
                  {/* Actions (Copy to Sheets, Download CSV) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyChallengeForGoogleSheets}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                        copyChallengeState
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-inner"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                      id="copy_challenge_sheets_button"
                    >
                      {copyChallengeState ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Roadmap Copied! Ready to Paste</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-orange-600" />
                          <span>Copy Roadmap (Google Sheets)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={downloadChallengeCSV}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg cursor-pointer transition-all"
                      id="download_challenge_csv_button"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Challenge CSV</span>
                    </button>
                  </div>
                </div>

                {/* Challenge Parameters Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                  {/* Challenge Selection */}
                  <div className="lg:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Select Challenge Format</label>
                    <select
                      value={challengeType}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        setChallengeType(newType);
                        generateChallengeSeries(challengeNiche, newType);
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 transition-colors focus:ring-1 focus:ring-indigo-500 font-semibold cursor-pointer"
                      id="challenge_type_select"
                    >
                      <option value="30 Day Series Growth Challenge">30 Day Series Growth Challenge</option>
                      <option value="75 Day Hard Challenge">75 Day Hard Challenge</option>
                    </select>
                  </div>

                  {/* Niche Text Input with Presets */}
                  <div className="lg:col-span-4 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">Target Social Niche</label>
                    <input
                      type="text"
                      value={challengeNiche}
                      onChange={(e) => setChallengeNiche(e.target.value)}
                      placeholder="e.g. nutritional, fitness, creator, psychology..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 transition-colors focus:ring-1 focus:ring-indigo-500 font-semibold"
                      id="challenge_niche_input"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="lg:col-span-5 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Switch Niche Presets Quickly:</label>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: "Nutritional hacks", emoji: "🩺" },
                        { label: "Fitness & Gym", emoji: "🏋️‍♂️" },
                        { label: "Creator Growth", emoji: "🚀" },
                        { label: "Language Teaching", emoji: "🎓" },
                        { label: "Stoic Psychology", emoji: "🧠" },
                        { label: "Astrology Stars", emoji: "🌌" }
                      ].map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setChallengeNiche(preset.label);
                            generateChallengeSeries(preset.label, challengeType);
                          }}
                          className={`text-[9.5px] font-bold px-2 py-1 rounded-full border transition-all cursor-pointer ${
                            challengeNiche.toLowerCase().includes(preset.label.toLowerCase().slice(0, 4))
                              ? "bg-orange-50 text-orange-700 border-orange-200 shadow-xs"
                              : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                          }`}
                        >
                          <span>{preset.emoji} {preset.label.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generate New with Gemini Button */}
                <button
                  onClick={() => generateChallengeSeries()}
                  disabled={isGeneratingChallenge}
                  className={`w-full font-display font-medium text-xs flex items-center justify-center gap-2 py-3 rounded-xl transition-all cursor-pointer ${
                    isGeneratingChallenge
                      ? "bg-orange-300 text-orange-50 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-100 active:scale-[0.98]"
                  }`}
                  id="submit_generate_challenge_series_btn"
                >
                  <Sparkles className="w-4 h-4 text-orange-200" />
                  <span>{isGeneratingChallenge ? `AI Customizing ${challengeType}...` : `Generate Custom ${challengeType} with Gemini`}</span>
                </button>
              </div>

              {/* Loader during challenge generation */}
              {isGeneratingChallenge ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-lg relative min-h-[350px]">
                  <div className="relative mb-6">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-orange-500 animate-spin flex items-center justify-center" />
                    <Flame className="w-5 h-5 text-orange-500 absolute top-3.5 left-3.5 animate-pulse" />
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-800">Drafting Challenge Episode Outlines...</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-sm">Generating daily hooks, audio styles, and staging parameters for {challengeType === "75 Day Hard Challenge" ? "75" : "30"} full days minimum.</p>
                </div>
              ) : (
                /* Split challenge panel */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start" id="split_challenge_workspace">
                  
                  {/* Left Column: List of Days Index */}
                  <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs max-h-[550px] overflow-y-auto flex flex-col gap-2">
                    <div className="sticky top-0 bg-white pb-2 mb-1 border-b border-slate-100 z-10 flex justify-between items-center text-xs text-slate-400 font-mono">
                      <span className="font-bold uppercase tracking-wider">Day Selection Roadmap</span>
                      <span className="font-bold">{currentChallenge?.days?.length || 0} Days Plan</span>
                    </div>

                    <div className="flex flex-col gap-1.5" id="challenge_roadmap_scroller">
                      {currentChallenge?.days?.map((d) => (
                        <button
                          key={d.day}
                          onClick={() => setSelectedChallengeDay(d.day)}
                          className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                            selectedChallengeDay === d.day
                              ? "bg-slate-900 border-slate-900 text-white shadow-md font-bold scale-[1.01]"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600 hover:text-slate-900"
                          }`}
                          id={`challenge_day_selector_${d.day}`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              selectedChallengeDay === d.day ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-800"
                            }`}>D{d.day}</span>
                            <span className="text-xs truncate font-medium">{d.title}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0 font-mono">
                            {d.platform_reach.includes("Shorts") && <span className="text-[8px] bg-red-100 text-red-700 px-1 rounded-sm uppercase font-extrabold" title="YouTube Shorts Focus">YT</span>}
                            {d.platform_reach.includes("Reels") && <span className="text-[8px] bg-pink-100 text-pink-700 px-1 rounded-sm uppercase font-extrabold" title="Instagram Reels Focus">IG</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Deep Blueprint Recipe for selected Day */}
                  {currentChallenge?.days?.find(d => d.day === selectedChallengeDay) && (() => {
                    const activeDayData = currentChallenge.days.find(d => d.day === selectedChallengeDay)!;
                    return (
                      <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[500px]" id="selected_day_viewer">
                        
                        {/* Selected day header */}
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg bg-orange-600 text-white font-black px-3 py-1 rounded-xl shadow-xs font-mono">DAY {activeDayData.day}</span>
                            <div>
                              <h4 className="text-base font-display font-bold text-slate-800">{activeDayData.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Chronological series progression details</p>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full ${
                            activeDayData.platform_reach.includes("Shorts") 
                              ? "bg-red-50 text-red-600 border border-red-200" 
                              : activeDayData.platform_reach.includes("Reels") 
                              ? "bg-pink-50 text-pink-600 border border-pink-200"
                              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                          }`}>
                            🎯 {activeDayData.platform_reach}
                          </span>
                        </div>

                        {/* Interactive Blueprint Recipe Box */}
                        <div className="p-6 flex flex-col gap-5">
                          
                          {/* The Hook (Crucial verbal opener) */}
                          <div className="bg-indigo-950 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/10 rounded-full filter blur-xl" />
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-orange-400 font-mono flex items-center gap-1 mb-1">
                              <Flame className="w-3.5 h-3.5" />
                              Verbal Hook Line (0:00 - 0:03 Critical Opener)
                            </span>
                            <blockquote className="text-sm font-display font-bold text-slate-100 italic leading-relaxed">
                              "{activeDayData.hook}"
                            </blockquote>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Video Concept Formatter */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono block mb-1">Video Format & Framing</span>
                              <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                                {activeDayData.concept}
                              </p>
                            </div>

                            {/* Sound Style Direction */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono block mb-1">Trending Soundtrack / FX Beat</span>
                              <p className="text-xs text-slate-850 leading-relaxed font-semibold">
                                {activeDayData.audio_sound}
                              </p>
                            </div>

                          </div>

                          {/* Physical Directions / Stage Actions */}
                          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono block mb-1">Creator Staging & Filming Direction</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              {activeDayData.vibe_action}
                            </p>
                          </div>

                          {/* CTA Anchor to build sub-retention and loyalty */}
                          <div className="border border-slate-100 rounded-xl p-4 bg-orange-50/20">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-orange-950 font-mono block mb-1">Conversion CTA (Follower Magnet CTA)</span>
                            <p className="text-xs text-orange-950 font-bold leading-relaxed italic">
                              "{activeDayData.cta}"
                            </p>
                          </div>

                          {/* Marketing SEO properties */}
                          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono block mb-1">SEO Target Queries</span>
                              <p className="text-slate-500 font-mono leading-relaxed truncate" title={activeDayData.keywords}>
                                {activeDayData.keywords}
                              </p>
                            </div>
                            
                            <div>
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono block mb-1">Algorithmic Match Hashtags</span>
                              <p className="text-indigo-600 font-semibold font-mono truncate" title={activeDayData.hashtags}>
                                {activeDayData.hashtags}
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* Interactive Roadmap bar */}
                        <div className="mt-auto bg-slate-50 border-t border-slate-100 p-4 flex justify-between items-center text-xs">
                          <button
                            onClick={() => setSelectedChallengeDay(prev => Math.max(1, prev - 1))}
                            disabled={selectedChallengeDay === 1}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-650 hover:text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ◀ Previous Episode
                          </button>

                          <span className="text-slate-400 font-mono font-bold">
                            Episode {selectedChallengeDay} of {currentChallenge?.days?.length || 30}
                          </span>

                          <button
                            onClick={() => setSelectedChallengeDay(prev => Math.min(currentChallenge.days.length, prev + 1))}
                            disabled={selectedChallengeDay === currentChallenge?.days?.length}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-650 hover:text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next Episode ▶
                          </button>
                        </div>

                      </div>
                    );
                  })()}
                  
                </div>
              )}

            </div>
          )}

          {/* MAIN TAB 2: Dual Bento Algorithms Potential Visuals */}
          {!isGenerating && activeTab === "insights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn" id="insights_dashboard_panel">
              
              {/* YouTube Shorts Potential Map */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col" id="yt_channel_potential_card">
                <div className="flex items-center gap-2 border-b border-rose-100 pb-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center font-bold text-rose-600">YT</div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-800">YouTube Shorts Shelf Optimization</h3>
                    <p className="text-[10px] text-slate-400">Paced for SEO Search Indexes & Retention thresholds</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {trends.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => {
                        setSelectedTrendId(t.id);
                        setActiveTab("teleprompter");
                      }}
                      className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                        selectedTrendId === t.id 
                          ? "border-rose-400 bg-rose-50/10 shadow-xs" 
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ID: {t.id}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">Score Potential:</span>
                          <span className="text-xs font-bold font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{t.yt_potential}/10</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-2 block truncate">{t.video_concept}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 leading-relaxed">{t.yt_reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram Reels Potential Map */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col" id="ig_channel_potential_card">
                <div className="flex items-center gap-2 border-b border-pink-100 pb-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center font-bold text-pink-600">IG</div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-800">Instagram Reels Explore Velocity</h3>
                    <p className="text-[10px] text-slate-400">Driven by trending audios triggers & Share hooks</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {trends.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => {
                        setSelectedTrendId(t.id);
                        setActiveTab("teleprompter");
                      }}
                      className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                        selectedTrendId === t.id 
                          ? "border-pink-400 bg-pink-50/10 shadow-xs" 
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ID: {t.id}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">Score Potential:</span>
                          <span className="text-xs font-bold font-mono text-pink-600 bg-pink-50 px-2 py-0.5 rounded">{t.ig_potential}/10</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-2 block truncate">{t.video_concept}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 lines-clamp-2 leading-relaxed">{t.ig_reason}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MAIN TAB 3: Studio Prompter & Live Mock Environment Layout */}
          {!isGenerating && activeTab === "teleprompter" && selectedTrend && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-fadeIn" id="teleprompter_tab_container">
              
              {/* Concept selector left-column list */}
              <div className="md:col-span-2 flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Select Blueprint Idea</h3>
                <div className="flex flex-col gap-2">
                  {trends.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrendId(t.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedTrendId === t.id 
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                          : "bg-slate-50/50 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          selectedTrendId === t.id ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}>{t.id}</span>
                        <div className="flex gap-2">
                          <span className="text-[9px] font-bold">YT {t.yt_potential}</span>
                          <span className="text-[9px] font-bold">IG {t.ig_potential}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold truncate">{t.video_concept}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rich visual mockup editor */}
              <div className="md:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                
                {/* Visual mockup Header bar */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 font-mono">Teleprompter Video Monitor Mockup</h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Est. Run Time:</span>
                    <span className="text-slate-800 font-bold font-mono">45s max</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  
                  {/* Title and niche suitability match */}
                  <div>
                    <h2 className="text-base font-display font-black text-slate-900">{selectedTrend.video_concept}</h2>
                    <p className="text-xs text-indigo-600 font-semibold italic mt-1 font-mono">Niche Blueprint: {selectedTrend.niche_suitability}</p>
                  </div>

                  {/* Audio trigger directions */}
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-amber-800 block font-mono">Soundtrack / Voiceover Cue</span>
                    <p className="text-xs text-amber-900 font-medium italic mt-1 leading-relaxed">
                      "{selectedTrend.audio_trend}"
                    </p>
                  </div>

                  {/* Script display box mimicking teleprompter console screen */}
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-slate-200 shadow-inner min-h-[180px] flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 uppercase tracking-widest font-mono border-b border-slate-800 pb-2 mb-3">
                      <span>VERBATIM TRANSCRIPT</span>
                      <span className="text-indigo-400 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        Live pacing active
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[220px] text-xs leading-relaxed space-y-3 font-mono">
                      {selectedTrend.script.split("\n").map((line, idx) => {
                        const isDirection = line.startsWith("[");
                        return (
                          <p 
                            key={idx} 
                            className={isDirection ? "text-slate-500 italic text-[11px] bg-slate-900/50 p-1 px-2 rounded border border-slate-900" : "text-white font-medium"}
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono font-bold text-slate-400">
                      <span>CTA: <span className="text-indigo-400">{selectedTrend.cta}</span></span>
                    </div>
                  </div>

                  {/* Tags mapping footer */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Hashtags Bundle</div>
                    <div className="text-xs bg-slate-50 p-2 text-slate-700 rounded-lg text-[10.5px] font-mono leading-relaxed select-all">
                      {selectedTrend.hashtags}
                    </div>

                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Metadata SEO Search Keywords</div>
                    <div className="text-xs bg-slate-50 p-2 text-indigo-700 rounded-lg text-[10.5px] font-mono leading-relaxed select-all">
                      {selectedTrend.keywords}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* MODAL / POPOVER: 3-Second Interactive Copy-Paste Guide */}
      <AnimatePresence>
        {showCopyGuide && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="copy_guide_modal_container">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-100"
              id="copy_guide_modal"
            >
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 px-6 py-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                  <h3 className="font-display font-bold text-lg">Google Sheets Instant Transfer Flow</h3>
                </div>
                <button 
                  onClick={() => setShowCopyGuide(false)}
                  className="text-white/80 hover:text-white font-bold text-sm bg-black/10 hover:bg-black/20 px-2 py-1 rounded cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-600">
                <p>Because you requested to continue with raw platform sandboxes and <strong>not configure OAuth / Firebase storage integration APIs</strong>, the easiest way to access your trends as a spreadsheet is via instant paste formatting.</p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center font-mono shrink-0">1</span>
                    <div>
                      <span className="font-bold text-slate-800">Click "Copy for Google Sheets"</span>
                      <p className="mt-0.5">This copies your entire short-form content calendar as structured multi-column Tab-Separated Values (TSV).</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center font-mono shrink-0">2</span>
                    <div>
                      <span className="font-bold text-slate-800">Create a New Google Sheet</span>
                      <p className="mt-0.5 flex items-center gap-1.5">
                        Type <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-bold inline-flex items-center gap-0.5 hover:text-indigo-700">sheets.new <ExternalLink className="w-2.5 h-2.5" /></a> into your web browser. This shortcut creates a brand new blank spreadsheet.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center font-mono shrink-0">3</span>
                    <div>
                      <span className="font-bold text-slate-800">Paste with Perfect Alignments</span>
                      <p className="mt-0.5">Select cell <strong>A1</strong> inside Google Sheets and press <strong>Ctrl+V</strong> (or <strong>Cmd+V</strong> on Mac). The table columns (audio trends, hooks, hashtags, scripts, and keywords) will map instantly!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 mt-4 text-indigo-900 flex gap-2.5">
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px] text-indigo-950">Cell Edits Sync Perfectly</span>
                    Our grid state keeps updates. If you tweak scripts details or hashtags directly on the table, clicking the button transfers those customized edits seamlessly.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 flex justify-end">
                <button
                  onClick={() => {
                    copyForGoogleSheets();
                    setShowCopyGuide(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  Copy & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual footer wrapper */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto" id="app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Viral Trend Agent. Privacy-focused, local creator workspace active.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 transition-colors pointer-events-none">Zero Storage Server Cookies</span>
            <span className="text-slate-200">|</span>
            <span className="hover:text-slate-600 transition-colors pointer-events-none">Fully Editable Table Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

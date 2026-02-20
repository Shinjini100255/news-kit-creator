import { useState } from "react";
import { VideoKit } from "@/pages/Index";

interface OutputTabsProps {
  kit: VideoKit;
}

const TABS = [
  { id: "script", label: "📄 Script", icon: "📄" },
  { id: "scenes", label: "🎬 Scene Plan", icon: "🎬" },
  { id: "subtitles", label: "💬 Subtitles", icon: "💬" },
  { id: "thumbnails", label: "🖼️ Thumbnails", icon: "🖼️" },
];

const OutputTabs = ({ kit }: OutputTabsProps) => {
  const [activeTab, setActiveTab] = useState("script");
  const [script, setScript] = useState(kit.script);
  const [subtitles, setSubtitles] = useState(kit.subtitles);

  const handleDownload = () => {
    const scenesText = kit.scenes
      .map(
        (s) =>
          `SCENE ${s.scene}\nNarration: ${s.narration}\nVisual: ${s.visual}`
      )
      .join("\n\n---\n\n");

    const titlesText = kit.titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
    const thumbText = kit.thumbnailTexts.map((t, i) => `${i + 1}. ${t}`).join("\n");

    const content = `AUTOMATED NEWS VIDEO BUILDER — PRODUCTION KIT
Generated: ${new Date().toLocaleDateString()}
${"=".repeat(60)}

SECTION 1: NEWS SCRIPT (60–90 seconds)
${"=".repeat(60)}

${script}

${"=".repeat(60)}

SECTION 2: SCENE BREAKDOWN
${"=".repeat(60)}

${scenesText}

${"=".repeat(60)}

SECTION 3: SUBTITLE FILE (SRT FORMAT)
${"=".repeat(60)}

${subtitles}

${"=".repeat(60)}

SECTION 4: YOUTUBE TITLES
${"=".repeat(60)}

${titlesText}

${"=".repeat(60)}

SECTION 5: THUMBNAIL TEXT OVERLAYS
${"=".repeat(60)}

${thumbText}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video-production-kit.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-slide-up">
      {/* Success banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-sm font-semibold text-accent-foreground">Video Kit Ready</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your Production Kit</h2>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-navy-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Kit
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-fit px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-foreground bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Script Tab */}
          {activeTab === "script" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">News Narration Script</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Editable</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Estimated duration: 60–90 seconds. Edit freely.</p>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-72 px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {script.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          )}

          {/* Scenes Tab */}
          {activeTab === "scenes" && (
            <div>
              <h3 className="font-semibold text-foreground mb-1">Scene Breakdown</h3>
              <p className="text-xs text-muted-foreground mb-4">6 scenes with narration and visual direction for each.</p>
              {kit.scenes.length === 0 ? (
                <p className="text-muted-foreground text-sm">No scene data available.</p>
              ) : (
                <div className="space-y-4">
                  {kit.scenes.map((scene) => (
                    <div key={scene.scene} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Scene {scene.scene}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Narration</span>
                          <p className="text-sm text-foreground mt-1 leading-relaxed">{scene.narration}</p>
                        </div>
                        <div className="border-t border-border pt-3">
                          <span className="text-xs font-semibold text-accent uppercase tracking-wider">🎥 Visual</span>
                          <p className="text-sm text-muted-foreground mt-1">{scene.visual}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subtitles Tab */}
          {activeTab === "subtitles" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">SRT Subtitle File</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Editable</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Standard SRT format. Copy and save as <code className="bg-muted px-1 rounded">.srt</code> for use in video editors.
              </p>
              <textarea
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                className="w-full h-80 px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Thumbnails Tab */}
          {activeTab === "thumbnails" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-1">YouTube Titles</h3>
                <p className="text-xs text-muted-foreground mb-3">5 click-worthy title options for your video.</p>
                {kit.titles.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No titles generated.</p>
                ) : (
                  <div className="space-y-2">
                    {kit.titles.map((title, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/40 transition-colors group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-foreground font-medium leading-relaxed">{title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-1">Thumbnail Text Overlays</h3>
                <p className="text-xs text-muted-foreground mb-3">Bold text to overlay on your thumbnail image (max 5 words each).</p>
                {kit.thumbnailTexts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No thumbnail texts generated.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {kit.thumbnailTexts.map((text, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-lg bg-primary flex items-center justify-center p-4 text-center"
                      >
                        <span className="text-primary-foreground font-bold text-lg leading-tight">{text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputTabs;

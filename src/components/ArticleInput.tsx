import { useState } from "react";

const TONES = ["Neutral", "Breaking News", "Explainer", "YouTube Engaging"];
const MAX_CHARS = 15000;

interface ArticleInputProps {
  onGenerate: (article: string, tone: string) => void;
}

const ArticleInput = ({ onGenerate }: ArticleInputProps) => {
  const [article, setArticle] = useState("");
  const [tone, setTone] = useState("Neutral");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = article.trim();
    if (!trimmed) {
      setError("Please paste a news article before generating.");
      return;
    }
    if (trimmed.length < 100) {
      setError("Article is too short. Please paste a complete news article.");
      return;
    }
    setError("");
    onGenerate(trimmed, tone);
  };

  const wordCount = article.trim().split(/\s+/).filter(Boolean).length;
  const charCount = article.length;

  return (
    <div className="animate-slide-up">
      {/* Hero text */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          <span className="text-xs font-semibold text-accent-foreground uppercase tracking-wide">AI Production Pipeline</span>
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-3 leading-tight">
          Turn any article into a<br />
          <span className="text-primary">complete video kit</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Paste a news article and get a script, scene plan, subtitles, and thumbnail ideas — ready in seconds.
        </p>
      </div>

      {/* What you'll get */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: "📄", label: "News Script", desc: "60–90 sec narration" },
          { icon: "🎬", label: "Scene Plan", desc: "6 visual scenes" },
          { icon: "💬", label: "SRT Subtitles", desc: "Timed subtitle file" },
          { icon: "🖼️", label: "Thumbnail Kit", desc: "5 titles + 3 overlays" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-sm font-semibold text-foreground">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Input card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {/* Tone selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Video Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  tone === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-foreground mb-2">
            News Article <span className="text-muted-foreground font-normal">(paste full article)</span>
          </label>
          <textarea
            value={article}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setArticle(e.target.value);
                if (error) setError("");
              }
            }}
            placeholder="Paste your news article here. The AI will generate a complete video production kit including script, scenes, subtitles, and thumbnail ideas..."
            className="w-full h-56 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          <div className="flex items-center justify-between mt-1.5">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{wordCount} words</p>
            )}
            <p className="text-xs text-muted-foreground">{charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars</p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!article.trim()}
          className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generate Video Kit →
        </button>
      </div>
    </div>
  );
};

export default ArticleInput;

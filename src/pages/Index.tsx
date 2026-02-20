import { useState } from "react";
import ArticleInput from "@/components/ArticleInput";
import GenerationProgress from "@/components/GenerationProgress";
import OutputTabs from "@/components/OutputTabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface VideoKit {
  script: string;
  scenes: Array<{ scene: number; narration: string; visual: string }>;
  subtitles: string;
  titles: string[];
  thumbnailTexts: string[];
}

const STEPS = [
  "Analyzing article...",
  "Writing news script...",
  "Building scene breakdown...",
  "Generating subtitle file...",
  "Creating thumbnail ideas...",
];

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [videoKit, setVideoKit] = useState<VideoKit | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (article: string, tone: string) => {
    setIsGenerating(true);
    setVideoKit(null);
    setCurrentStep(0);

    // Animate progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 3000);

    try {
      const { data, error } = await supabase.functions.invoke("generate-video-kit", {
        body: { article, tone },
      });

      clearInterval(stepInterval);

      if (error) {
        throw new Error(error.message || "Failed to generate video kit");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setVideoKit(data as VideoKit);
      setCurrentStep(STEPS.length);
    } catch (err) {
      clearInterval(stepInterval);
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setVideoKit(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">NV</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-none">News Video Builder</h1>
              <p className="text-xs text-muted-foreground mt-0.5">AI-powered video production kit</p>
            </div>
          </div>
          {videoKit && (
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← New Article
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!videoKit && !isGenerating && (
          <ArticleInput onGenerate={handleGenerate} />
        )}

        {isGenerating && (
          <GenerationProgress steps={STEPS} currentStep={currentStep} />
        )}

        {videoKit && !isGenerating && (
          <OutputTabs kit={videoKit} />
        )}
      </main>
    </div>
  );
};

export default Index;

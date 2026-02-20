interface GenerationProgressProps {
  steps: string[];
  currentStep: number;
}

const GenerationProgress = ({ steps, currentStep }: GenerationProgressProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-full border-4 border-border"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🎬</span>
        </div>
      </div>

      {/* Current step */}
      <h3 className="text-xl font-bold text-foreground mb-2">
        Building your Video Kit
      </h3>
      <p className="text-muted-foreground text-sm mb-8">
        This takes about 30–60 seconds. The AI is working through each step...
      </p>

      {/* Step list */}
      <div className="w-full max-w-sm space-y-3">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 ${
                isActive
                  ? "bg-primary/5 border-primary/20"
                  : isDone
                  ? "bg-card border-border opacity-60"
                  : "bg-card border-border opacity-30"
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {isDone ? (
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : isActive ? (
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-dot" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-border" />
                )}
              </div>

              <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationProgress;

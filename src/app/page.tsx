
"use client";

import { useState } from "react";
import type { DiagnoseCropDiseaseOutput } from "@/ai/flows/diagnose-crop-disease";
import { diagnoseCropDisease } from "@/ai/flows/diagnose-crop-disease";
import { DiseaseDiagnosisForm, type DiagnosisFormValues } from "@/components/disease-diagnosis-form";
import { DiagnosisResultDisplay } from "@/components/diagnosis-result-display";
import { useToast } from "@/hooks/use-toast";
import { LeafIcon } from "@/components/icons/LeafIcon"; // Using the custom one just in case
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AgriAssistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseCropDiseaseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDiagnose = async (values: DiagnosisFormValues) => {
    setIsLoading(true);
    setError(null);
    setDiagnosisResult(null);

    try {
      const photoDataUri = await fileToDataUri(values.photo);
      const input = {
        cropType: values.cropType,
        photoDataUri,
        symptoms: values.symptoms,
      };

      const result = await diagnoseCropDisease(input);
      setDiagnosisResult(result);
      toast({
        title: "Diagnosis Successful",
        description: `Identified: ${result.diseaseIdentification.diseaseName}`,
      });
    } catch (err) {
      console.error("Diagnosis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during diagnosis.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Diagnosis Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 bg-background">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Image src="https://picsum.photos/seed/agriassistlogo/80/80" alt="AgriAssist Logo" width={60} height={60} className="rounded-full mr-3" data-ai-hint="logo agriculture" />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary">
            AgriAssist
          </h1>
        </div>
        <p className="text-md sm:text-lg text-foreground/80">
          Your AI-Powered Partner in Smart Farming
        </p>
      </header>

      <div className="w-full max-w-2xl space-y-8">
        <DiseaseDiagnosisForm onSubmit={handleDiagnose} isLoading={isLoading} />

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 bg-card rounded-lg shadow-md text-primary">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p className="text-lg font-semibold">Analyzing your crop...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments.</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="animate-in fade-in-50 duration-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diagnosisResult && !isLoading && !error && (
          <DiagnosisResultDisplay result={diagnosisResult} />
        )}
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AgriAssist. Revolutionizing Agriculture.</p>
      </footer>
    </main>
  );
}

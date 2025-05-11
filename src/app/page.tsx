
"use client";

import { useState } from "react";
import type { DiagnoseCropDiseaseOutput } from "@/ai/flows/diagnose-crop-disease";
import { diagnoseCropDisease } from "@/ai/flows/diagnose-crop-disease";
import { DiseaseDiagnosisForm, type DiagnosisFormValues } from "@/components/disease-diagnosis-form";
import { DiagnosisResultDisplay } from "@/components/diagnosis-result-display";
import { NewsCarousel } from "@/components/news-carousel";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, BotMessageSquare, CloudSun, Users, Store, Loader2, Newspaper } from "lucide-react";
import Image from "next/image";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AgroSensePage() {
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseCropDiseaseOutput | null>(null);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDiagnose = async (values: DiagnosisFormValues) => {
    setIsLoadingDiagnosis(true);
    setDiagnosisError(null);
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
      setDiagnosisError(errorMessage);
      toast({
        variant: "destructive",
        title: "Diagnosis Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoadingDiagnosis(false);
    }
  };

  const featureSections = [
    {
      title: "AI Powered Disease Diagnosis",
      description: "Upload an image of your crop and get an instant AI-powered disease diagnosis and treatment recommendations.",
      icon: <BotMessageSquare className="w-10 h-10 text-primary mb-4" />,
      actionText: "Diagnose Now",
      content: (
        <>
          <DiseaseDiagnosisForm onSubmit={handleDiagnose} isLoading={isLoadingDiagnosis} />
          {isLoadingDiagnosis && (
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-inner mt-4 text-primary">
              <Loader2 className="h-10 w-10 animate-spin mb-3" />
              <p className="text-md font-semibold">Analyzing your crop...</p>
              <p className="text-xs text-muted-foreground">This may take a few moments.</p>
            </div>
          )}
          {diagnosisError && !isLoadingDiagnosis && (
            <Alert variant="destructive" className="mt-4 animate-in fade-in-50 duration-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{diagnosisError}</AlertDescription>
            </Alert>
          )}
          {diagnosisResult && !isLoadingDiagnosis && !diagnosisError && (
            <DiagnosisResultDisplay result={diagnosisResult} />
          )}
        </>
      ),
    },
    {
      title: "Real-time Weather Updates & Alerts",
      description: "Access hyperlocal weather forecasts, receive timely alerts for adverse conditions, and plan your farming activities effectively.",
      icon: <CloudSun className="w-10 h-10 text-primary mb-4" />,
      actionText: "View Weather (Coming Soon)",
      content: <p className="text-muted-foreground text-sm">Detailed weather information and alerts will be available here.</p>,
      disabled: true,
    },
    {
      title: "Farmer-Consumer Marketplace",
      description: "Connect directly with consumers to sell your produce at fair prices. Expand your market reach and increase profitability.",
      icon: <Store className="w-10 h-10 text-primary mb-4" />,
      actionText: "Explore Marketplace (Coming Soon)",
      content: <p className="text-muted-foreground text-sm">Our marketplace will connect you with buyers directly.</p>,
      disabled: true,
    },
    {
      title: "Farmer Community",
      description: "Join a vibrant community of fellow farmers. Share knowledge, discuss challenges, and learn best practices from experts and peers.",
      icon: <Users className="w-10 h-10 text-primary mb-4" />,
      actionText: "Join Community (Coming Soon)",
      content: <p className="text-muted-foreground text-sm">Connect with other farmers, share tips, and grow together.</p>,
      disabled: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      <header className="w-full py-6 text-center bg-card shadow-md">
        <div className="container mx-auto flex items-center justify-center">
          <Image 
            src="https://picsum.photos/seed/agrosenselogo/80/80" 
            alt="AgroSense Logo" 
            width={50} 
            height={50} 
            className="rounded-full mr-4"
            data-ai-hint="leaf logo" 
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary">
            AgroSense
          </h1>
        </div>
        <p className="text-md sm:text-lg text-foreground/80 mt-1">
          Your AI-Powered Partner in Smart Farming
        </p>
      </header>

      <NewsCarousel />

      <div className="w-full max-w-6xl mx-auto px-4 py-8">
         <p className="text-center text-lg text-foreground/90 mb-12 max-w-3xl mx-auto">
          Empowering Pakistani farmers with cutting-edge AI tools for crop diagnosis, real-time weather insights, a direct-to-consumer marketplace, and a supportive community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureSections.map((section, index) => (
            <Card key={index} className={`shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col ${index === 0 ? 'md:col-span-2' : ''}`}>
              <CardHeader className="items-center text-center">
                {section.icon}
                <CardTitle className="text-2xl text-primary">{section.title}</CardTitle>
                <CardDescription className="text-center px-2">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                {section.content}
              </CardContent>
              {index !== 0 && (
                <CardFooter className="mt-auto">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={section.disabled}>
                    {section.actionText}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>

      <footer className="w-full py-8 mt-12 text-center text-sm text-muted-foreground bg-card">
        <p>&copy; {new Date().getFullYear()} AgroSense. Revolutionizing Agriculture with AI.</p>
      </footer>
    </main>
  );
}

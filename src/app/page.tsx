
"use client";

import * as React from "react"; // Added React import
import { useState, useEffect } from "react";
import type { DiagnoseCropDiseaseOutput } from "@/ai/flows/diagnose-crop-disease";
import { diagnoseCropDisease } from "@/ai/flows/diagnose-crop-disease";
import { DiseaseDiagnosisForm, type DiagnosisFormValues } from "@/components/disease-diagnosis-form";
import { DiagnosisResultDisplay } from "@/components/diagnosis-result-display";
import { NewsCarousel } from "@/components/news-carousel";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, BotMessageSquare, CloudSun, Users, Store, Loader2, Phone, Info } from "lucide-react";
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
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


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
      id: "ai-diagnosis",
      title: "AI Powered Disease Diagnosis",
      description: "Upload an image of your crop and get an instant AI-powered disease diagnosis and treatment recommendations.",
      icon: <BotMessageSquare className="w-12 h-12 text-primary mb-4" />,
      content: (
        <>
          <DiseaseDiagnosisForm onSubmit={handleDiagnose} isLoading={isLoadingDiagnosis} />
          {isLoadingDiagnosis && (
            <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-inner mt-6 text-primary">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg font-semibold">Analyzing your crop...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </div>
          )}
          {diagnosisError && !isLoadingDiagnosis && (
            <Alert variant="destructive" className="mt-6 animate-in fade-in-50 duration-500">
              <AlertTriangle className="h-5 w-5" />
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
      id: "weather-updates",
      title: "Real-time Weather Updates & Alerts",
      description: "Access hyperlocal weather forecasts, receive timely alerts for adverse conditions, and plan your farming activities effectively.",
      icon: <CloudSun className="w-12 h-12 text-primary mb-4" />,
      actionText: "View Weather (Coming Soon)",
      content: <p className="text-muted-foreground text-center text-sm">Detailed weather information and alerts will be available here soon. Stay tuned for actionable insights to protect your crops and optimize yields.</p>,
      disabled: true,
    },
    {
      id: "marketplace",
      title: "Farmer-Consumer Marketplace",
      description: "Connect directly with consumers to sell your produce at fair prices. Expand your market reach and increase profitability.",
      icon: <Store className="w-12 h-12 text-primary mb-4" />,
      actionText: "Explore Marketplace (Coming Soon)",
      content: <p className="text-muted-foreground text-center text-sm">Our upcoming marketplace will bridge the gap between farmers and consumers, ensuring fair prices and fresh produce for everyone.</p>,
      disabled: true,
    },
    {
      id: "community",
      title: "Farmer Community",
      description: "Join a vibrant community of fellow farmers. Share knowledge, discuss challenges, and learn best practices from experts and peers.",
      icon: <Users className="w-12 h-12 text-primary mb-4" />,
      actionText: "Join Community (Coming Soon)",
      content: <p className="text-muted-foreground text-center text-sm">Connect, learn, and grow with a supportive network of farmers. Share your experiences and gain valuable insights from the community.</p>,
      disabled: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center px-4">
           <div className="mb-6">
             <Image 
                src="https://picsum.photos/seed/agrosensemain/120/120" 
                alt="AgroSense Illustration" 
                width={96} 
                height={96} 
                className="rounded-full mx-auto shadow-lg border-4 border-primary/50"
                data-ai-hint="modern agriculture" 
              />
           </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-6">
            Welcome to AgroSense
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Empowering Pakistani farmers with cutting-edge AI tools for crop diagnosis, real-time weather insights, a direct-to-consumer marketplace, and a supportive agricultural community. Let's grow smarter, together.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg" onClick={() => document.getElementById('ai-diagnosis')?.scrollIntoView()}>
            Get Started
          </Button>
        </div>
      </section>
      
      <NewsCarousel />

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 md:mb-16">Our Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {featureSections.map((section, index) => (
            <Card 
                key={section.id} 
                id={section.id} 
                className={`shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card rounded-xl overflow-hidden ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <CardHeader className="items-center text-center pt-8 pb-4 bg-primary/5">
                {section.icon}
                <CardTitle className="text-2xl md:text-3xl font-semibold text-primary">{section.title}</CardTitle>
                <CardDescription className="text-center px-4 text-sm md:text-base">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6 space-y-6">
                {section.content}
              </CardContent>
              {index !== 0 && ( /* No button for the first, larger section */
                <CardFooter className="mt-auto p-6 bg-primary/5">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base" disabled={section.disabled}>
                     {section.icon && React.cloneElement(section.icon as React.ReactElement<any>, { className: "w-5 h-5 mr-2" })}
                    {section.actionText}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section Placeholder */}
      <section id="contact" className="w-full bg-muted py-16 md:py-24">
        <div className="container mx-auto text-center px-4 max-w-3xl">
            <Info className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Get in Touch</h2>
            <p className="text-lg text-foreground/80 mb-8">
                Have questions or want to learn more about AgroSense? We'd love to hear from you. Our contact options will be available here soon.
            </p>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                Contact Us (Coming Soon)
            </Button>
        </div>
      </section>


      <footer className="w-full py-10 text-center text-sm text-muted-foreground bg-card border-t">
        <p>&copy; {currentYear ?? new Date().getFullYear()} AgroSense. Revolutionizing Agriculture with AI.</p>
        <p className="mt-1">Fostering a smarter, sustainable future for farming in Pakistan.</p>
      </footer>
    </main>
  );
}



"use client";

import type { DiagnoseCropDiseaseOutput } from "@/ai/flows/diagnose-crop-disease";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ListChecks, Info, ShieldCheck } from "lucide-react";

type DiagnosisResultDisplayProps = {
  result: DiagnoseCropDiseaseOutput;
};

export function DiagnosisResultDisplay({ result }: DiagnosisResultDisplayProps) {
  const confidencePercentage = Math.round(result.diseaseIdentification.confidenceLevel * 100);
  
  // Determine badge variant and color based on confidence
  let badgeVariant: "default" | "secondary" | "destructive" = "destructive";
  let progressColorClass = "bg-red-500"; // Default to red

  if (confidencePercentage > 75) {
    badgeVariant = "default"; // Typically green or primary
    progressColorClass = "bg-green-500";
  } else if (confidencePercentage > 40) {
    badgeVariant = "secondary"; // Typically yellow or a neutral
    progressColorClass = "bg-yellow-500";
  }


  return (
    <Card className="w-full shadow-lg animate-in fade-in-50 duration-500 mt-6 border-primary/20 bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <ShieldCheck className="w-7 h-7 mr-2 text-primary" /> Diagnosis Result
        </CardTitle>
        <CardDescription>
          Based on the provided information, here's the AI-powered diagnosis for your crop.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        <div className="space-y-2 p-4 border rounded-lg bg-background/80 shadow-sm">
          <h3 className="text-md font-semibold text-foreground/90 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-primary" /> Identified Disease
          </h3>
          <p className="text-xl font-bold text-primary">
            {result.diseaseIdentification.diseaseName}
          </p>
        </div>

        <div className="space-y-2 p-4 border rounded-lg bg-background/80 shadow-sm">
          <h3 className="text-md font-semibold text-foreground/90">Confidence Level</h3>
          <div className="flex items-center space-x-3">
            <Progress value={confidencePercentage} className={`w-full h-3 rounded-full [&>div]:${progressColorClass}`} />
            <Badge 
              variant={badgeVariant} 
              className={`px-3 py-1 text-sm font-medium
                ${confidencePercentage > 75 ? 'bg-green-500 text-white hover:bg-green-600' : 
                  confidencePercentage > 40 ? 'bg-yellow-500 text-accent-foreground hover:bg-yellow-600' : 
                  'bg-red-500 text-white hover:bg-red-600'}`}
            >
              {confidencePercentage}%
            </Badge>
          </div>
           <p className="text-xs text-muted-foreground mt-1">
            This is an AI estimate. For critical decisions, please consult a local agricultural expert.
          </p>
        </div>

        {result.recommendedActions && result.recommendedActions.length > 0 && (
          <div className="space-y-2 p-4 border rounded-lg bg-background/80 shadow-sm">
            <h3 className="text-md font-semibold text-foreground/90 flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-primary" /> Recommended Actions
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-foreground/90 pl-1">
              {result.recommendedActions.map((action, index) => (
                <li key={index} className="text-sm">{action}</li>
              ))}
            </ul>
          </div>
        )}

        {result.additionalNotes && (
          <div className="space-y-2 p-4 border rounded-lg bg-background/80 shadow-sm">
            <h3 className="text-md font-semibold text-foreground/90 flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" /> Additional Notes
            </h3>
            <p className="text-sm text-foreground/90">{result.additionalNotes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <p className="text-xs text-muted-foreground text-center w-full">
          Disclaimer: This AI diagnosis is for informational purposes only and should not replace professional agricultural advice.
        </p>
      </CardFooter>
    </Card>
  );
}

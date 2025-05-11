
"use client";

import type { DiagnoseCropDiseaseOutput } from "@/ai/flows/diagnose-crop-disease";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ListChecks, Info } from "lucide-react";

type DiagnosisResultDisplayProps = {
  result: DiagnoseCropDiseaseOutput;
};

export function DiagnosisResultDisplay({ result }: DiagnosisResultDisplayProps) {
  const confidencePercentage = Math.round(result.diseaseIdentification.confidenceLevel * 100);
  let confidenceColor = "bg-destructive"; // Red for low confidence
  if (confidencePercentage > 75) {
    confidenceColor = "bg-green-500"; // Green for high
  } else if (confidencePercentage > 40) {
    confidenceColor = "bg-yellow-500"; // Yellow for medium
  }

  return (
    <Card className="w-full shadow-lg animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <CheckCircle className="w-7 h-7 mr-2 text-green-600" /> Diagnosis Result
        </CardTitle>
        <CardDescription>
          Based on the provided information, here's the AI-powered diagnosis for your crop.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 p-4 border rounded-lg bg-background">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-primary" /> Identified Disease
          </h3>
          <p className="text-xl font-bold text-primary">
            {result.diseaseIdentification.diseaseName}
          </p>
        </div>

        <div className="space-y-2 p-4 border rounded-lg bg-background">
          <h3 className="text-lg font-semibold text-foreground">Confidence Level</h3>
          <div className="flex items-center space-x-2">
            <Progress value={confidencePercentage} className={`w-full h-3 [&>div]:${confidenceColor}`} />
            <Badge variant={confidencePercentage > 75 ? "default" : confidencePercentage > 40 ? "secondary" : "destructive"} 
                   className={confidencePercentage > 75 ? `bg-green-500 hover:bg-green-600` : confidencePercentage > 40 ? `bg-yellow-500 hover:bg-yellow-600 text-accent-foreground` : `bg-red-500 hover:bg-red-600`}>
              {confidencePercentage}%
            </Badge>
          </div>
           <p className="text-xs text-muted-foreground">
            This is an estimate of the AI's confidence in the diagnosis. For critical decisions, please consult a local expert.
          </p>
        </div>

        {result.recommendedActions && result.recommendedActions.length > 0 && (
          <div className="space-y-2 p-4 border rounded-lg bg-background">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <ListChecks className="w-5 h-5 mr-2 text-primary" /> Recommended Actions
            </h3>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {result.recommendedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {result.additionalNotes && (
          <div className="space-y-2 p-4 border rounded-lg bg-background">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" /> Additional Notes
            </h3>
            <p className="text-foreground">{result.additionalNotes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Disclaimer: This AI diagnosis is for informational purposes only and should not replace professional agricultural advice.
        </p>
      </CardFooter>
    </Card>
  );
}


"use client";

import * as z from "zod"; // Changed from type-only import
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, Leaf, Carrot, Flower2, Wheat } from "lucide-react"; // Removed AlertCircle as it's not used
import { useState, type ReactNode } from "react";

export const cropTypes = [
  { value: "Guava", label: "Guava", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Mango", label: "Mango", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Tomato", label: "Tomato", icon: <Carrot className="w-4 h-4 mr-2" /> },
  { value: "Cotton", label: "Cotton", icon: <Flower2 className="w-4 h-4 mr-2" /> },
  { value: "Rice", label: "Rice", icon: <Wheat className="w-4 h-4 mr-2" /> },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const diagnosisFormSchema = z.object({
  cropType: z.string({ required_error: "Crop type is required." }).min(1, "Crop type is required."),
  photo: z
    .custom<FileList>()
    .refine((files) => files && files.length === 1, "A photo of the crop is required.")
    .transform(files => files[0]) // Get the first file
    .refine((file) => file.size <= MAX_FILE_SIZE, `Photo must be 5MB or less.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are accepted."
    ),
  symptoms: z.string().optional(),
});

export type DiagnosisFormValues = z.infer<typeof diagnosisFormSchema>;

type DiseaseDiagnosisFormProps = {
  onSubmit: (values: DiagnosisFormValues) => Promise<void>;
  isLoading: boolean;
};

export function DiseaseDiagnosisForm({ onSubmit, isLoading }: DiseaseDiagnosisFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisFormSchema),
    defaultValues: {
      cropType: "",
      symptoms: "",
      // photo: undefined, // It's better to not set default for FileList
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Manually trigger validation for the photo field with FileList
      form.setValue("photo", files as unknown as FileList, { shouldValidate: true }); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      form.setValue("photo", undefined as any, { shouldValidate: true }); // Clear value and validate
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Crop Disease Diagnosis</CardTitle>
        <CardDescription>Upload an image of your crop and describe any symptoms to get an AI-powered diagnosis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a crop type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          <div className="flex items-center">
                            {crop.icon}
                            {crop.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Crop Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={handlePhotoChange} // Use custom handler
                      disabled={isLoading}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </FormControl>
                  {previewImage && (
                     <div className="mt-4 p-2 border border-dashed border-border rounded-md flex justify-center items-center bg-muted/50 aspect-video max-h-64">
                      <Image src={previewImage} alt="Crop preview" width={200} height={150} className="max-h-full w-auto object-contain rounded-md" data-ai-hint="crop preview" />
                    </div>
                  )}
                   {!previewImage && (
                    <div className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md bg-muted/30">
                      <div className="text-center text-muted-foreground">
                        <UploadCloud className="mx-auto h-8 w-8 mb-1" />
                        <p className="text-xs">Click to upload or drag and drop</p>
                        <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., yellow spots on leaves, wilting, etc."
                      className="resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                "Diagnose Crop"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

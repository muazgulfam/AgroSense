
"use client";

import * as z from "zod"; 
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
import { Loader2, UploadCloud, Leaf, Carrot, Flower2, Wheat } from "lucide-react"; 
import { useState, type ReactNode } from "react";

export const cropTypes = [
  { value: "Guava", label: "Guava", icon: <Leaf className="w-4 h-4 mr-2 text-primary" /> },
  { value: "Mango", label: "Mango", icon: <Leaf className="w-4 h-4 mr-2 text-primary" /> },
  { value: "Tomato", label: "Tomato", icon: <Carrot className="w-4 h-4 mr-2 text-primary" /> },
  { value: "Cotton", label: "Cotton", icon: <Flower2 className="w-4 h-4 mr-2 text-primary" /> },
  { value: "Rice", label: "Rice", icon: <Wheat className="w-4 h-4 mr-2 text-primary" /> },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const diagnosisFormSchema = z.object({
  cropType: z.string({ required_error: "Crop type is required." }).min(1, "Crop type is required."),
  photo: z
    .custom<FileList>()
    .refine((files) => files && files.length === 1, "A photo of the crop is required.")
    .transform(files => files[0]) 
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
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      form.setValue("photo", files as unknown as FileList, { shouldValidate: true }); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      form.setValue("photo", undefined as any, { shouldValidate: true }); 
    }
  };

  return (
    <Card className="w-full shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Crop Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="bg-background hover:bg-muted">
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
                  <FormLabel className="text-foreground/80">Crop Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={handlePhotoChange} 
                      disabled={isLoading}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-background hover:bg-muted"
                    />
                  </FormControl>
                  {previewImage && (
                     <div className="mt-4 p-2 border border-dashed border-border rounded-md flex justify-center items-center bg-muted/50 aspect-[16/10] max-h-72">
                      <Image src={previewImage} alt="Crop preview" width={250} height={200} className="max-h-full w-auto object-contain rounded-md shadow-md" data-ai-hint="crop preview" />
                    </div>
                  )}
                   {!previewImage && (
                    <div className="mt-2 flex items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="text-center text-muted-foreground">
                        <UploadCloud className="mx-auto h-10 w-10 mb-2 text-primary/70" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
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
                  <FormLabel className="text-foreground/80">Symptoms (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., yellow spots on leaves, wilting, stem discoloration, etc."
                      className="resize-none bg-background hover:bg-muted"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/components/auth-context";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { recogniseCar } from "@/components/lib/api-client";

type RecognitionResult = {
  "make+model": string;
  confidence: number;
};

export default function RecognisePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<RecognitionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);

    try {
      
      const data = await recogniseCar(file);
      console.log(data);
      console.log(localStorage.getItem("user_id"))
      setResults(data.results);
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Recognise Car</h1>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {preview && (
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-64">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  layout="fill" 
                  objectFit="contain"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recognition Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make + Model</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result["make+model"]}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={result.confidence * 100} className="w-[60%]" />
                          <span>{(result.confidence * 100).toFixed(2)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload and Recognise Car</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Select Image</Label>
              <Input id="image-upload" type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? "Recognizing..." : "Recognize"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
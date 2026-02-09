"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';

export default function DashboardContent() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // FIXED: Added 'async' keyword and ensured proper bracket closure
  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-900">Viralook Generator</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the look or trend..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || !prompt}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
 {result && (
  <Card className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
    <CardHeader>
      <CardTitle>Generated Result</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center p-0">
      {/* If result.imageUrl exists, show the image. Otherwise, show the raw data as backup. */}
      {result.imageUrl ? (
        <div className="relative w-full aspect-square max-w-lg">
          <img 
            src={result.imageUrl} 
            alt="AI Generated Look" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="rounded-lg bg-slate-100 p-4 w-full">
          <pre className="whitespace-pre-wrap text-sm text-red-500">
            Image URL not found. Raw result:
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </CardContent>
  </Card>
)}
        </div>
      </main>
    </div>
  );
}

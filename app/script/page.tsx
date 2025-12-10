"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Film, Download, Copy, Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { generateScript } from '@/lib/generate-script';

const SCRIPT_TYPES = [
  { id: 'short', name: 'Short Film', duration: '5-10 minutes', pages: '5-10 pages' },
  { id: 'scene', name: 'Single Scene', duration: '2-5 minutes', pages: '2-5 pages' },
  { id: 'feature', name: 'Feature Film', duration: '90-120 minutes', pages: '90-120 pages' },
  { id: 'tv', name: 'TV Episode', duration: '22-44 minutes', pages: '22-44 pages' },
];

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance',
  'Thriller', 'Mystery', 'Fantasy', 'Adventure'
];

export default function ScriptGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [scriptType, setScriptType] = useState('short');
  const [genre, setGenre] = useState('Drama');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your script');
      return;
    }

    setLoading(true);
    setError('');
    setScript('');

    try {
      const result = await generateScript({
        prompt: prompt.trim(),
        scriptType,
        genre
      });
      setScript(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedType = SCRIPT_TYPES.find(t => t.id === scriptType);

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-10 h-10 text-indigo-600" />
              <h1 className="text-xl md:text-4xl font-bold text-gray-800">Script Generator</h1>
            </div>
            <p className="text-gray-600">Create professional movie scripts with AI</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        {!script ? (

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What is your script about?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Example: A detective discovers that her partner is actually from the future, as they race against time, she must decide whether to trust him or turn him in..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="text-base"
                  />

                  <div className="text-sm text-gray-500">
                    💡 Tip: Include main characters, conflict, and setting for best results
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
{ prompt.trim() &&(
       <Button
                size="lg"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-blue-700 hover:bg-blue-700 text-lg py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Script
                  </>
                )}
              </Button>
)
}

            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Script Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {SCRIPT_TYPES.map((type) => (
                    <Card
                      key={type.id}
                      onClick={() => setScriptType(type.id)}
                      className={`cursor-pointer transition-all ${
                        scriptType === type.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="font-semibold text-sm">{type.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.duration}</div>
                        <div className="text-xs text-gray-400">{type.pages}</div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Genre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => (
                      <Badge
                        key={g}
                        variant={genre === g ? "default" : "outline"}
                        className={`cursor-pointer ${
                          genre === g ? 'bg-indigo-600' : ''
                        }`}
                        onClick={() => setGenre(g)}
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-indigo-900 mb-2">
                    {selectedType?.name}
                  </div>
                  <div className="text-xs text-indigo-700 space-y-1">
                    <div>⏱️ {selectedType?.duration}</div>
                    <div>📄 {selectedType?.pages}</div>
                    <div>🎬 Genre: {genre}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Script Display */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-600">{selectedType?.name}</Badge>
                <Badge variant="outline">{genre}</Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setScript('')} variant="outline" size="sm">
                  New Script
                </Button>
                <Button onClick={handleCopy} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800">
                  {script}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
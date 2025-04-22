
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, Ticket, Plus, X } from "lucide-react";

export default function TokenGenerator() {
  const [tokenCount, setTokenCount] = useState(5);
  const [coinValue, setCoinValue] = useState(100);
  const [prefix, setPrefix] = useState("BONUS");
  const [generatedTokens, setGeneratedTokens] = useState<{token: string, value: number}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate random token
  const generateRandomToken = (prefix: string) => {
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}${randomPart}`;
  };

  // Generate tokens
  const handleGenerateTokens = () => {
    if (tokenCount <= 0 || coinValue <= 0) {
      toast.error("Please enter valid values for token count and coin value");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newTokens: {token: string, value: number}[] = [];
      
      for (let i = 0; i < tokenCount; i++) {
        newTokens.push({
          token: generateRandomToken(prefix),
          value: coinValue
        });
      }
      
      setGeneratedTokens(newTokens);
      setIsGenerating(false);
      toast.success(`Generated ${tokenCount} tokens`);
    }, 1000);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    const tokensText = generatedTokens.map(t => `${t.token} (${t.value} coins)`).join('\n');
    navigator.clipboard.writeText(tokensText);
    toast.success("Tokens copied to clipboard");
  };

  // Download as CSV
  const downloadAsCSV = () => {
    const csvContent = 
      "token,value\n" + 
      generatedTokens.map(t => `${t.token},${t.value}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'tokens.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Tokens downloaded as CSV");
  };

  // Clear generated tokens
  const clearTokens = () => {
    setGeneratedTokens([]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Token Generator</h2>
          <p className="text-muted-foreground">
            Generate promotional tokens for users to redeem
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Token Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Tokens</CardTitle>
              <CardDescription>
                Create bulk token codes for promotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prefix">Token Prefix</Label>
                <Input
                  id="prefix"
                  placeholder="BONUS"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Add a prefix to make tokens recognizable
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Number of Tokens: {tokenCount}</Label>
                <Slider
                  value={[tokenCount]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setTokenCount(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Coin Value per Token: {coinValue}</Label>
                <Slider
                  value={[coinValue]}
                  min={10}
                  max={1000}
                  step={10}
                  onValueChange={(value) => setCoinValue(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleGenerateTokens}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Generate Tokens
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Generated Tokens */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Tokens</CardTitle>
                <CardDescription>
                  {generatedTokens.length} tokens generated
                </CardDescription>
              </div>
              {generatedTokens.length > 0 && (
                <Button variant="ghost" size="icon" onClick={clearTokens}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {generatedTokens.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {generatedTokens.map((token, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span className="font-mono">{token.token}</span>
                        </div>
                        <div className="text-sm">{token.value} coins</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Ticket className="h-12 w-12 mb-4 opacity-20" />
                  <p>No tokens generated yet</p>
                  <p className="text-xs mt-1">Use the form to generate tokens</p>
                </div>
              )}
            </CardContent>
            {generatedTokens.length > 0 && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
                <Button variant="outline" onClick={downloadAsCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

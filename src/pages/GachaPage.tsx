
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Coins } from "lucide-react";

interface CaseType {
  id: string;
  name: string;
  price: number;
  chance: number;
  className: string;
}

interface AltAccount {
  username: string;
  email: string;
  password: string;
}

export default function GachaPage() {
  const [userCoins, setUserCoins] = useState(500);
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [isGachaInProgress, setIsGachaInProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gachaResult, setGachaResult] = useState<AltAccount | null>(null);
  
  // Mock case types data
  const caseTypes: CaseType[] = [
    { id: "1", name: "Common", price: 50, chance: 20, className: "rarity-common" },
    { id: "2", name: "Rare", price: 100, chance: 10, className: "rarity-rare" },
    { id: "3", name: "Epic", price: 200, chance: 5, className: "rarity-epic" },
    { id: "4", name: "Legendary", price: 500, chance: 1, className: "rarity-legendary" },
    { id: "5", name: "Mythic", price: 1000, chance: 0.1, className: "rarity-mythic" },
  ];

  // Mock gacha pull function
  const handleGachaPull = () => {
    if (!selectedCase) return;
    
    if (userCoins < selectedCase.price) {
      toast.error("Not enough coins!");
      return;
    }
    
    setIsGachaInProgress(true);
    setUserCoins(userCoins - selectedCase.price);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock result - would come from backend in real app
      const mockAccount = {
        username: "lucky_user" + Math.floor(Math.random() * 1000),
        email: "user" + Math.floor(Math.random() * 1000) + "@example.com",
        password: "p@ssw0rd" + Math.floor(Math.random() * 100),
      };
      
      setGachaResult(mockAccount);
      setIsGachaInProgress(false);
      setShowResult(true);
      
      toast.success(`You got a ${selectedCase.name} account!`);
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Gacha Pulls</h2>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="font-bold">{userCoins} coins</span>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          Select a case type and try your luck to get random alt accounts!
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {caseTypes.map((caseType) => (
            <Card
              key={caseType.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedCase?.id === caseType.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedCase(caseType)}
            >
              <div className={`absolute inset-0 opacity-20 ${caseType.className}`} />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{caseType.name}</CardTitle>
                  <Badge variant="outline" className="bg-background/80">
                    {caseType.chance}%
                  </Badge>
                </div>
                <CardDescription>
                  Price: {caseType.price} coins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`rarity-card ${caseType.className} h-32 flex items-center justify-center`}>
                  <span className="text-xl font-bold">{caseType.name}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={userCoins < caseType.price}
                  variant={selectedCase?.id === caseType.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCase(caseType);
                  }}
                >
                  {userCoins < caseType.price ? "Not enough coins" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            disabled={!selectedCase || isGachaInProgress}
            onClick={handleGachaPull}
            className="w-full max-w-md text-lg py-6"
          >
            {isGachaInProgress ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Opening {selectedCase?.name} Case...
              </span>
            ) : (
              `Pull Gacha (${selectedCase ? selectedCase.price : "?"} coins)`
            )}
          </Button>
        </div>
        
        {/* Gacha Result Dialog */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                {selectedCase?.name} Account Unlocked!
              </DialogTitle>
              <DialogDescription className="text-center">
                You've obtained a new alt account
              </DialogDescription>
            </DialogHeader>
            
            {gachaResult && (
              <div className="py-6">
                <div className={`p-6 rounded-lg ${selectedCase?.className} mb-4`}>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/70">Username</p>
                      <p className="font-mono font-bold">{gachaResult.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Email</p>
                      <p className="font-mono font-bold">{gachaResult.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Password</p>
                      <p className="font-mono font-bold">{gachaResult.password}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <Button 
                    onClick={() => {
                      toast.success("Account copied to clipboard!");
                      setShowResult(false);
                    }}
                  >
                    Copy Account
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowResult(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

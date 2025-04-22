
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/context/AuthContext";

interface CaseType {
  id: string;
  name: string;
  price: number;
  chance: number;
  accounts: number;
  className: string;
}

interface AltAccount {
  username: string;
  email: string;
  password: string;
  line: number;
}

export default function GachaPage() {
  const { user, updateCoins } = useAuth();
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [isGachaInProgress, setIsGachaInProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gachaResults, setGachaResults] = useState<AltAccount[]>([]);
  const [accountData, setAccountData] = useState<string[]>([]);
  const [usedLines, setUsedLines] = useState<number[]>([]);
  
  // Case types data
  const caseTypes: CaseType[] = [
    { id: "1", name: "Common", price: 50, chance: 20, accounts: 5, className: "bg-gradient-to-br from-gray-500 to-gray-700" },
    { id: "2", name: "Rare", price: 100, chance: 10, accounts: 10, className: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { id: "3", name: "Epic", price: 200, chance: 5, accounts: 50, className: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { id: "4", name: "Legendary", price: 500, chance: 1, accounts: 100, className: "bg-gradient-to-br from-orange-500 to-orange-700" },
    { id: "5", name: "Mythic", price: 1000, chance: 0.1, accounts: 250, className: "bg-gradient-to-br from-red-500 to-red-700" },
  ];

  // Fetch account data
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/yogaxdd/alt-gacha-haven/refs/heads/main/src/hooks/use-portable.txt");
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        setAccountData(lines);
        
        // Load used lines from localStorage
        const storedUsedLines = localStorage.getItem('usedLines');
        if (storedUsedLines) {
          setUsedLines(JSON.parse(storedUsedLines));
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
        toast.error("Failed to load account data");
      }
    };
    
    fetchAccountData();
  }, []);

  // Parse account data from a line
  const parseAccountData = (line: string, lineNumber: number): AltAccount => {
    const [email, password] = line.split(':');
    return {
      username: email.split('@')[0],
      email,
      password,
      line: lineNumber
    };
  };

  // Get random accounts from the data
  const getRandomAccounts = (count: number) => {
    const results: AltAccount[] = [];
    const totalLines = accountData.length;
    const availableLines = Array.from({ length: totalLines }, (_, i) => i)
      .filter(lineNum => !usedLines.includes(lineNum));
    
    if (availableLines.length < count) {
      toast.error("Not enough unique accounts available!");
      return [];
    }
    
    // Shuffle the available lines
    const shuffled = [...availableLines].sort(() => 0.5 - Math.random());
    const selectedLines = shuffled.slice(0, count);
    
    // Mark these lines as used
    const newUsedLines = [...usedLines, ...selectedLines];
    setUsedLines(newUsedLines);
    localStorage.setItem('usedLines', JSON.stringify(newUsedLines));
    
    // Parse the accounts
    for (const lineNum of selectedLines) {
      results.push(parseAccountData(accountData[lineNum], lineNum));
    }
    
    return results;
  };

  // Handle gacha pull
  const handleGachaPull = () => {
    if (!selectedCase || !user) return;
    
    if (user.coins < selectedCase.price) {
      toast.error("Not enough coins!");
      return;
    }
    
    setIsGachaInProgress(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Get random accounts based on case type
        const results = getRandomAccounts(selectedCase.accounts);
        
        if (results.length === 0) {
          setIsGachaInProgress(false);
          return;
        }
        
        // Update user coins
        const newCoins = user.coins - selectedCase.price;
        updateCoins(newCoins);
        
        // Update results
        setGachaResults(results);
        setIsGachaInProgress(false);
        setShowResult(true);
        
        toast.success(`You got ${results.length} ${selectedCase.name} accounts!`);
        
        // In a real app, we would save this to the database
        const gachaRecord = {
          userId: user.id,
          caseType: selectedCase.name,
          cost: selectedCase.price,
          accounts: results,
          date: new Date().toISOString()
        };
        
        // Save to local storage for the recent history
        const savedRecords = localStorage.getItem('gachaRecords');
        const records = savedRecords ? JSON.parse(savedRecords) : [];
        records.unshift(gachaRecord);
        localStorage.setItem('gachaRecords', JSON.stringify(records.slice(0, 10)));
        
      } catch (error) {
        console.error("Error in gacha pull:", error);
        toast.error("An error occurred during gacha pull");
        setIsGachaInProgress(false);
      }
    }, 2000);
  };

  const handleCopyAccount = (account: AltAccount) => {
    const text = `${account.email}:${account.password}`;
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Account copied to clipboard!"))
      .catch(() => toast.error("Failed to copy account"));
  };

  const handleCopyAllAccounts = () => {
    const text = gachaResults.map(acc => `${acc.email}:${acc.password}`).join('\n');
    navigator.clipboard.writeText(text)
      .then(() => toast.success("All accounts copied to clipboard!"))
      .catch(() => toast.error("Failed to copy accounts"));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Gacha Pulls</h2>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="font-bold">{user?.coins || 0} coins</span>
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
              <div className={`absolute inset-0 opacity-20 ${caseType.id}`} />
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
                <div className={`${caseType.className} h-32 flex items-center justify-center rounded-lg`}>
                  <div className="text-center text-white">
                    <span className="text-xl font-bold block">{caseType.name}</span>
                    <span className="text-sm block mt-1">{caseType.accounts} Accounts</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={user ? user.coins < caseType.price : true}
                  variant={selectedCase?.id === caseType.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCase(caseType);
                  }}
                >
                  {user && user.coins < caseType.price ? "Not enough coins" : "Select"}
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
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                {selectedCase?.name} Accounts Unlocked!
              </DialogTitle>
              <DialogDescription className="text-center">
                You've obtained {gachaResults.length} new alt accounts
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <div className="max-h-[400px] overflow-y-auto mb-4 space-y-3">
                {gachaResults.map((account, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg text-white ${selectedCase?.className}`}
                    onClick={() => handleCopyAccount(account)}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{account.username}</span>
                        <Badge variant="outline" className="bg-white/10">
                          Account #{index + 1}
                        </Badge>
                      </div>
                      <div className="font-mono text-sm overflow-hidden text-ellipsis">
                        {account.email}:{account.password}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={handleCopyAllAccounts}
                >
                  Copy All Accounts
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowResult(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

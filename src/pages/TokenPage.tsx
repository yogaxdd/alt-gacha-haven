
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Ticket, Coins, ArrowRight } from "lucide-react";

export default function TokenPage() {
  const [userCoins, setUserCoins] = useState(500);
  const [token, setToken] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [recentTokens, setRecentTokens] = useState<{token: string, reward: number, date: string}[]>([]);

  // Mock token validation and redemption
  const handleTokenRedeem = () => {
    if (!token.trim()) {
      toast.error("Please enter a token");
      return;
    }
    
    setIsRedeeming(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock valid tokens for testing
      const validTokens: {[key: string]: number} = {
        "WELCOME100": 100,
        "BONUS200": 200,
        "FREECOIN50": 50,
      };
      
      if (token in validTokens) {
        const reward = validTokens[token];
        setUserCoins(prev => prev + reward);
        setRecentTokens(prev => [{
          token: token,
          reward: reward,
          date: new Date().toLocaleDateString()
        }, ...prev.slice(0, 4)]);
        toast.success(`Successfully redeemed ${reward} coins!`);
      } else {
        toast.error("Invalid or already used token");
      }
      
      setToken("");
      setIsRedeeming(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Redeem Token</h2>
            <p className="text-muted-foreground">Enter a token code to claim rewards</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="font-bold">{userCoins} coins</span>
          </div>
        </div>
        
        {/* Token Redemption Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Token Redemption
            </CardTitle>
            <CardDescription>
              Enter your token code below to claim coins or other rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="token"
                    placeholder="Enter token (e.g. WELCOME100)"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleTokenRedeem}
                    disabled={isRedeeming || !token.trim()}
                  >
                    {isRedeeming ? "Redeeming..." : "Redeem"}
                  </Button>
                </div>
              </div>
              
              <div className="bg-background/20 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                <h3 className="font-medium mb-2">How to get tokens:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Follow our social media accounts for giveaways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Join our Discord community for special events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Watch our partner streamers for exclusive codes</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Redemptions</CardTitle>
            <CardDescription>
              Your recently redeemed tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTokens.length > 0 ? (
              <div className="space-y-4">
                {recentTokens.map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.token}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      <Coins className="h-3 w-3" />
                      {item.reward}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No tokens redeemed yet</p>
                <p className="text-xs mt-1">Try redeeming a token to see your history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

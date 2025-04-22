
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Coins, Gift, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TokenRedeemProps {
  tokenId?: string;
}

interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  label: string;
}

export default function TokenPage() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const { user, updateCoins } = useAuth();
  const [token, setToken] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  
  // Coin packages
  const coinPackages: CoinPackage[] = [
    { id: "1", coins: 100, price: 10000, label: "100 coins" },
    { id: "2", coins: 500, price: 35000, label: "500 coins" },
    { id: "3", coins: 1000, price: 70000, label: "1000 coins" },
    { id: "4", coins: 2000, price: 130000, label: "2000 coins" },
    { id: "5", coins: 5000, price: 300000, label: "5000 coins" },
  ];
  
  // Check for token in URL
  useEffect(() => {
    if (tokenId) {
      setToken(tokenId);
      handleRedeemToken(tokenId);
    }
  }, [tokenId]);
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Redeem token
  const handleRedeemToken = (tokenToRedeem: string) => {
    setIsRedeeming(true);
    
    // Get already redeemed tokens
    const redeemedTokens = localStorage.getItem('redeemedTokens');
    const tokens = redeemedTokens ? JSON.parse(redeemedTokens) : [];
    
    // Check if token already redeemed
    if (tokens.includes(tokenToRedeem)) {
      toast.error("This token has already been redeemed!");
      setIsRedeeming(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Token validation logic (in a real app, this would be an API call)
      const tokenValid = tokenToRedeem.length >= 8; // Simple validation for demo
      
      if (tokenValid) {
        // Generate a random coin amount between 50 and 500
        const coinsAwarded = Math.floor(Math.random() * 450) + 50;
        
        // Update user coins
        if (user) {
          updateCoins(user.coins + coinsAwarded);
        }
        
        // Mark token as redeemed
        const updatedTokens = [...tokens, tokenToRedeem];
        localStorage.setItem('redeemedTokens', JSON.stringify(updatedTokens));
        
        toast.success(`Successfully redeemed ${coinsAwarded} coins!`);
        setRedeemed(true);
      } else {
        toast.error("Invalid token!");
      }
      
      setIsRedeeming(false);
    }, 1500);
  };
  
  // Buy coins - redirect to WhatsApp
  const handleBuyCoins = (pkg: CoinPackage) => {
    const message = `Halo, saya ingin membeli ${pkg.coins} koin seharga ${formatPrice(pkg.price)}. Email: ${user?.email}`;
    const whatsappUrl = `https://wa.me/6288231347368?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tokens & Coins</h2>
            <p className="text-muted-foreground">Redeem tokens or purchase coins</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="font-bold">{user?.coins || 0} coins</span>
          </div>
        </div>
        
        <Tabs defaultValue="redeem" className="space-y-4">
          <TabsList>
            <TabsTrigger value="redeem">Redeem Token</TabsTrigger>
            <TabsTrigger value="buy">Buy Coins</TabsTrigger>
          </TabsList>
          
          {/* Redeem Token Tab */}
          <TabsContent value="redeem">
            <Card>
              <CardHeader>
                <CardTitle>Redeem Token</CardTitle>
                <CardDescription>
                  Enter your token code to receive coins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Input
                        disabled={isRedeeming}
                        placeholder="Enter token code here"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                      />
                    </div>
                    <Button
                      disabled={!token || isRedeeming}
                      onClick={() => handleRedeemToken(token)}
                      className="w-full"
                    >
                      {isRedeeming ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Redeeming...
                        </span>
                      ) : "Redeem"}
                    </Button>
                  </div>
                  
                  {redeemed && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-md">
                      Token successfully redeemed!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Buy Coins Tab */}
          <TabsContent value="buy">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Coins</CardTitle>
                <CardDescription>
                  Select a coin package to purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {coinPackages.map((pkg) => (
                    <Card key={pkg.id} className="bg-background border-2 hover:border-primary transition-all duration-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Coins className="h-5 w-5 text-yellow-400" />
                            {pkg.coins}
                          </CardTitle>
                          <div className="text-sm font-medium">
                            {formatPrice(pkg.price)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handleBuyCoins(pkg)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  After clicking "Buy Now" you'll be redirected to WhatsApp to complete your purchase.
                </p>
                <div className="flex items-center p-4 rounded-lg bg-muted">
                  <Gift className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h4 className="font-medium">Have a promotional code?</h4>
                    <p className="text-sm text-muted-foreground">
                      Switch to the "Redeem Token" tab to use your code.
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

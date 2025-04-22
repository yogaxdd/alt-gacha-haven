
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gift, Award, Ticket, Coins, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

interface GachaRecord {
  userId: string;
  caseType: string;
  cost: number;
  accounts: any[];
  date: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [unclaimedQuests, setUnclaimedQuests] = useState(2);
  const [gachaRecords, setGachaRecords] = useState<GachaRecord[]>([]);
  
  // Load gacha records from localStorage
  useEffect(() => {
    const loadGachaRecords = () => {
      try {
        const savedRecords = localStorage.getItem('gachaRecords');
        if (savedRecords) {
          const records = JSON.parse(savedRecords);
          setGachaRecords(records);
        }
      } catch (error) {
        console.error("Error loading gacha records:", error);
      }
    };
    
    loadGachaRecords();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Calculate difference in milliseconds
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 60) {
        return diffMins <= 1 ? "just now" : `${diffMins} mins ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get case color class based on case type
  const getCaseColorClass = (caseType: string) => {
    switch (caseType.toLowerCase()) {
      case "common": return "bg-gray-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-orange-500";
      case "mythic": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Coin Balance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Coin Balance</CardTitle>
              <Coins className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.coins || 0} coins</div>
              <p className="text-xs text-muted-foreground">
                Earn more coins by completing quests
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/quest" className="w-full">
                <Button variant="outline" className="w-full">
                  Earn More Coins
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Unclaimed Quests Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unclaimed Quests</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unclaimedQuests} quests</div>
              <p className="text-xs text-muted-foreground">
                Potential rewards: 200 coins
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/quest" className="w-full">
                <Button variant="outline" className="w-full">
                  View Quests
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Gacha Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gacha Pulls</CardTitle>
              <Gift className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gachaRecords.reduce((acc, record) => acc + record.accounts.length, 0)} accounts</div>
              <p className="text-xs text-muted-foreground">
                Last pull: {gachaRecords.length > 0 ? formatDate(gachaRecords[0].date) : "Never"}
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/gacha" className="w-full">
                <Button variant="outline" className="w-full">
                  Go to Gacha
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Gacha Pulls</CardTitle>
            <CardDescription>
              Your latest alt account acquisitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {gachaRecords.map((record, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${getCaseColorClass(record.caseType)}`}></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{record.caseType} Case ({record.accounts.length} accounts)</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" /> {formatDate(record.date)}
                        </div>
                      </div>
                      <p className="text-xs truncate">
                        {record.accounts.map((acc: any) => acc.email).slice(0, 2).join(", ")}
                        {record.accounts.length > 2 ? ` and ${record.accounts.length - 2} more` : ""}
                      </p>
                    </div>
                  </div>
                ))}
                {gachaRecords.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gift className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No gacha pulls yet. Try your luck!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Link to="/gacha" className="w-full">
              <Button className="w-full">Pull Gacha</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Daily Login Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Login Streak</CardTitle>
            <CardDescription>
              Log in daily for bonus rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={40} className="h-2" />
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className={`text-center ${day <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-full aspect-square rounded-md flex items-center justify-center mb-1 text-xs
                      ${day <= 3 ? 'bg-primary/20 border border-primary/50' : 'bg-muted border border-border'}`}>
                      {day}
                    </div>
                    <span className="text-xs">{day * 50}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

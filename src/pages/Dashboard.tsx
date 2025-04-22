
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Gift, Award, Ticket, Coins, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";

interface GachaRecord {
  id: string;
  caseType: string;
  account: string;
  date: string;
  color: string;
}

export default function Dashboard() {
  const [coins, setCoins] = useState(500);
  const [unclaimedQuests, setUnclaimedQuests] = useState(2);
  const [gachaRecords, setGachaRecords] = useState<GachaRecord[]>([]);
  
  // Mock data for gacha records
  useEffect(() => {
    const mockRecords = [
      { id: "1", caseType: "Common", account: "user123", date: "2 mins ago", color: "bg-gray-500" },
      { id: "2", caseType: "Rare", account: "cooluser@gmail.com", date: "3 hours ago", color: "bg-blue-500" },
      { id: "3", caseType: "Epic", account: "gamer456", date: "Yesterday", color: "bg-purple-500" },
    ];
    setGachaRecords(mockRecords);
  }, []);

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
              <div className="text-2xl font-bold">{coins} coins</div>
              <p className="text-xs text-muted-foreground">
                +200 coins earned this week
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
              <div className="text-2xl font-bold">3 accounts</div>
              <p className="text-xs text-muted-foreground">
                Last pull: 2 hours ago
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
                {gachaRecords.map((record) => (
                  <div key={record.id} className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${record.color}`}></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{record.caseType} Case</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" /> {record.date}
                        </div>
                      </div>
                      <p className="text-xs">{record.account}</p>
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

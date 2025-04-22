
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Award, MessageCircle, Coins, Star } from "lucide-react";

interface Quest {
  id: string;
  type: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ReactNode;
  completed: boolean;
  cooldown?: number;
}

export default function QuestPage() {
  const [userCoins, setUserCoins] = useState(500);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      type: "social",
      title: "Follow on TikTok",
      description: "Follow our TikTok channel to earn coins",
      reward: 100,
      icon: <MessageCircle className="h-5 w-5" />,
      completed: false,
    },
    {
      id: "2",
      type: "social",
      title: "Follow on Instagram",
      description: "Follow our Instagram page to earn coins",
      reward: 150,
      icon: <MessageCircle className="h-5 w-5" />,
      completed: false,
    },
    {
      id: "3",
      type: "content",
      title: "Subscribe on YouTube",
      description: "Subscribe to our YouTube channel to earn coins",
      reward: 200,
      icon: <Star className="h-5 w-5" />,
      completed: false,
    },
    {
      id: "4",
      type: "ad",
      title: "Watch an Ad",
      description: "Watch a short advertisement to earn coins",
      reward: 50,
      icon: <Coins className="h-5 w-5" />,
      completed: false,
      cooldown: 15, // Cooldown in minutes
    },
  ]);

  // Function to complete a quest
  const completeQuest = (questId: string) => {
    setQuests(quests.map(quest => {
      if (quest.id === questId) {
        // Add quest reward to user's balance
        setUserCoins(prev => prev + quest.reward);
        
        // Update daily progress
        setDailyProgress(prev => Math.min(prev + 25, 100));
        
        // Show success toast
        toast.success(`+${quest.reward} coins added to your balance!`);
        
        // Mark quest as completed
        return { ...quest, completed: true };
      }
      return quest;
    }));
  };

  // Calculate daily quest completion
  const completedQuests = quests.filter(quest => quest.completed).length;
  const totalQuests = quests.length;
  const questCompletionText = `${completedQuests}/${totalQuests} quests completed`;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Daily Quests</h2>
            <p className="text-muted-foreground">Complete quests to earn coins</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            <span className="font-bold">{userCoins} coins</span>
          </div>
        </div>
        
        {/* Daily Progress Tracker */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Progress</CardTitle>
            <CardDescription>{questCompletionText}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={dailyProgress} className="h-2" />
              <div className="grid grid-cols-4 gap-4 text-center text-xs">
                <div className={dailyProgress >= 25 ? "text-primary" : "text-muted-foreground"}>
                  <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center mb-1 ${dailyProgress >= 25 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>1</div>
                  <span>25%</span>
                </div>
                <div className={dailyProgress >= 50 ? "text-primary" : "text-muted-foreground"}>
                  <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center mb-1 ${dailyProgress >= 50 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>2</div>
                  <span>50%</span>
                </div>
                <div className={dailyProgress >= 75 ? "text-primary" : "text-muted-foreground"}>
                  <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center mb-1 ${dailyProgress >= 75 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>3</div>
                  <span>75%</span>
                </div>
                <div className={dailyProgress >= 100 ? "text-primary" : "text-muted-foreground"}>
                  <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center mb-1 ${dailyProgress >= 100 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>4</div>
                  <span>100%</span>
                </div>
              </div>
              {dailyProgress === 100 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-primary">All daily quests completed! +200 bonus coins</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Quest List */}
        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((quest) => (
            <Card key={quest.id} className={quest.completed ? "bg-muted/50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {quest.icon}
                      {quest.title}
                    </CardTitle>
                    <CardDescription>{quest.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    <Coins className="h-3 w-3" />
                    {quest.reward}
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={quest.completed ? "outline" : "default"}
                  disabled={quest.completed}
                  onClick={() => completeQuest(quest.id)}
                >
                  {quest.completed ? "Completed" : "Complete Quest"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

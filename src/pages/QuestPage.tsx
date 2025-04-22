
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Award, MessageCircle, Coins, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Quest {
  id: string;
  type: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ReactNode;
  completed: boolean;
  url?: string;
  cooldown?: number;
}

export default function QuestPage() {
  const { user, updateCoins } = useAuth();
  const [dailyProgress, setDailyProgress] = useState(0);
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      type: "social",
      title: "Follow on Instagram",
      description: "Follow @yogakokxd on Instagram to earn coins",
      reward: 50, // Updated to 50 coins
      icon: <MessageCircle className="h-5 w-5" />,
      completed: false,
      url: "https://www.instagram.com/yogakokxd/",
    },
    {
      id: "2",
      type: "social",
      title: "Follow on TikTok",
      description: "Follow @yogakokxd on TikTok to earn coins",
      reward: 50, // Updated to 50 coins
      icon: <MessageCircle className="h-5 w-5" />,
      completed: false,
      url: "http://tiktok.com/@yogakokxd",
    },
    {
      id: "3",
      type: "content",
      title: "Subscribe on YouTube",
      description: "Subscribe to YogaxD on YouTube to earn coins",
      reward: 50, // Updated to 50 coins
      icon: <Star className="h-5 w-5" />,
      completed: false,
      url: "https://youtube.com/YogaxD",
    },
    {
      id: "4",
      type: "ad",
      title: "Watch an Ad",
      description: "Watch a short advertisement to earn coins",
      reward: 50, // Updated to 50 coins
      icon: <Coins className="h-5 w-5" />,
      completed: false,
      cooldown: 15, // Cooldown in minutes
    },
    {
      id: "5",
      type: "referral",
      title: "Refer a Friend",
      description: "Invite a friend to join Alt Gacha Haven",
      reward: 50, // 50 coins per referral
      icon: <Award className="h-5 w-5" />,
      completed: false,
    },
  ]);

  // Load completed quests from localStorage on mount
  useState(() => {
    const savedQuests = localStorage.getItem("completedQuests");
    if (savedQuests) {
      const completedQuestIds = JSON.parse(savedQuests);
      setQuests(quests.map(quest => 
        completedQuestIds.includes(quest.id) ? {...quest, completed: true} : quest
      ));
      
      // Calculate progress
      const completedCount = completedQuestIds.length;
      setDailyProgress(Math.min((completedCount / quests.length) * 100, 100));
    }
  });

  // Function to complete a quest
  const completeQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    // Get completed quests from localStorage
    const savedQuests = localStorage.getItem("completedQuests");
    const completedQuestIds = savedQuests ? JSON.parse(savedQuests) : [];
    
    // Check if quest is already completed
    if (completedQuestIds.includes(questId)) {
      toast.error("You've already completed this quest!");
      return;
    }
    
    // Update quests state
    setQuests(quests.map(quest => {
      if (quest.id === questId) {
        // Add quest reward to user's balance
        if (user) {
          updateCoins(user.coins + quest.reward);
        }
        
        // Update daily progress
        const newCompletedCount = completedQuestIds.length + 1;
        setDailyProgress(Math.min((newCompletedCount / quests.length) * 100, 100));
        
        // Show success toast
        toast.success(`+${quest.reward} coins added to your balance!`);
        
        // Save completed quest to localStorage
        const updatedCompletedQuests = [...completedQuestIds, questId];
        localStorage.setItem("completedQuests", JSON.stringify(updatedCompletedQuests));
        
        // If it's a URL quest, open the URL in a new tab
        if (quest.url) {
          window.open(quest.url, "_blank");
        }
        
        // Generate referral code if it's the referral quest
        if (quest.id === "5") {
          const referralCode = `REF-${user?.id}-${Date.now()}`;
          localStorage.setItem("referralCode", referralCode);
          navigator.clipboard.writeText(`${window.location.origin}?ref=${referralCode}`);
          toast.success("Referral link copied to clipboard!");
        }
        
        // Mark quest as completed
        return { ...quest, completed: true };
      }
      return quest;
    }));
  };

  // Generate referral link 
  const getReferralLink = () => {
    const referralCode = localStorage.getItem("referralCode") || 
      `REF-${user?.id}-${Date.now()}`;
    return `${window.location.origin}?ref=${referralCode}`;
  };

  // Calculate daily quest completion
  const completedQuests = quests.filter(quest => quest.completed).length;
  const totalQuests = quests.length;
  const questCompletionText = `${completedQuests}/${totalQuests} quests completed`;
  
  // Check if all quests are completed and bonus not yet awarded
  useState(() => {
    if (dailyProgress === 100) {
      const bonusAwarded = localStorage.getItem("dailyBonusAwarded");
      if (bonusAwarded !== "true" && user) {
        // Award bonus coins
        updateCoins(user.coins + 200);
        toast.success("All daily quests completed! +200 bonus coins awarded!");
        localStorage.setItem("dailyBonusAwarded", "true");
      }
    }
  });

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
            <span className="font-bold">{user?.coins || 0} coins</span>
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
        
        {/* Referral System */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Referral Program</CardTitle>
            <CardDescription>Invite friends and earn 50 coins per referral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background p-3 rounded-md text-sm break-all mb-2">
              {getReferralLink()}
            </div>
            <p className="text-xs text-muted-foreground">Share this link with your friends. When they sign up, you'll receive 50 coins!</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(getReferralLink());
                toast.success("Referral link copied to clipboard!");
              }}
              className="w-full"
              variant="outline"
            >
              Copy Referral Link
            </Button>
          </CardFooter>
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

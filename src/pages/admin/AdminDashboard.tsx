
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Gift, Award, Ticket, Database, Ban } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  // Mock data for dashboard statistics
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 98,
    totalAltAccounts: 724,
    bannedAccounts: 12,
    gachaPulls: 432,
    tokensGenerated: 250,
    tokensRedeemed: 187,
    totalCoins: 25600,
  });
  
  // Mock data for charts
  const [dailyGachaData, setDailyGachaData] = useState([
    { name: "Mon", pulls: 45 },
    { name: "Tue", pulls: 52 },
    { name: "Wed", pulls: 38 },
    { name: "Thu", pulls: 65 },
    { name: "Fri", pulls: 89 },
    { name: "Sat", pulls: 102 },
    { name: "Sun", pulls: 41 },
  ]);
  
  const [caseTypeData, setCaseTypeData] = useState([
    { name: "Common", pulls: 230 },
    { name: "Rare", pulls: 120 },
    { name: "Epic", pulls: 60 },
    { name: "Legendary", pulls: 18 },
    { name: "Mythic", pulls: 4 },
  ]);
  
  const [userGrowthData, setUserGrowthData] = useState([
    { name: "Jan", users: 20 },
    { name: "Feb", users: 42 },
    { name: "Mar", users: 65 },
    { name: "Apr", users: 85 },
    { name: "May", users: 112 },
    { name: "Jun", users: 156 },
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of Alt Gacha Haven statistics and management
          </p>
        </div>
        
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active in last 7 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alt Accounts</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAltAccounts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.bannedAccounts} banned accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gacha Pulls</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.gachaPulls}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tokens</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tokensGenerated}</div>
              <p className="text-xs text-muted-foreground">
                {stats.tokensRedeemed} redeemed
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different data views */}
        <Tabs defaultValue="gacha" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gacha">Gacha Analytics</TabsTrigger>
            <TabsTrigger value="users">User Growth</TabsTrigger>
            <TabsTrigger value="cases">Case Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gacha" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Gacha Pulls</CardTitle>
                <CardDescription>
                  Number of gacha pulls per day over the last week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyGachaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pulls" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly user growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Type Distribution</CardTitle>
                <CardDescription>
                  Distribution of gacha pulls by case type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={caseTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pulls" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/tokens">
                <Ticket className="h-4 w-4" />
                Generate Tokens
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/accounts">
                <Ban className="h-4 w-4" />
                Manage Alt Accounts
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/cases">
                <Gift className="h-4 w-4" />
                Configure Case Types
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/users">
                <User className="h-4 w-4" />
                User Management
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

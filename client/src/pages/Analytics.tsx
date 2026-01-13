import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Download } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export default function Analytics() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [modelUsage, setModelUsage] = useState<{ name: string; value: number }[]>([]);
  const [conversationStats, setConversationStats] = useState<{ name: string; value: number }[]>([]);

  const { data: conversations } = trpc.chat.listConversations.useQuery();
  const { data: models } = trpc.chat.listModels.useQuery();

  useEffect(() => {
    if (conversations && models) {
      // Calculate model usage
      const modelCounts: Record<number, number> = {};
      conversations.forEach((conv) => {
        if (conv.modelId) {
          modelCounts[conv.modelId] = (modelCounts[conv.modelId] || 0) + 1;
        }
      });

      const modelUsageData = Object.entries(modelCounts).map(([modelId, count]) => {
        const model = models.find((m) => m.id === parseInt(modelId));
        return {
          name: model?.name || "Unknown",
          value: count,
        };
      });

      setModelUsage(modelUsageData);

      // Calculate conversation statistics
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const conversationsLast7 = conversations.filter(
        (c) => new Date(c.createdAt) > last7Days
      ).length;
      const conversationsLast30 = conversations.filter(
        (c) => new Date(c.createdAt) > last30Days
      ).length;

      setConversationStats([
        { name: "Last 7 Days", value: conversationsLast7 },
        { name: "Last 30 Days", value: conversationsLast30 },
        { name: "Total", value: conversations.length },
      ]);
    }
  }, [conversations, models]);

  const COLORS = ["#FF0000", "#333333", "#E5E5E5", "#F5F5F5"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/chat")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          </div>
          <Button variant="default" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Total Conversations
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {conversations?.length || 0}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Active Models
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {models?.length || 0}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Last 7 Days
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {conversationStats.find((s) => s.name === "Last 7 Days")?.value || 0}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Usage Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Model Usage</h2>
            {modelUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E5E5",
                    }}
                  />
                  <Bar dataKey="value" fill="#FF0000" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No model usage data available
              </p>
            )}
          </Card>

          {/* Conversation Statistics */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Conversation Trends
            </h2>
            {conversationStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversationStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conversationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No conversation data available
              </p>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Conversations</h2>
          {conversations && conversations.length > 0 ? (
            <div className="space-y-3">
              {conversations.slice(0, 5).map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between p-3 border border-border rounded hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{conv.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(conv.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/chat?id=${conv.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No conversations yet
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

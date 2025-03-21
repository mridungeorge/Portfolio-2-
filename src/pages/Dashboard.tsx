import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import ContactsTab from "@/components/dashboard/tabs/ContactsTab";
import InteractionsTab from "@/components/dashboard/tabs/InteractionsTab";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    profile,
    contactRequests,
    pageViewsData,
    interactionData,
    terminalCommands,
    loading
  } = useDashboardData();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const isLoading = authLoading || loading.profile;

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-t-4 border-cyber h-12 w-12 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-cyber">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Safely access profile properties with optional chaining and fallbacks
  // Define variables outside of JSX for better type handling
  const displayName = user?.email?.split('@')[0] || "User";
  const finalDisplayName = profile && 'full_name' in profile && profile.full_name
    ? profile.full_name
    : profile?.username || displayName;
    
  const avatarInitials = (
    profile?.username || 
    user?.email || 
    "U"
  ).substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-dark-lighter/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {finalDisplayName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <div className="glass p-2 rounded-lg flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={profile && 'avatar_url' in profile ? profile.avatar_url : undefined} 
                />
                <AvatarFallback className="bg-cyber/20 text-cyber">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{profile?.username || user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
            <TabsTrigger value="interactions">User Interactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              pageViewsData={pageViewsData} 
              interactionData={interactionData} 
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab contactRequests={contactRequests} />
          </TabsContent>

          <TabsContent value="interactions">
            <InteractionsTab 
              interactionData={interactionData} 
              terminalCommands={terminalCommands} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
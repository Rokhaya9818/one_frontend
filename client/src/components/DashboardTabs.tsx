import { Button } from "@/components/ui/button";
import { Home, Users, Stethoscope, Trees, Bird, Network, Download, TrendingUp } from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: Home },
  { id: "human", label: "Santé Humaine", icon: Users },
  { id: "animal", label: "Santé Animale", icon: Bird },
  { id: "environment", label: "Environnement", icon: Trees },
  { id: "correlations", label: "Corrélations One Health", icon: Network },
  { id: "import-fvr", label: "Import FVR", icon: Download },
  { id: "predictions", label: "Prédictions", icon: TrendingUp },
];

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 whitespace-nowrap transition-all
                ${isActive 
                  ? "bg-primary text-white shadow-md" 
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

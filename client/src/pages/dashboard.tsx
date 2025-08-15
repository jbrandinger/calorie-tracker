import { useQuery } from "@tanstack/react-query";
import { FoodEntry, CalorieGoal } from "@shared/schema";
import { format, subDays } from "date-fns";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import StatsCards from "@/components/dashboard/stats-cards";
import QuickAddForm from "@/components/dashboard/quick-add-form";
import RecentFoods from "@/components/dashboard/recent-foods";
import FoodLog from "@/components/dashboard/food-log";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

  const { data: todaysEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", today],
  });

  const { data: weeklyEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", { startDate: weekAgo, endDate: today }],
    queryFn: async () => {
      const response = await fetch(`/api/food-entries?startDate=${weekAgo}&endDate=${today}`);
      if (!response.ok) throw new Error('Failed to fetch weekly entries');
      return response.json();
    },
  });

  const { data: calorieGoal } = useQuery<CalorieGoal>({
    queryKey: ["/api/calorie-goals", today],
  });

  const defaultGoal = { id: "", dailyCaloriesGoal: 2000, date: today };
  const currentGoal = calorieGoal || defaultGoal;

  return (
    <div className="min-h-screen flex bg-gray-50" data-testid="dashboard-page">
      <Sidebar />
      <MobileHeader />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Today's Dashboard
              </h2>
              <p className="mt-1 text-sm text-gray-500" data-testid="current-date">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/add-food">
                <Button className="inline-flex items-center" data-testid="button-add-food-header">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add Food
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards
            todaysEntries={todaysEntries}
            calorieGoal={currentGoal}
            weeklyEntries={weeklyEntries}
          />

          {/* Quick Add and Recent Foods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <QuickAddForm />
            </div>
            <div className="lg:col-span-2">
              <RecentFoods />
            </div>
          </div>

          {/* Today's Food Log */}
          <div className="mb-8">
            <FoodLog />
          </div>

          {/* Weekly Progress Chart */}
          <WeeklyChart />
        </div>
      </div>
    </div>
  );
}

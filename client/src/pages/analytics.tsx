import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import StatsCards from "@/components/dashboard/stats-cards";
import { useQuery } from "@tanstack/react-query";
import { FoodEntry, CalorieGoal } from "@shared/schema";
import { format, subDays } from "date-fns";

export default function Analytics() {
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
    <div className="min-h-screen flex bg-gray-50" data-testid="analytics-page">
      <Sidebar />
      <MobileHeader />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Analytics
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Track your progress and analyze your eating patterns
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards
            todaysEntries={todaysEntries}
            calorieGoal={currentGoal}
            weeklyEntries={weeklyEntries}
          />

          {/* Weekly Progress Chart */}
          <div className="mb-8">
            <WeeklyChart />
          </div>
        </div>
      </div>
    </div>
  );
}

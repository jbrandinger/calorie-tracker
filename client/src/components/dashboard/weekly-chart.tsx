import { useQuery } from "@tanstack/react-query";
import { FoodEntry, CalorieGoal } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { format, subDays, startOfWeek, addDays } from "date-fns";

export default function WeeklyChart() {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endDate = format(today, 'yyyy-MM-dd');
  const startDate = format(startOfCurrentWeek, 'yyyy-MM-dd');

  const { data: weeklyEntries = [], isLoading } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", { startDate, endDate }],
    queryFn: async () => {
      const response = await fetch(`/api/food-entries?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch weekly entries');
      return response.json();
    },
  });

  const { data: calorieGoal } = useQuery<CalorieGoal>({
    queryKey: ["/api/calorie-goals", format(today, 'yyyy-MM-dd')],
  });

  const dailyGoal = calorieGoal?.dailyCaloriesGoal || 2000;

  // Group entries by date
  const entriesByDate = weeklyEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  // Generate week data
  const weekData = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfCurrentWeek, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntries = entriesByDate[dateStr] || [];
    const totalCalories = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    const isFuture = date > today;

    weekData.push({
      day: format(date, 'EEE'),
      date: dateStr,
      calories: totalCalories,
      percentage: Math.min(100, (totalCalories / dailyGoal) * 100),
      isToday,
      isFuture,
    });
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg animate-pulse" data-testid="weekly-chart-loading">
        <div className="px-4 py-5 sm:p-6">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 mx-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg" data-testid="weekly-chart">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Weekly Progress</h3>
        <div className="space-y-4">
          {weekData.map((day) => (
            <div
              key={day.date}
              className={`flex items-center ${day.isFuture ? 'opacity-50' : ''}`}
              data-testid={`week-day-${day.day.toLowerCase()}`}
            >
              <div className="w-12 text-sm text-gray-500">{day.day}</div>
              <div className="flex-1 mx-4">
                <Progress
                  value={day.percentage}
                  className="h-4"
                  data-testid={`progress-${day.day.toLowerCase()}`}
                />
              </div>
              <div className="w-20 text-sm text-right">
                <span
                  className={`font-medium ${
                    day.isToday ? 'text-primary' : day.isFuture ? 'text-gray-400' : 'text-gray-900'
                  }`}
                  data-testid={`calories-${day.day.toLowerCase()}`}
                >
                  {day.calories.toLocaleString()}
                </span>
                <span className={day.isFuture ? 'text-gray-400' : 'text-gray-500'}>
                  {' '} / {dailyGoal.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { FoodEntry, CalorieGoal } from "@shared/schema";
import { Zap, Clock, BarChart3, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsCardsProps {
  todaysEntries: FoodEntry[];
  calorieGoal: CalorieGoal;
  weeklyEntries: FoodEntry[];
}

export default function StatsCards({ todaysEntries, calorieGoal, weeklyEntries }: StatsCardsProps) {
  const totalCalories = todaysEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const caloriesRemaining = Math.max(0, calorieGoal.dailyCaloriesGoal - totalCalories);
  const progressPercentage = Math.min(100, (totalCalories / calorieGoal.dailyCaloriesGoal) * 100);
  
  const mealsToday = todaysEntries.length;
  const lastMeal = todaysEntries[todaysEntries.length - 1];
  const lastMealTime = lastMeal 
    ? new Date(lastMeal.timestamp!).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    : 'No meals yet';

  // Calculate weekly average
  const weeklyAverage = weeklyEntries.length > 0 
    ? Math.round(weeklyEntries.reduce((sum, entry) => sum + entry.calories, 0) / 7)
    : 0;

  // Goal status
  const isOnTrack = totalCalories >= calorieGoal.dailyCaloriesGoal * 0.8 && 
                    totalCalories <= calorieGoal.dailyCaloriesGoal * 1.2;
  const goalStatus = isOnTrack ? "On Track" : totalCalories < calorieGoal.dailyCaloriesGoal * 0.8 ? "Below Goal" : "Over Goal";
  const goalStatusColor = isOnTrack ? "text-success" : totalCalories < calorieGoal.dailyCaloriesGoal * 0.8 ? "text-warning" : "text-danger";

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Daily Calories Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg" data-testid="daily-calories-card">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Daily Calories</dt>
                <dd className="text-lg font-medium text-gray-900">
                  <span data-testid="calories-consumed">{totalCalories.toLocaleString()}</span> / <span data-testid="calories-goal">{calorieGoal.dailyCaloriesGoal.toLocaleString()}</span>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" data-testid="calories-progress" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="text-primary font-medium" data-testid="calories-remaining">
                {caloriesRemaining.toLocaleString()} calories
              </span> remaining
            </p>
          </div>
        </div>
      </div>

      {/* Meals Today Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg" data-testid="meals-today-card">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Meals Today</dt>
                <dd className="text-lg font-medium text-gray-900" data-testid="meals-count">{mealsToday}</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Last meal: <span className="font-medium" data-testid="last-meal-time">{lastMealTime}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Average Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg" data-testid="weekly-average-card">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning bg-opacity-10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Weekly Average</dt>
                <dd className="text-lg font-medium text-gray-900" data-testid="weekly-average">{weeklyAverage.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="text-success font-medium" data-testid="weekly-trend">Daily intake</span>
            </p>
          </div>
        </div>
      </div>

      {/* Goal Status Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg" data-testid="goal-status-card">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Goal Status</dt>
                <dd className={`text-lg font-medium ${goalStatusColor}`} data-testid="goal-status">{goalStatus}</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium" data-testid="goal-progress">Today's progress</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

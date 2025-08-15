import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Apple } from "lucide-react";

export default function RecentFoods() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: recentFoods = [], isLoading } = useQuery<FoodEntry[]>({
    queryKey: ["/api/recent-foods"],
  });

  const addRecentFood = useMutation({
    mutationFn: async (food: FoodEntry) => {
      const data = {
        name: food.name,
        calories: food.calories,
        serving: food.serving,
        mealType: "snack",
        date: today,
      };
      const response = await apiRequest("POST", "/api/food-entries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries", today] });
      toast({
        title: "Success",
        description: "Food added to today's log!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add food. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg animate-pulse" data-testid="recent-foods-loading">
        <div className="px-4 py-5 sm:p-6">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg" data-testid="recent-foods">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Foods</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View All
          </Button>
        </div>
        
        {recentFoods.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="no-recent-foods">
            <Apple className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent foods yet. Start adding foods to see them here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                data-testid={`recent-food-${food.id}`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Apple className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900" data-testid={`food-name-${food.id}`}>
                      {food.name}
                    </p>
                    <p className="text-sm text-gray-500" data-testid={`food-serving-${food.id}`}>
                      {food.serving || "1 serving"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900" data-testid={`food-calories-${food.id}`}>
                    {food.calories} cal
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-blue-700"
                    onClick={() => addRecentFood.mutate(food)}
                    disabled={addRecentFood.isPending}
                    data-testid={`button-quick-add-${food.id}`}
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

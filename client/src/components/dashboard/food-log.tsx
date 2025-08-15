import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodEntry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Sun, Moon, Utensils, Cookie } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const mealIcons = {
  breakfast: Sun,
  lunch: Utensils,
  dinner: Moon,
  snack: Cookie,
};

const mealColors = {
  breakfast: "text-warning",
  lunch: "text-primary",
  dinner: "text-gray-600",
  snack: "text-success",
};

interface FoodLogProps {
  date?: string;
}

export default function FoodLog({ date }: FoodLogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = date || format(new Date(), 'yyyy-MM-dd');

  const { data: entries = [], isLoading } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", today],
  });

  const deleteFoodEntry = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/food-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries", today] });
      toast({
        title: "Success",
        description: "Food item deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete food item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg animate-pulse" data-testid="food-log-loading">
        <div className="px-4 py-5 sm:p-6">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-5 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2 ml-7">
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg" data-testid="food-log">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Food Log</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total:</span>
            <span className="text-lg font-semibold text-gray-900" data-testid="total-calories">
              {totalCalories.toLocaleString()} calories
            </span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="no-food-entries">
            <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No food entries for today. Start by adding your first meal!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {mealOrder.map((mealType) => {
              const mealEntries = groupedEntries[mealType] || [];
              if (mealEntries.length === 0) return null;

              const MealIcon = mealIcons[mealType as keyof typeof mealIcons];
              const mealCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0);

              return (
                <div key={mealType} data-testid={`meal-section-${mealType}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <MealIcon className={`w-5 h-5 mr-2 ${mealColors[mealType as keyof typeof mealColors]}`} />
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </h4>
                    <span className="text-sm font-medium text-gray-600" data-testid={`${mealType}-total`}>
                      {mealCalories.toLocaleString()} calories
                    </span>
                  </div>
                  <div className="space-y-2 ml-7">
                    {mealEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                        data-testid={`food-entry-${entry.id}`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900" data-testid={`entry-name-${entry.id}`}>
                            {entry.name}
                          </span>
                          {entry.serving && (
                            <span className="ml-2 text-xs text-gray-500" data-testid={`entry-serving-${entry.id}`}>
                              {entry.serving}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900" data-testid={`entry-calories-${entry.id}`}>
                            {entry.calories} cal
                          </span>
                          <span className="text-xs text-gray-500" data-testid={`entry-time-${entry.id}`}>
                            {new Date(entry.timestamp!).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 p-1"
                            data-testid={`button-edit-${entry.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-600 p-1"
                                data-testid={`button-delete-${entry.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Food Entry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{entry.name}" from your food log?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFoodEntry.mutate(entry.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

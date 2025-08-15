import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCalorieGoalSchema, type InsertCalorieGoal, type CalorieGoal } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: calorieGoal } = useQuery<CalorieGoal>({
    queryKey: ["/api/calorie-goals", today],
  });

  const form = useForm<InsertCalorieGoal>({
    resolver: zodResolver(insertCalorieGoalSchema),
    defaultValues: {
      dailyCaloriesGoal: calorieGoal?.dailyCaloriesGoal || 2000,
      date: today,
    },
  });

  // Update form when data loads
  React.useEffect(() => {
    if (calorieGoal) {
      form.reset({
        dailyCaloriesGoal: calorieGoal.dailyCaloriesGoal,
        date: today,
      });
    }
  }, [calorieGoal, form, today]);

  const updateCalorieGoal = useMutation({
    mutationFn: async (data: InsertCalorieGoal) => {
      const response = await apiRequest("POST", "/api/calorie-goals", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calorie-goals", today] });
      toast({
        title: "Success",
        description: "Daily calorie goal updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update calorie goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCalorieGoal) => {
    updateCalorieGoal.mutate(data);
  };

  return (
    <div className="min-h-screen flex bg-gray-50" data-testid="settings-page">
      <Sidebar />
      <MobileHeader />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Settings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your calorie tracking preferences
            </p>
          </div>

          {/* Settings Cards */}
          <div className="max-w-2xl space-y-6">
            <Card data-testid="calorie-goal-settings">
              <CardHeader>
                <CardTitle>Daily Calorie Goal</CardTitle>
                <CardDescription>
                  Set your daily calorie target to track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dailyCaloriesGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daily Calorie Goal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-daily-calorie-goal"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your target daily calorie intake. The recommended range is 1,200-3,000 calories.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={updateCalorieGoal.isPending}
                      data-testid="button-save-calorie-goal"
                    >
                      {updateCalorieGoal.isPending ? "Saving..." : "Save Goal"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card data-testid="app-info">
              <CardHeader>
                <CardTitle>About CalorieTracker</CardTitle>
                <CardDescription>
                  Track your daily food intake and monitor your calorie goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Version: 1.0.0</p>
                  <p>Features:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Daily food logging</li>
                    <li>Calorie tracking and goal monitoring</li>
                    <li>Weekly progress visualization</li>
                    <li>Recent foods for quick adding</li>
                    <li>Meal type organization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFoodEntrySchema, type InsertFoodEntry } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function QuickAddForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const form = useForm<InsertFoodEntry>({
    resolver: zodResolver(insertFoodEntrySchema),
    defaultValues: {
      name: "",
      calories: 0,
      serving: "",
      mealType: "breakfast",
      date: today,
    },
  });

  const createFoodEntry = useMutation({
    mutationFn: async (data: InsertFoodEntry) => {
      const response = await apiRequest("POST", "/api/food-entries", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries", today] });
      queryClient.invalidateQueries({ queryKey: ["/api/recent-foods"] });
      toast({
        title: "Success",
        description: "Food added to your log!",
      });
      form.reset({
        name: "",
        calories: 0,
        serving: "",
        mealType: "breakfast",
        date: today,
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

  const onSubmit = (data: InsertFoodEntry) => {
    createFoodEntry.mutate(data);
  };

  return (
    <div className="bg-white shadow rounded-lg" data-testid="quick-add-form">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Add Food</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chicken Breast"
                      {...field}
                      data-testid="input-food-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-calories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serving"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serving</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1 piece"
                        {...field}
                        value={field.value || ""}
                        data-testid="input-serving"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mealType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-meal-type">
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createFoodEntry.isPending}
              data-testid="button-add-to-log"
            >
              {createFoodEntry.isPending ? "Adding..." : "Add to Log"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

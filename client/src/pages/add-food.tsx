import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import QuickAddForm from "@/components/dashboard/quick-add-form";
import RecentFoods from "@/components/dashboard/recent-foods";

export default function AddFood() {
  return (
    <div className="min-h-screen flex bg-gray-50" data-testid="add-food-page">
      <Sidebar />
      <MobileHeader />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Add Food
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add new foods to your daily calorie log
            </p>
          </div>

          {/* Add Food Form and Recent Foods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuickAddForm />
            <RecentFoods />
          </div>
        </div>
      </div>
    </div>
  );
}

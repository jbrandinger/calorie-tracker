import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import FoodLog from "@/components/dashboard/food-log";

export default function FoodLogPage() {
  return (
    <div className="min-h-screen flex bg-gray-50" data-testid="food-log-page">
      <Sidebar />
      <MobileHeader />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Food Log
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your daily food entries
            </p>
          </div>

          {/* Food Log */}
          <FoodLog />
        </div>
      </div>
    </div>
  );
}

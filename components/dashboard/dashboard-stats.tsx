import { MapPin, Calendar, Plane, CreditCard } from 'lucide-react';

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#359572]/10">
            <MapPin className="h-6 w-6 text-[#359572]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Trips</p>
            <h3 className="text-2xl font-bold text-[#2c3e2e]">12</h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6900]/10">
            <Calendar className="h-6 w-6 text-[#ff6900]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Trips</p>
            <h3 className="text-2xl font-bold text-[#2c3e2e]">4</h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d3557]/10">
            <Plane className="h-6 w-6 text-[#1d3557]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Countries Visited</p>
            <h3 className="text-2xl font-bold text-[#2c3e2e]">8</h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a6b4a]/10">
            <CreditCard className="h-6 w-6 text-[#4a6b4a]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Budget</p>
            <h3 className="text-2xl font-bold text-[#2c3e2e]">$4,850</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

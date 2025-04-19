'use client';

import { TripPlan } from '@/app/trip-results/page';
import { useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export function TripChart({ tripData }: { tripData: TripPlan[] }) {
  const [data, setData] = useState<Array<{ country: string; trips: number }>>(
    []
  );

  useEffect(() => {
    const newData: Array<{ country: string; trips: number }> = [];

    tripData.forEach(item => {
      const country = item.to.split(',')[1]?.trim();
      const existing = newData.find(item => item.country === country);

      if (existing) {
        existing.trips += 1;
      } else {
        newData.push({ country: country, trips: 1 });
      }
    });

    setData(newData);
  }, [tripData]);
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 40
          }}
        >
          <XAxis
            dataKey="country"
            stroke="#ffffff80"
            fontSize={14}
            tickLine={true}
            axisLine={true}
            padding={{ left: 30, right: 30 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-[#4a6b4a] bg-[#2c3e2e] p-2 shadow-md ">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-[#ffffff80]">
                          Country
                        </span>
                        <span className="font-bold text-white">
                          {payload[0].payload.country}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-[#ffffff80]">
                          Trips
                        </span>
                        <span className="font-bold text-white">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="trips"
            stroke="#ff6900"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: '#ff6900', opacity: 0.8 }
            }}
            dot={{
              r: 4,
              style: { fill: '#2c3e2e', stroke: '#ff6900', strokeWidth: 2 }
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

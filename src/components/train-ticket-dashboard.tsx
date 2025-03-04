"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Train, TicketIcon, DollarSign, Activity } from "lucide-react";

// Mock data based on system requirements
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 5500 },
];

const recentTickets = [
  {
    id: "TKT001",
    route: "New York - Boston",
    date: "2024-03-15",
    price: 85.5,
    status: "Confirmed",
  },
  {
    id: "TKT002",
    route: "Chicago - Miami",
    date: "2024-03-16",
    price: 129.75,
    status: "Confirmed",
  },
  {
    id: "TKT003",
    route: "San Francisco - Los Angeles",
    date: "2024-03-17",
    price: 65.25,
    status: "Cancelled",
  },
];

export function TrainTicketDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("May");

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {/* Key Metrics Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Train className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 new routes this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-4  rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px] border border-blue-500 rounded-lg shadow-sm hover:border-blue-600">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="border border-blue-500 shadow-md rounded-lg">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                  <SelectItem
                    key={month}
                    value={month}
                    className="hover:bg-blue-100"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1e9ff" />
              {/* <XAxis dataKey="month" /> */}
              {/* <YAxis /> */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  borderColor: "#3b82f6",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#1e40af", r: 5 }}
                activeDot={{ r: 8, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrainTicketDashboard;

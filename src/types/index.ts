export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string | Date;
  lastLoginAt: string | Date | null;
  active: boolean;
};

export type UserAsProps = Omit<User, "createdAt" | "lastLoginAt" | "active">;

export type Destination = {
  id: string;
  name: string;
  desc: string;
  isActive: boolean;
};

export type Connection = {
  id: string;
  fromStation: string;
  toStation: string;
  distance: number;
  isActive: boolean;
};

export interface Train {
  id: string;
  name: string;
  number: string;
  isActive: boolean;
}

export interface TrainClass {
  id: string;
  name: string;
  pricePerKm: number;
}

export interface TrainLine {
  id: string;
  name: string;
  trainName: string;
  stations: string[];
  classess: string[];
  isActive: boolean;
}

export type TrainSchedule = {
  id: string;
  trainLineName: string;
  dayOfWeek: number | null;
  departureTime: Date;
  trainName: string;
  stations: { name: string; arrival: string; depar: string }[];
};

export type StationStop = {
  id: string;
  stationName: string; // ✅ Station name included
  arrivalTime: string | null;
  departureTime: string | null;
  stopOrder: number;
};

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
  trainId: string;
  isActive: boolean;
  train: Train;
  classes: TrainClass[];
}

export type TrainSchedule = {
  id: string;
  trainLineId: string;
  dayOfWeek: number | null;
  departureTime: Date;
};

export type StationStop = {
  id: string;
  trainScheduleId: string;
  stationId: string;
  arrivalTime: string;
  departureTime: string;
  stopOrder: number;
};

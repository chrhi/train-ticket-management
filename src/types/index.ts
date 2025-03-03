export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string | Date;
  lastLoginAt: string | Date | null;
  active: boolean;
};

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

export type Train = {
  id: string;
  name: string;
  number: string;
  isActive: boolean;
};

export type TrainClass = {
  id: string;
  name: string;
  pricePerKm: number;
};

export type TrainLine = {
  id: string;
  trainId: string;
  name: string;
  isActive: boolean;
};

export type TrainSchedule = {
  id: string;
  trainLineId: string;
  dayOfWeek: number;
  departureTime: string;
};

export type StationStop = {
  id: string;
  trainScheduleId: string;
  stationId: string;
  arrivalTime: string;
  departureTime: string;
  stopOrder: number;
};

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
  prev: string;
  next: string;
  prev_dest: number;
  next_dest: number;
  desc: string;
  isOrigin: boolean;
  isActive: boolean;
};

export type Connection = {
  id: string;
  fromStation: string;
  toStation: string;
  distance: number;
  isActive: boolean;
};

export type trainRoude = {
  id: string;
  cities: { name: string; id: string }[];
};

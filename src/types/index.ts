export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string | Date;
  lastLoginAt: string | Date | null;
  active: boolean;
};

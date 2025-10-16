export interface Login {
  name: string;
  avatar?: { public_id: string; url: string } | string;
  role?: {
    role: string | null;
  };
}

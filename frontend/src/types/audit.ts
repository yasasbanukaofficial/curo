export interface Audit {
  _id: string;
  userId: string;
  action: "CREATED" | "UPDATED" | "DELETED" | "VIEWED";
  resource: "SECRET";
  metadata: Record<string, unknown>;
  target: string;
  user: string;
  role: string;
  env: string;
  time: string;
  createdAt: string;
}

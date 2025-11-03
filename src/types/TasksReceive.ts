export interface Tasks {
  archive?: {
    archive_type: string;
    url: string;
    public_id: string;
    id: string;
  };
  completionDate: string;
  createdAt: string;
  createdBy: string;
  description: string;
  intendedFor: {
    avatar?: {
      url: string;
      public_id: string;
    };
    name: string;
  };
  content_of_response?: {
    title: string;
    description: string;
    archive?: {
      archive_type: string;
      public_id: string;
      url: string;
    };
  };
  organization: string;
  status: "pending" | "complete";
  steps: {
    list: string[] | null;
    style: "ordered" | "not ordered";
  };
  title: string;
  updatedAt: string;
  _id: string;
}

export interface TasksPending {
  message: string;
  pendingTasks: Tasks[] | [];
}

export type Summary = {
  _id: string;
  createdAt: string;
  created_by: string;
  created_for: {
    name: string;
    avatar?: {
      public_id: string;
      url: string;
    };
  };
  description: string;
  title: string;
};

export type ReceiveSummaries = {
  message: string;
  data: Summary[];
};

export interface CreateTaskInput {
  taskName: string;
  team: string;
  description: string;
  category: string;
  finishedTime: number;
  points: number;
}

export interface AddPoints {
  devName: string;
  taskName: string;
  points: number;
}

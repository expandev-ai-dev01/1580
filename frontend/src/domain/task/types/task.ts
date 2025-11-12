export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  idTask: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: TaskPriority;
  dateCreated: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority | null;
}

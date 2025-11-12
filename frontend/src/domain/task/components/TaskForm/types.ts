import type { Task } from '../../types';

export interface TaskFormProps {
  onSuccess?: (data: Task) => void;
}

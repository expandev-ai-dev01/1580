import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services';
import type { TaskCreatePayload } from '../../types';
import type { UseCreateTaskOptions } from './types';

/**
 * @hook useCreateTask
 * @summary Hook to manage task creation.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useCreateTask = (options?: UseCreateTaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCreatePayload) => taskService.create(data),
    onSuccess: (data) => {
      // Invalidate queries related to task lists to refetch data
      // queryClient.invalidateQueries({ queryKey: ['tasks'] });
      options?.onSuccess?.(data);
    },
    onError: (error: unknown) => {
      options?.onError?.(error);
    },
  });
};

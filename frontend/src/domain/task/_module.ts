/**
 * @module task
 * @summary Module for task management, including creation, listing, updating, and deletion.
 * @domain functional
 * @dependencies react-hook-form, @tanstack/react-query, zod
 * @version 1.0.0
 */

// Domain public exports - Components
export * from './components/TaskForm';

// Domain public exports - Hooks
export * from './hooks/useCreateTask';

// Domain public exports - Services
export * from './services/taskService';

// Domain public exports - Types
export * from './types';

// Domain public exports - Utils
export * from './utils/validation';

export const moduleMetadata = {
  name: 'task',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['TaskForm'],
  publicHooks: ['useCreateTask'],
  publicServices: ['taskService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/lib/queryClient'],
    external: ['react', 'react-hook-form', '@tanstack/react-query', 'zod'],
    domains: [],
  },
} as const;

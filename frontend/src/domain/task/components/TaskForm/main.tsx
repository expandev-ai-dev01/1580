import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskCreateFormSchema, TaskCreateFormValues } from '../../utils';
import { useCreateTask } from '../../hooks/useCreateTask';
import type { TaskFormProps } from './types';

/**
 * @component TaskForm
 * @summary Form for creating a new task.
 * @domain task
 * @type domain-component
 * @category form
 */
export const TaskForm = ({ onSuccess }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskCreateFormValues>({
    resolver: zodResolver(taskCreateFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: null,
      priority: 'media',
    },
  });

  const { mutate: createTask, isPending } = useCreateTask({
    onSuccess: (data) => {
      alert('Tarefa criada com sucesso!');
      reset();
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      alert(`Erro ao criar tarefa: ${errorMessage}`);
    },
  });

  const onSubmit = (data: TaskCreateFormValues) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    createTask(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Data de Vencimento
        </label>
        <input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.dueDate && <p className="mt-2 text-sm text-red-600">{errors.dueDate.message}</p>}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Prioridade
        </label>
        <select
          id="priority"
          {...register('priority')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.priority && <p className="mt-2 text-sm text-red-600">{errors.priority.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isPending ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};

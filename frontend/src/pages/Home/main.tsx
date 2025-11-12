import { TaskForm } from '@/domain/task/components/TaskForm';
import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Criar Nova Tarefa</h1>
        <TaskForm />
      </div>
    </div>
  );
};

export default HomePage;

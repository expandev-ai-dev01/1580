/**
 * @summary
 * Task business logic and database operations
 *
 * @module services/task/taskRules
 *
 * @description
 * Implements task management business rules and database interactions.
 * All operations call stored procedures for data persistence.
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  TaskCreateRequest,
  TaskCreateResult,
  TaskEntity,
  TaskListRequest,
  TaskGetRequest,
  TaskUpdateRequest,
  TaskDeleteRequest,
} from './taskTypes';

/**
 * @summary
 * Creates a new task
 *
 * @function taskCreate
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 *
 * @returns {Promise<TaskCreateResult>} Created task identifier
 *
 * @throws {Error} When task creation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskCreateResult> {
  const result = await dbRequest(
    '[functional].[spTaskCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      priority: params.priority,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Lists tasks with optional filtering
 *
 * @function taskList
 *
 * @param {TaskListRequest} params - Task list parameters
 *
 * @returns {Promise<TaskEntity[]>} Array of tasks
 *
 * @throws {Error} When task listing fails
 */
export async function taskList(params: TaskListRequest): Promise<TaskEntity[]> {
  const result = await dbRequest(
    '[functional].[spTaskList]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      status: params.status,
      priority: params.priority,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Gets a specific task by ID
 *
 * @function taskGet
 *
 * @param {TaskGetRequest} params - Task get parameters
 *
 * @returns {Promise<TaskEntity>} Task details
 *
 * @throws {Error} When task retrieval fails
 */
export async function taskGet(params: TaskGetRequest): Promise<TaskEntity> {
  const result = await dbRequest(
    '[functional].[spTaskGet]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Updates an existing task
 *
 * @function taskUpdate
 *
 * @param {TaskUpdateRequest} params - Task update parameters
 *
 * @returns {Promise<TaskCreateResult>} Updated task identifier
 *
 * @throws {Error} When task update fails
 */
export async function taskUpdate(params: TaskUpdateRequest): Promise<TaskCreateResult> {
  const result = await dbRequest(
    '[functional].[spTaskUpdate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      priority: params.priority,
      status: params.status,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Deletes a task (soft delete)
 *
 * @function taskDelete
 *
 * @param {TaskDeleteRequest} params - Task delete parameters
 *
 * @returns {Promise<TaskCreateResult>} Deleted task identifier
 *
 * @throws {Error} When task deletion fails
 */
export async function taskDelete(params: TaskDeleteRequest): Promise<TaskCreateResult> {
  const result = await dbRequest(
    '[functional].[spTaskDelete]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

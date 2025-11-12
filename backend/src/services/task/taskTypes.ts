/**
 * @summary
 * Type definitions for task management
 *
 * @module services/task/taskTypes
 *
 * @description
 * Defines TypeScript interfaces and types for task entities and operations.
 */

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}

/**
 * @interface TaskEntity
 * @description Complete task entity from database
 *
 * @property {number} idTask - Task identifier
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string | null} dueDate - Task due date (ISO string)
 * @property {TaskPriority} priority - Task priority level
 * @property {TaskStatus} status - Task status
 * @property {string} dateCreated - Creation timestamp (ISO string)
 * @property {string} dateModified - Last modification timestamp (ISO string)
 */
export interface TaskEntity {
  idTask: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string | null} dueDate - Task due date (ISO string)
 * @property {TaskPriority} priority - Task priority level
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
}

/**
 * @interface TaskUpdateRequest
 * @description Request parameters for updating a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idTask - Task identifier
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string | null} dueDate - Task due date (ISO string)
 * @property {TaskPriority} priority - Task priority level
 * @property {TaskStatus} status - Task status
 */
export interface TaskUpdateRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {TaskStatus | null} status - Optional status filter
 * @property {TaskPriority | null} priority - Optional priority filter
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
  status: TaskStatus | null;
  priority: TaskPriority | null;
}

/**
 * @interface TaskGetRequest
 * @description Request parameters for getting a specific task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskGetRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @interface TaskDeleteRequest
 * @description Request parameters for deleting a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskDeleteRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @interface TaskCreateResult
 * @description Result of task creation
 *
 * @property {number} idTask - Created task identifier
 */
export interface TaskCreateResult {
  idTask: number;
}

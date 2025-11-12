/**
 * @summary
 * Task API controller
 *
 * @module api/v1/internal/task/controller
 *
 * @description
 * Handles HTTP requests for task management operations.
 * Implements CRUD operations with validation and security.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, taskList, taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zNullableStringWithMax, zStringWithMax } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with title, description, due date, and priority
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} [dueDate] Task due date (ISO format, future date)
 * @apiParam {Number} [priority] Task priority (0=Low, 1=Medium, 2=High, default=1)
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleTooShort Title must be at least 3 characters
 * @apiError {String} titleTooLong Title cannot exceed 100 characters
 * @apiError {String} descriptionTooLong Description cannot exceed 1000 characters
 * @apiError {String} dueDateInPast Due date cannot be in the past
 * @apiError {String} invalidPriority Invalid priority value
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    title: zStringWithMax(100).min(3),
    description: zNullableStringWithMax(1000),
    dueDate: z.string().datetime().nullable().optional(),
    priority: z.number().int().min(0).max(2).optional().default(1),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCreate({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      title: validated.params.title,
      description: validated.params.description || null,
      dueDate: validated.params.dueDate || null,
      priority: validated.params.priority,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all tasks for the authenticated user with optional filtering
 *
 * @apiParam {Number} [status] Filter by status (0=Pending, 1=InProgress, 2=Completed)
 * @apiParam {Number} [priority] Filter by priority (0=Low, 1=Medium, 2=High)
 *
 * @apiSuccess {Object[]} tasks Array of tasks
 * @apiSuccess {Number} tasks.idTask Task identifier
 * @apiSuccess {String} tasks.title Task title
 * @apiSuccess {String} tasks.description Task description
 * @apiSuccess {String} tasks.dueDate Task due date
 * @apiSuccess {Number} tasks.priority Task priority
 * @apiSuccess {Number} tasks.status Task status
 * @apiSuccess {String} tasks.dateCreated Creation timestamp
 * @apiSuccess {String} tasks.dateModified Last modification timestamp
 *
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    status: z.coerce.number().int().min(0).max(2).nullable().optional(),
    priority: z.coerce.number().int().min(0).max(2).nullable().optional(),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskList({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      status: validated.params.status || null,
      priority: validated.params.priority || null,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

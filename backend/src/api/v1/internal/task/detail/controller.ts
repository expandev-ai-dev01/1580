/**
 * @summary
 * Task detail API controller
 *
 * @module api/v1/internal/task/detail/controller
 *
 * @description
 * Handles HTTP requests for specific task operations (get, update, delete).
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zNullableStringWithMax, zStringWithMax } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {get} /api/v1/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific task by ID
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Number} idTask Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} description Task description
 * @apiSuccess {String} dueDate Task due date
 * @apiSuccess {Number} priority Task priority
 * @apiSuccess {Number} status Task status
 * @apiSuccess {String} dateCreated Creation timestamp
 * @apiSuccess {String} dateModified Last modification timestamp
 *
 * @apiError {String} taskDoesntExist Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskGet({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      idTask: validated.params.id,
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
 * @api {put} /api/v1/internal/task/:id Update Task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing task
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} [dueDate] Task due date (ISO format, future date)
 * @apiParam {Number} priority Task priority (0=Low, 1=Medium, 2=High)
 * @apiParam {Number} status Task status (0=Pending, 1=InProgress, 2=Completed)
 *
 * @apiSuccess {Number} idTask Updated task identifier
 *
 * @apiError {String} taskDoesntExist Task not found
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleTooShort Title must be at least 3 characters
 * @apiError {String} titleTooLong Title cannot exceed 100 characters
 * @apiError {String} descriptionTooLong Description cannot exceed 1000 characters
 * @apiError {String} dueDateInPast Due date cannot be in the past
 * @apiError {String} invalidPriority Invalid priority value
 * @apiError {String} invalidStatus Invalid status value
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
    title: zStringWithMax(100).min(3),
    description: zNullableStringWithMax(1000),
    dueDate: z.string().datetime().nullable().optional(),
    priority: z.number().int().min(0).max(2),
    status: z.number().int().min(0).max(2),
  });

  const [validated, error] = await operation.update(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskUpdate({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      idTask: validated.params.id,
      title: validated.params.title,
      description: validated.params.description || null,
      dueDate: validated.params.dueDate || null,
      priority: validated.params.priority,
      status: validated.params.status,
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
 * @api {delete} /api/v1/internal/task/:id Delete Task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a task (soft delete)
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Number} idTask Deleted task identifier
 *
 * @apiError {String} taskDoesntExist Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskDelete({
      idAccount: validated.credential.idAccount,
      idUser: validated.credential.idUser,
      idTask: validated.params.id,
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

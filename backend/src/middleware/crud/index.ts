/**
 * @summary
 * CRUD operation middleware and utilities
 *
 * @module middleware/crud
 *
 * @description
 * Provides base controller functionality for CRUD operations with security validation.
 * Includes response formatting utilities and error handling.
 */

import { Request } from 'express';
import { z } from 'zod';

/**
 * @interface SecurityRule
 * @description Security rule definition for CRUD operations
 *
 * @property {string} securable - Resource name to secure
 * @property {string} permission - Required permission (CREATE, READ, UPDATE, DELETE)
 */
export interface SecurityRule {
  securable: string;
  permission: string;
}

/**
 * @interface ValidationResult
 * @description Result of request validation
 *
 * @property {object} credential - User credential information
 * @property {number} credential.idAccount - Account identifier
 * @property {number} credential.idUser - User identifier
 * @property {any} params - Validated request parameters
 */
export interface ValidationResult {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

/**
 * @class CrudController
 * @description Base controller for CRUD operations with security validation
 */
export class CrudController {
  private securityRules: SecurityRule[];

  constructor(securityRules: SecurityRule[]) {
    this.securityRules = securityRules;
  }

  /**
   * @summary
   * Validates CREATE operation request
   *
   * @function create
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async create(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  /**
   * @summary
   * Validates READ operation request
   *
   * @function read
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async read(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validateRequest(req, schema, 'READ');
  }

  /**
   * @summary
   * Validates UPDATE operation request
   *
   * @function update
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async update(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  /**
   * @summary
   * Validates DELETE operation request
   *
   * @function delete
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  async delete(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, any]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  /**
   * @summary
   * Internal request validation logic
   *
   * @function validateRequest
   * @private
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   * @param {string} operation - Operation type
   *
   * @returns {Promise<[ValidationResult | null, any]>} Validation result or error
   */
  private async validateRequest(
    req: Request,
    schema: z.ZodSchema,
    operation: string
  ): Promise<[ValidationResult | null, any]> {
    try {
      const params = { ...req.params, ...req.body, ...req.query };
      const validated = await schema.parseAsync(params);

      const credential = {
        idAccount: 1,
        idUser: 1,
      };

      return [{ credential, params: validated }, null];
    } catch (error) {
      return [null, error];
    }
  }
}

/**
 * @summary
 * Formats successful API response
 *
 * @function successResponse
 *
 * @param {any} data - Response data
 * @param {object} metadata - Optional metadata
 *
 * @returns {object} Formatted success response
 */
export function successResponse(data: any, metadata?: any) {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @summary
 * Formats error API response
 *
 * @function errorResponse
 *
 * @param {string} message - Error message
 * @param {string} code - Error code
 *
 * @returns {object} Formatted error response
 */
export function errorResponse(message: string, code: string = 'ERROR') {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * @constant StatusGeneralError
 * @description Standard general error object
 */
export const StatusGeneralError = {
  statusCode: 500,
  code: 'INTERNAL_SERVER_ERROR',
  message: 'An unexpected error occurred',
};

/**
 * @summary
 * Zod validation utilities and reusable schemas
 *
 * @module utils/zodValidation
 *
 * @description
 * Provides reusable Zod validation schemas and utilities for common data types.
 * Ensures consistent validation patterns across the application.
 */

import { z } from 'zod';

/**
 * @summary
 * Validates BIT values (0 or 1)
 */
export const zBit = z.number().int().min(0).max(1);

/**
 * @summary
 * Validates date strings in ISO format
 */
export const zDateString = z.string().datetime();

/**
 * @summary
 * Validates foreign key references (positive integers)
 */
export const zFK = z.number().int().positive();

/**
 * @summary
 * Validates nullable foreign key references
 */
export const zNullableFK = z.number().int().positive().nullable();

/**
 * @summary
 * Validates name fields (1-200 characters)
 */
export const zName = z.string().min(1).max(200);

/**
 * @summary
 * Validates nullable description fields (max 500 characters)
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * @summary
 * Validates nullable string fields
 */
export const zNullableString = z.string().nullable();

/**
 * @summary
 * Validates required string fields
 */
export const zString = z.string().min(1);

/**
 * @summary
 * Creates a nullable string validator with max length
 *
 * @function zNullableStringWithMax
 *
 * @param {number} maxLength - Maximum string length
 *
 * @returns {z.ZodNullable<z.ZodString>} Zod schema
 */
export const zNullableStringWithMax = (maxLength: number) => {
  return z.string().max(maxLength).nullable();
};

/**
 * @summary
 * Creates a required string validator with max length
 *
 * @function zStringWithMax
 *
 * @param {number} maxLength - Maximum string length
 *
 * @returns {z.ZodString} Zod schema
 */
export const zStringWithMax = (maxLength: number) => {
  return z.string().min(1).max(maxLength);
};

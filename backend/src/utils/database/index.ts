/**
 * @summary
 * Database connection and query utilities
 *
 * @module utils/database
 *
 * @description
 * Provides database connection management and query execution utilities.
 * Handles connection pooling, transaction management, and result set processing.
 */

import sql from 'mssql';
import { config } from '@/config';

/**
 * @enum ExpectedReturn
 * @description Expected return type from stored procedure execution
 */
export enum ExpectedReturn {
  None = 'None',
  Single = 'Single',
  Multi = 'Multi',
}

let pool: sql.ConnectionPool | null = null;

/**
 * @summary
 * Gets or creates database connection pool
 *
 * @function getPool
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 *
 * @throws {Error} When connection fails
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect({
      server: config.database.server,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      options: config.database.options,
    });
  }
  return pool;
}

/**
 * @summary
 * Executes stored procedure with parameters
 *
 * @function dbRequest
 *
 * @param {string} procedure - Stored procedure name with schema
 * @param {object} parameters - Procedure parameters
 * @param {ExpectedReturn} expectedReturn - Expected return type
 * @param {sql.Transaction} transaction - Optional transaction
 * @param {string[]} resultSetNames - Optional result set names
 *
 * @returns {Promise<any>} Query results
 *
 * @throws {Error} When query execution fails
 */
export async function dbRequest(
  procedure: string,
  parameters: any = {},
  expectedReturn: ExpectedReturn = ExpectedReturn.Single,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const pool = await getPool();
  const request = transaction ? new sql.Request(transaction) : pool.request();

  Object.keys(parameters).forEach((key) => {
    request.input(key, parameters[key]);
  });

  const result = await request.execute(procedure);

  if (expectedReturn === ExpectedReturn.None) {
    return null;
  }

  if (expectedReturn === ExpectedReturn.Single) {
    return result.recordset;
  }

  if (expectedReturn === ExpectedReturn.Multi) {
    if (resultSetNames && resultSetNames.length > 0) {
      const namedResults: Record<string, sql.IRecordSet<any>> = {};
      resultSetNames.forEach((name, index) => {
        if (Array.isArray(result.recordsets)) {
          namedResults[name] = result.recordsets[index];
        }
      });
      return namedResults;
    }
    return result.recordsets;
  }

  return result.recordset;
}

/**
 * @summary
 * Begins a new database transaction
 *
 * @function beginTransaction
 *
 * @returns {Promise<sql.Transaction>} Transaction object
 *
 * @throws {Error} When transaction creation fails
 */
export async function beginTransaction(): Promise<sql.Transaction> {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  return transaction;
}

/**
 * @summary
 * Commits a database transaction
 *
 * @function commitTransaction
 *
 * @param {sql.Transaction} transaction - Transaction to commit
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When commit fails
 */
export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

/**
 * @summary
 * Rolls back a database transaction
 *
 * @function rollbackTransaction
 *
 * @param {sql.Transaction} transaction - Transaction to rollback
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When rollback fails
 */
export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}

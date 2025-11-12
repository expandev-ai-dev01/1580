/**
 * @summary
 * Soft deletes a task by setting the deleted flag.
 * Maintains data integrity and audit trail.
 *
 * @procedure spTaskDelete
 * @schema functional
 * @type stored-procedure
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for security validation
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to delete
 *
 * @testScenarios
 * - Valid deletion of existing task
 * - Validation failure for non-existent task
 * - Validation failure for task from different account
 * - Validation failure for task from different user
 * - Validation failure for already deleted task
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation User existence validation
   * @throw {userDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [security].[user] usr WHERE usr.[idUser] = @idUser AND usr.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'userDoesntExist', 1;
  END;

  /**
   * @validation Task existence validation
   * @throw {taskDoesntExist}
   */
  IF NOT EXISTS (
    SELECT * FROM [functional].[task] tsk
    WHERE tsk.[idTask] = @idTask
      AND tsk.[idAccount] = @idAccount
      AND tsk.[idUser] = @idUser
      AND tsk.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-task-delete} Soft delete task by setting deleted flag
     */
    BEGIN TRAN;

      UPDATE [functional].[task]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser
        AND [deleted] = 0;

      /**
       * @output {TaskDeleted, 1, 1}
       * @column {INT} idTask
       * - Description: Deleted task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
/**
 * @summary
 * Retrieves a specific task by ID with full details.
 *
 * @procedure spTaskGet
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
 *   - Description: Task identifier to retrieve
 *
 * @testScenarios
 * - Retrieve existing task successfully
 * - Validation failure for non-existent task
 * - Validation failure for task from different account
 * - Validation failure for task from different user
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
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

  /**
   * @rule {db-task-get} Retrieve task details
   */
  /**
   * @output {TaskDetails, 1, n}
   * @column {INT} idTask - Task identifier
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Task due date
   * @column {INT} priority - Task priority (0=Low, 1=Medium, 2=High)
   * @column {INT} status - Task status (0=Pending, 1=InProgress, 2=Completed)
   * @column {DATETIME2} dateCreated - Creation timestamp
   * @column {DATETIME2} dateModified - Last modification timestamp
   */
  SELECT
    [tsk].[idTask],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[status],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idTask] = @idTask
    AND [tsk].[idAccount] = @idAccount
    AND [tsk].[idUser] = @idUser
    AND [tsk].[deleted] = 0;
END;
GO
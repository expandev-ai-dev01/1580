/**
 * @summary
 * Lists all tasks for a specific account and user with optional filtering.
 * Returns tasks ordered by priority (high to low) and due date.
 *
 * @procedure spTaskList
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
 *   - Description: User identifier to filter tasks
 *
 * @param {INT} status
 *   - Required: No
 *   - Description: Filter by status (0=Pending, 1=InProgress, 2=Completed)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Filter by priority (0=Low, 1=Medium, 2=High)
 *
 * @testScenarios
 * - List all tasks for user
 * - Filter tasks by status
 * - Filter tasks by priority
 * - Filter tasks by status and priority
 * - Empty result for user with no tasks
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER,
  @status INTEGER = NULL,
  @priority INTEGER = NULL
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
   * @rule {db-task-list} Retrieve tasks with optional filtering
   */
  /**
   * @output {TaskList, n, n}
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
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[idUser] = @idUser
    AND [tsk].[deleted] = 0
    AND (@status IS NULL OR [tsk].[status] = @status)
    AND (@priority IS NULL OR [tsk].[priority] = @priority)
  ORDER BY
    [tsk].[priority] DESC,
    [tsk].[dueDate] ASC,
    [tsk].[dateCreated] DESC;
END;
GO
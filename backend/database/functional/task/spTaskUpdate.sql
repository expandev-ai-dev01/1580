/**
 * @summary
 * Updates an existing task with new values.
 * Automatically updates modification timestamp.
 *
 * @procedure spTaskUpdate
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
 *   - Description: Task identifier to update
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Updated task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Updated task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Updated due date (must be future date)
 *
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Updated priority (0=Low, 1=Medium, 2=High)
 *
 * @param {INT} status
 *   - Required: Yes
 *   - Description: Updated status (0=Pending, 1=InProgress, 2=Completed)
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Validation failure for non-existent task
 * - Validation failure for empty title
 * - Validation failure for title too short
 * - Validation failure for title too long
 * - Validation failure for description too long
 * - Validation failure for past due date
 * - Validation failure for invalid priority
 * - Validation failure for invalid status
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idTask INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority INTEGER,
  @status INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooShort}
   */
  IF (LEN(LTRIM(RTRIM(@title))) < 3)
  BEGIN
    ;THROW 51000, 'titleTooShort', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooLong}
   */
  IF (LEN(@title) > 100)
  BEGIN
    ;THROW 51000, 'titleTooLong', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionTooLong}
   */
  IF (@description IS NOT NULL AND LEN(@description) > 1000)
  BEGIN
    ;THROW 51000, 'descriptionTooLong', 1;
  END;

  /**
   * @validation Due date validation
   * @throw {dueDateInPast}
   */
  IF (@dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateInPast', 1;
  END;

  /**
   * @validation Priority validation
   * @throw {invalidPriority}
   */
  IF (@priority NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @validation Status validation
   * @throw {invalidStatus}
   */
  IF (@status NOT BETWEEN 0 AND 2)
  BEGIN
    ;THROW 51000, 'invalidStatus', 1;
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
     * @rule {db-task-update} Update task with validated parameters
     */
    BEGIN TRAN;

      UPDATE [functional].[task]
      SET
        [title] = LTRIM(RTRIM(@title)),
        [description] = @description,
        [dueDate] = @dueDate,
        [priority] = @priority,
        [status] = @status,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount
        AND [idUser] = @idUser
        AND [deleted] = 0;

      /**
       * @output {TaskUpdated, 1, 1}
       * @column {INT} idTask
       * - Description: Updated task identifier
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
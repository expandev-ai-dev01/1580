/**
 * @summary
 * Creates a new task with title, description, due date, and priority.
 * Automatically sets creation timestamp and initial status to pending.
 *
 * @procedure spTaskCreate
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
 *   - Description: User identifier who creates the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date (must be future date)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Task priority (0=Low, 1=Medium, 2=High, default=1)
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid creation with all parameters
 * - Valid creation with only required parameters
 * - Validation failure for empty title
 * - Validation failure for title too short
 * - Validation failure for title too long
 * - Validation failure for description too long
 * - Validation failure for past due date
 * - Validation failure for invalid priority
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority INTEGER = 1
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

  BEGIN TRY
    /**
     * @rule {db-task-creation} Create new task with validated parameters
     */
    BEGIN TRAN;

      DECLARE @idTask INTEGER;
      DECLARE @currentDate DATETIME2 = GETUTCDATE();

      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [status],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        LTRIM(RTRIM(@title)),
        @description,
        @dueDate,
        @priority,
        0,
        @currentDate,
        @currentDate,
        0
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask
       * - Description: Created task identifier
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
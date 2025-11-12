/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management table
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NULL,
  [dueDate] DATE NULL,
  [priority] INTEGER NOT NULL,
  [status] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @foreignKey fkTask_Account
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkTask_User
 * @target security.user
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_User] FOREIGN KEY ([idUser])
REFERENCES [security].[user]([idUser]);
GO

/**
 * @check chkTask_Priority
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status
 * @enum {0} Pending
 * @enum {1} In progress
 * @enum {2} Completed
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 2);
GO

/**
 * @default dfTask_Priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Priority] DEFAULT (1) FOR [priority];
GO

/**
 * @default dfTask_Status
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Status] DEFAULT (0) FOR [status];
GO

/**
 * @default dfTask_DateCreated
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfTask_DateModified
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_DateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

/**
 * @index ixTask_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount]);
GO

/**
 * @index ixTask_Account_User
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Status
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [dueDate], [priority])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Priority
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Priority]
ON [functional].[task]([idAccount], [priority])
INCLUDE ([title], [dueDate], [status])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0;
GO
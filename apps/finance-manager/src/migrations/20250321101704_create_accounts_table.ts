import {Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('account')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('accountType', sql`account_type`, (col) => col.notNull())
    .addColumn('initialBalance', 'numeric', (col) => col.notNull().defaultTo(0))
    .addColumn('currency', 'varchar', (col) => col.notNull())
    .addColumn('isActive', 'boolean', (col) => col.notNull())
    .addColumn('lastReconciled', 'timestamp', (col) => col.notNull())
    .addColumn('icon', 'varchar', (col) => col.notNull())
    .addColumn('color', 'varchar', (col) => col.notNull())
    .addColumn('userId', 'integer', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('account').execute();
}

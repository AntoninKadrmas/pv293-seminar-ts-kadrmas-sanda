import {Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('roles', 'varchar', (col) =>
      col.defaultTo(sql`ARRAY[]::varchar[]`).notNull(),
    )
    .execute();

  await db.schema.createType('user_role').asEnum(['admin', 'user']).execute();

  await db.schema
    .createTable('users_role')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('role', sql`user_role`, (col) => col.notNull().unique())
    .addColumn('user_id', 'integer', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropType('user_role').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('users_role').execute();
}

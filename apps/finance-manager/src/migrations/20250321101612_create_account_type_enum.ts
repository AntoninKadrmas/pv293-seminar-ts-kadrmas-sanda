import {Kysely} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('account_type')
    .asEnum(['CASH', 'BANK', 'CREDIT', 'INVESTMENT', 'ASSET', 'LIABILITY'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropType('account_type').execute();
}

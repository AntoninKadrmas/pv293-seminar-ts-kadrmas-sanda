import * as path from 'path';
import {Pool} from 'pg';
import {promises as fs} from 'fs';
import {Kysely, Migrator, PostgresDialect, FileMigrationProvider} from 'kysely';
import {config} from 'dotenv';
import {ConfigService} from '@nestjs/config';

config();

const configService = new ConfigService();
async function migrateToLatest() {
  // prefer DATABASE_URL when present (works well with docker-compose and other envs)
  const poolOptions = process.env.DATABASE_URL
    ? {connectionString: process.env.DATABASE_URL}
    : {
        host: configService.get<string>('POSTGRES_HOST'),
        port: Number(configService.get<string>('POSTGRES_PORT')) || 5432,
        user: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
      };

  console.log(
    'Using DB connection options:',
    process.env.DATABASE_URL ? '[DATABASE_URL]' : poolOptions,
  );

  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool(poolOptions),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path. migrations are in src/migrations
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  try {
    const {error, results} = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(
          `migration "${it.migrationName}" was executed successfully`,
        );
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      console.error('failed to migrate');
      console.error(error);
      process.exit(1);
    }
  } finally {
    await db.destroy();
  }
}

migrateToLatest();

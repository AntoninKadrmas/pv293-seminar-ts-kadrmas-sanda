import {Kysely} from 'kysely';
import {config} from 'dotenv';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';
import {Env} from '../modules/config/env';
import {EnvService} from '../modules/config/env.service';
import * as crypto from 'crypto';

config();

const configService = new ConfigService<Env, true>();
const envService = new EnvService(configService);

export async function up(db: Kysely<any>): Promise<void> {
  const name = envService.get('ADMIN_NAME');
  const email = envService.get('ADMIN_EMAIL');
  const password = envService.get('ADMIN_PASSWORD');
  const hashedPassword = await bcrypt.hash(password, 10);

  const id = crypto.randomUUID();

  await db
    .insertInto('user')
    .values({
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
    })
    .executeTakeFirst();

  await db
    .insertInto('users_role')
    .values({
      role: 'admin',
      user_id: id,
    })
    .executeTakeFirst();

  await db
    .insertInto('users_role')
    .values({
      role: 'user',
      user_id: id,
    })
    .executeTakeFirst();
}

export async function down(db: Kysely<any>): Promise<void> {
  const email = envService.get('ADMIN_EMAIL');

  // the users table is named 'user' in migrations, remove the admin by email from that table
  await db.deleteFrom('user').where('email', '=', email).execute();
}

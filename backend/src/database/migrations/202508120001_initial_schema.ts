import type { Knex } from 'knex';

const PRODUCT_STATUS_VALUES = ['draft', 'active', 'archived'] as const;
const ENUM_NAME = 'product_status';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE ${ENUM_NAME} AS ENUM ('draft', 'active', 'archived');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100).nullable();
    table.string('last_name', 100).nullable();
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.string('reset_token', 255).nullable();
    table.timestamp('reset_token_expires_at', { useTz: true }).nullable();

    table.timestamps(true, true);

    table.index(['email'], 'users_email_index');
    table.index(['created_at'], 'users_created_at_index');
    table.index(['reset_token'], 'users_reset_token_index');
  });

  // tableName from Category.model.ts — quoted identifier for PostgreSQL case match
  await knex.schema.createTable('Category', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('name', 255).notNullable();

    table.timestamps(true, true);

    table.index(['name'], 'category_name_index');
  });

  await knex.schema.createTable('items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.string('name', 255).notNullable();
    table.text('description').notNullable();
    table.string('category', 50).notNullable().defaultTo('Other');

    table
      .specificType('status', ENUM_NAME)
      .notNullable()
      .defaultTo('active');

    table.timestamps(true, true);

    table.index(['user_id'], 'items_user_id_index');
    table.index(['status'], 'items_status_index');
    table.index(['category'], 'items_category_index');
    table.index(['created_at'], 'items_created_at_index');
    table.index(['name'], 'items_name_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('items');
  await knex.schema.dropTableIfExists('Category');
  await knex.schema.dropTableIfExists('users');

  await knex.raw(`DROP TYPE IF EXISTS ${ENUM_NAME}`);
}

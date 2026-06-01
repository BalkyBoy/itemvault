import type { Knex } from 'knex';

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Shoes & Footwear',
  'Sports & Outdoors',
  'Home & Kitchen',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Garden & Tools',
  'Office Supplies',
  'Musical Instruments',
  'Art & Crafts',
  'Pet Supplies',
  'Baby & Kids',
  'Jewelry & Watches',
  'Food & Beverages',
  'Travel & Luggage',
  'Other',
];

export async function seed(knex: Knex): Promise<void> {
  await knex('Category').del();

  await knex('Category').insert(
    CATEGORIES.map((name) => ({
      id: knex.raw('gen_random_uuid()'),
      name,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    }))
  );
}

import { z } from 'zod';
import { ProductStatus } from '@/shared/enums/generic.enum';
import type { ValidationSchemas } from '@/shared/middlewares/validate.middleware';

export const ITEM_NAME_MAX_LENGTH = 255;
export const ITEM_CATEGORY_MAX_LENGTH = 50;
export const DEFAULT_ITEM_CATEGORY = 'Other';

const itemNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(ITEM_NAME_MAX_LENGTH, `Name must be at most ${ITEM_NAME_MAX_LENGTH} characters`);

const itemDescriptionSchema = z
  .string()
  .trim()
  .min(1, 'Description is required');

const itemCategorySchema = z
  .string()
  .trim()
  .min(1, 'Category is required')
  .max(
    ITEM_CATEGORY_MAX_LENGTH,
    `Category must be at most ${ITEM_CATEGORY_MAX_LENGTH} characters`
  );

const itemStatusSchema = z
  .enum(['active', 'draft', 'archived'] as const, {
    message: 'Status must be active, draft, or archived',
  })
  .pipe(z.nativeEnum(ProductStatus));

export const createItemSchema = z.object({
  name: itemNameSchema,
  description: itemDescriptionSchema,
  category: itemCategorySchema.optional().default(DEFAULT_ITEM_CATEGORY),
  status: itemStatusSchema.optional().default(ProductStatus.ACTIVE),
});

export const updateItemSchema = z
  .object({
    name: itemNameSchema.optional(),
    description: itemDescriptionSchema.optional(),
    category: itemCategorySchema.optional(),
    status: itemStatusSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  });

export const itemIdParamSchema = z.object({
  id: z.string().uuid('Invalid item id'),
});

export const listItemsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(500, 'Limit must be at most 500')
    .default(20),
  orderBy: z
    .enum(['name', 'category', 'status', 'created_at', 'updated_at'])
    .default('created_at'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
  category: itemCategorySchema.optional(),
  status: itemStatusSchema.optional(),
  search: z
    .string()
    .trim()
    .min(1, 'Search term cannot be empty')
    .max(ITEM_NAME_MAX_LENGTH)
    .optional(),
});

export type CreateItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
export type ItemIdParamDto = z.infer<typeof itemIdParamSchema>;
export type ListItemsQueryDto = z.infer<typeof listItemsQuerySchema>;

export const itemsValidation = {
  create: { body: createItemSchema },
  update: { body: updateItemSchema, params: itemIdParamSchema },
  getById: { params: itemIdParamSchema },
  delete: { params: itemIdParamSchema },
  list: { query: listItemsQuerySchema },
} satisfies Record<string, ValidationSchemas>;

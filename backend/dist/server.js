"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/models/Base.Model.ts
var import_objection2, BaseModel;
var init_Base_Model = __esm({
  "src/models/Base.Model.ts"() {
    "use strict";
    import_objection2 = require("objection");
    BaseModel = class extends import_objection2.Model {
      id;
      created_at;
      updated_at;
      static get modelPaths() {
        return [__dirname];
      }
      $beforeInsert(queryContext) {
        this.created_at = /* @__PURE__ */ new Date();
        this.updated_at = /* @__PURE__ */ new Date();
      }
      $beforeUpdate(opt, queryContext) {
        this.updated_at = /* @__PURE__ */ new Date();
      }
      $formatJson(json) {
        json = super.$formatJson(json);
        return json;
      }
    };
  }
});

// src/models/items.model.ts
var items_model_exports = {};
__export(items_model_exports, {
  Items: () => Items
});
var import_objection3, Items;
var init_items_model = __esm({
  "src/models/items.model.ts"() {
    "use strict";
    import_objection3 = require("objection");
    init_Base_Model();
    Items = class extends BaseModel {
      static tableName = "items";
      user_id;
      name;
      description;
      category;
      status;
      static get relationMappings() {
        const { User: User2 } = (init_User_model(), __toCommonJS(User_model_exports));
        return {
          user: {
            relation: import_objection3.Model.BelongsToOneRelation,
            modelClass: User2,
            join: {
              from: "items.user_id",
              to: "users.id"
            }
          }
        };
      }
    };
  }
});

// src/models/User.model.ts
var User_model_exports = {};
__export(User_model_exports, {
  User: () => User
});
var User;
var init_User_model = __esm({
  "src/models/User.model.ts"() {
    "use strict";
    init_Base_Model();
    User = class extends BaseModel {
      static tableName = "users";
      email;
      password_hash;
      first_name;
      last_name;
      email_verified;
      reset_token;
      reset_token_expires_at;
      get fullName() {
        return [this.first_name, this.last_name].filter(Boolean).join("");
      }
      static get relationMappings() {
        const { Items: Items2 } = (init_items_model(), __toCommonJS(items_model_exports));
        return {
          items: {
            relation: BaseModel.HasManyRelation,
            modelClass: Items2,
            join: {
              from: "users.id",
              to: "items.user_id"
            }
          }
        };
      }
    };
  }
});

// src/server.ts
var import_reflect_metadata2 = require("reflect-metadata");

// src/shared/logger/index.ts
var import_pino = __toESM(require("pino"));

// src/config/index.ts
var dotenv = __toESM(require("dotenv"));
var import_zod = require("zod");
dotenv.config();
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "staging", "production"]).default("development"),
  PORT: import_zod.z.string().default("4000"),
  APP_NAME: import_zod.z.string().default("ecommerce-api"),
  API_VERSION: import_zod.z.string().default("v1"),
  // Database
  DATABASE_URL: import_zod.z.string(),
  DATABASE_POOL_MIN: import_zod.z.string().default("2"),
  DATABASE_POOL_MAX: import_zod.z.string().default("20"),
  // Redis
  REDIS_URL: import_zod.z.string().default("redis://localhost:6379"),
  // JWT
  JWT_SECRET: import_zod.z.string(),
  JWT_EXPIRES_IN: import_zod.z.string().default("7d"),
  JWT_REFRESH_SECRET: import_zod.z.string(),
  JWT_REFRESH_EXPIRES_IN: import_zod.z.string().default("30d")
});
var env = envSchema.parse(process.env);
var config2 = {
  app: {
    name: env.APP_NAME,
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    apiVersion: env.API_VERSION,
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development"
  },
  database: {
    url: env.DATABASE_URL,
    pool: {
      min: parseInt(env.DATABASE_POOL_MIN, 10),
      max: parseInt(env.DATABASE_POOL_MAX, 10)
    }
  },
  redis: {
    url: env.REDIS_URL
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN
  }
};

// src/shared/logger/index.ts
var logger = (0, import_pino.default)({
  level: config2.app.isDevelopment ? "debug" : "info",
  transport: config2.app.isDevelopment ? {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  } : void 0,
  base: {
    env: config2.app.env,
    app: config2.app.name
  }
});

// src/database/index.ts
var import_knex = __toESM(require("knex"));
var import_objection = require("objection");
var knexInstance = null;
async function initializeDatabase() {
  if (knexInstance) {
    return knexInstance;
  }
  knexInstance = (0, import_knex.default)({
    client: "pg",
    connection: config2.database.url,
    pool: {
      min: config2.database.pool.min,
      max: config2.database.pool.max,
      afterCreate: (conn, done) => {
        done(null, conn);
      }
    }
  });
  import_objection.Model.knex(knexInstance);
  try {
    await knexInstance.raw("SELECT 1");
    logger.info("Database connection established");
  } catch (error) {
    logger.error("Failed to connect to database", error);
    throw error;
  }
  return knexInstance;
}
function getKnex() {
  if (!knexInstance) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return knexInstance;
}
async function closeDatabase() {
  if (knexInstance) {
    await knexInstance.destroy();
    knexInstance = null;
    logger.info("Database connection closed");
  }
}

// src/app.ts
var import_express6 = __toESM(require("express"));

// src/modules/health/health.route.ts
var import_express = require("express");

// src/shared/utils/response.util.ts
function SuccessResponse(message, data, meta) {
  return {
    status: true,
    message,
    ...data !== void 0 && { data },
    ...meta && { meta }
  };
}
function ErrorResponse(message, errorCode, errors) {
  return {
    status: false,
    message,
    ...errorCode && { errorCode },
    ...errors && { errors }
  };
}
function PaginatedResponse(message, data, meta) {
  return {
    status: true,
    message,
    data,
    meta
  };
}

// src/modules/health/health.controller.ts
var HealthController = class {
  check = async (_req, res) => {
    res.json(SuccessResponse("OK", { status: "healthy" }));
  };
  detailed = async (_req, res) => {
    const checks = {};
    try {
      const start = Date.now();
      await getKnex().raw("SELECT 1");
      checks.database = { status: "healthy", latency: Date.now() - start };
    } catch {
      checks.database = { status: "unhealthy" };
    }
    const allHealthy = Object.values(checks).every(
      (check) => check.status === "healthy"
    );
    res.status(allHealthy ? 200 : 503).json(
      SuccessResponse(allHealthy ? "All systems operational" : "Some systems unhealthy", {
        status: allHealthy ? "healthy" : "unhealthy",
        checks,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    );
  };
};

// src/modules/health/health.route.ts
var router = (0, import_express.Router)();
var controller = new HealthController();
router.get("/", controller.check);
router.get("/detailed", controller.detailed);
var health_route_default = router;

// src/modules/auth/auth.route.ts
var import_express2 = require("express");
var import_tsyringe4 = require("tsyringe");

// src/modules/auth/auth.controller.ts
var import_tsyringe = require("tsyringe");
var AuthController = class {
  constructor(authService) {
    this.authService = authService;
  }
  authService;
  register = async (req, res, next) => {
    try {
      const dto = req.body;
      const result = await this.authService.register(dto);
      res.status(201).json(
        SuccessResponse("Registration successful", {
          user: result.user,
          tokens: result.tokens
        })
      );
    } catch (error) {
      next(error);
    }
  };
  login = async (req, res, next) => {
    try {
      const dto = req.body;
      const result = await this.authService.login(dto);
      res.json(
        SuccessResponse("Login successful", {
          user: result.user,
          tokens: result.tokens
        })
      );
    } catch (error) {
      next(error);
    }
  };
  refreshToken = async (req, res, next) => {
    try {
      const dto = req.body;
      const tokens = await this.authService.refreshToken(dto.refreshToken);
      res.json(SuccessResponse("Token refreshed", { tokens }));
    } catch (error) {
      next(error);
    }
  };
  getMe = async (req, res, next) => {
    try {
      const user = await this.authService.getMe(req.userId);
      res.json(SuccessResponse("User retrieved", { user }));
    } catch (error) {
      next(error);
    }
  };
};
AuthController = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("AuthService"))
], AuthController);

// src/shared/middlewares/validate.middleware.ts
var import_zod2 = require("zod");

// src/shared/errors/app.error.ts
var AppError = class _AppError extends Error {
  statusCode;
  errorCode;
  isOperational;
  constructor(statusCode, errorCode, message, isOperational = true) {
    const normalizedStatusCode = typeof statusCode === "number" ? statusCode : Number(message);
    const normalizedMessage = typeof statusCode === "number" ? String(message) : statusCode;
    super(normalizedMessage);
    this.statusCode = normalizedStatusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};
var NotFoundError = class extends AppError {
  constructor(message = "Resource not found", errorCode = "NOT_FOUND") {
    super(404, message, errorCode);
  }
};
var UnauthorizedError = class extends AppError {
  constructor(message = "Unauthorized", errorCode = "UNAUTHORIZED") {
    super(401, message, errorCode);
  }
};
var ConflictError = class extends AppError {
  constructor(message = "Conflict", errorCode = "CONFLICT") {
    super(409, message, errorCode);
  }
};
var ValidationError = class extends AppError {
  errors;
  constructor(message = "Validation failed", errors = {}, errorCode = "VALIDATION_ERROR") {
    super(422, message, errorCode);
    this.errors = errors;
  }
};

// src/shared/middlewares/validate.middleware.ts
function validateMiddleware(schemas) {
  return async (req, _res, next) => {
    try {
      if ("parse" in schemas) {
        req.body = schemas.parse(req.body);
        return next();
      }
      const { body, query, params } = schemas;
      if (body) {
        req.body = body.parse(req.body);
      }
      if (query) {
        const parsedQuery = query.parse(req.query);
        Object.defineProperty(req, "query", {
          value: parsedQuery,
          writable: true,
          configurable: true
        });
      }
      if (params) {
        req.params = params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof import_zod2.ZodError) {
        const errors = formatZodErrors(error);
        next(new ValidationError("Validation failed", errors));
      } else {
        next(error);
      }
    }
  };
}
function formatZodErrors(error) {
  const errors = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  return errors;
}

// src/modules/auth/dto/auth.dto.ts
var import_zod3 = require("zod");
var registerSchema = import_zod3.z.object({
  email: import_zod3.z.string().email("Invalid email address"),
  password: import_zod3.z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  ),
  firstName: import_zod3.z.string().min(1, "First name is required").max(100),
  lastName: import_zod3.z.string().min(1, "Last name is required").max(100),
  phone: import_zod3.z.string().max(20).optional(),
  gender: import_zod3.z.enum(["male", "female", "other", "prefer_not_to_say"]).optional()
});
var loginSchema = import_zod3.z.object({
  email: import_zod3.z.string().email("Invalid email address"),
  password: import_zod3.z.string().min(1, "Password is required")
});
var forgotPasswordSchema = import_zod3.z.object({
  email: import_zod3.z.string().email("Invalid email address")
});
var resetPasswordSchema = import_zod3.z.object({
  token: import_zod3.z.string().min(1, "Reset token is required"),
  password: import_zod3.z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )
});
var changePasswordSchema = import_zod3.z.object({
  currentPassword: import_zod3.z.string().min(1, "Current password is required"),
  newPassword: import_zod3.z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )
});
var refreshTokenSchema = import_zod3.z.object({
  refreshToken: import_zod3.z.string().min(1, "Refresh token is required")
});

// src/shared/middlewares/auth.middleware.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_tsyringe3 = require("tsyringe");

// src/repositories/user.repo.ts
var import_tsyringe2 = require("tsyringe");

// src/repositories/base.repo.ts
var BaseRepository = class {
  model;
  constructor(model) {
    this.model = model;
  }
  async findById(id, relations) {
    let query = this.model.query().findById(id);
    if (relations?.length) {
      query = query.withGraphFetched(`[${relations.join(", ")}]`);
    }
    return query;
  }
  async findOne(conditions, relations) {
    let query = this.model.query().findOne(conditions);
    if (relations?.length) {
      query = query.withGraphFetched(`[${relations.join(", ")}]`);
    }
    return query;
  }
  async findAll(conditions, options) {
    let query = this.model.query();
    if (conditions) {
      query = query.where(conditions);
    }
    if (options?.orderBy) {
      query = query.orderBy(options.orderBy, options.orderDir || "asc");
    }
    if (options?.withRelations?.length) {
      query = query.withGraphFetched(`[${options.withRelations.join(", ")}]`);
    }
    if (options?.limit) {
      const offset = ((options.page || 1) - 1) * options.limit;
      query = query.offset(offset).limit(options.limit);
    }
    return query;
  }
  async paginate(conditions = {}, options = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const offset = (page - 1) * limit;
    let query = this.model.query().where(conditions);
    if (options.orderBy) {
      query = query.orderBy(options.orderBy, options.orderDir || "asc");
    }
    if (options.withRelations?.length) {
      query = query.withGraphFetched(`[${options.withRelations.join(", ")}]`);
    }
    const [data, countResult] = await Promise.all([
      query.clone().offset(offset).limit(limit),
      this.model.query().where(conditions).count("* as count").first()
    ]);
    const total = Number(countResult?.count || 0);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async create(data, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    return query.insert(data).returning("*");
  }
  async createMany(data, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    return query.insert(data).returning("*");
  }
  async update(id, data, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    return query.patchAndFetchById(id, data);
  }
  async updateWhere(conditions, data, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    return query.patch(data).where(conditions);
  }
  async delete(id, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    return query.deleteById(id);
  }
  async deleteWhere(conditions, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    return query.delete().where(conditions);
  }
  async count(conditions) {
    let query = this.model.query();
    if (conditions) {
      query = query.where(conditions);
    }
    const result = await query.count("* as count").first();
    return Number(result?.count || 0);
  }
  async exists(conditions) {
    const count = await this.count(conditions);
    return count > 0;
  }
  async increment(id, column, amount = 1, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    await query.findById(id).increment(column, amount);
  }
  async decrement(id, column, amount = 1, trx) {
    const query = trx ? this.model.query(trx) : this.model.query();
    await query.findById(id).decrement(column, amount);
  }
  getQueryBuilder() {
    return this.model.query();
  }
};

// src/repositories/user.repo.ts
init_User_model();
var UserRepository = class extends BaseRepository {
  constructor() {
    super(User);
  }
  async findByEmail(email) {
    return this.model.query().where("email", email.toLowerCase()).first();
  }
};
UserRepository = __decorateClass([
  (0, import_tsyringe2.injectable)()
], UserRepository);

// src/shared/middlewares/auth.middleware.ts
function authMiddleware(options = {}) {
  return async (req, _res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        if (options.optional) {
          return next();
        }
        throw new UnauthorizedError("No token provided", "NO_TOKEN");
      }
      const token = authHeader.split(" ")[1];
      let payload;
      try {
        payload = import_jsonwebtoken.default.verify(token, config2.jwt.secret);
      } catch (error) {
        if (options.optional) {
          return next();
        }
        throw new UnauthorizedError("Invalid token", "INVALID_TOKEN");
      }
      const userRepo = import_tsyringe3.container.resolve(UserRepository);
      const user = await userRepo.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
      }
      req.user = user;
      req.userId = user.id;
      next();
    } catch (error) {
      next(error);
    }
  };
}
var optionalAuth = authMiddleware({ optional: true });

// src/modules/auth/auth.route.ts
var router2 = (0, import_express2.Router)();
var getController = () => import_tsyringe4.container.resolve(AuthController);
router2.post(
  "/register",
  validateMiddleware({ body: registerSchema }),
  (req, res, next) => getController().register(req, res, next)
);
router2.post(
  "/login",
  validateMiddleware({ body: loginSchema }),
  (req, res, next) => getController().login(req, res, next)
);
router2.post(
  "/refresh",
  validateMiddleware({ body: refreshTokenSchema }),
  (req, res, next) => getController().refreshToken(req, res, next)
);
router2.get(
  "/me",
  authMiddleware(),
  (req, res, next) => getController().getMe(req, res, next)
);
var auth_route_default = router2;

// src/modules/items/items.route.ts
var import_express3 = require("express");
var import_tsyringe6 = require("tsyringe");

// src/modules/items/items.controller.ts
var import_tsyringe5 = require("tsyringe");
var ItemsController = class {
  constructor(itemsService) {
    this.itemsService = itemsService;
  }
  itemsService;
  list = async (req, res, next) => {
    try {
      const query = req.query;
      const result = await this.itemsService.listItems(query);
      res.json(
        PaginatedResponse("Items retrieved", result.data, result.meta)
      );
    } catch (error) {
      next(error);
    }
  };
  create = async (req, res, next) => {
    try {
      const dto = req.body;
      const item = await this.itemsService.createItem(req.userId, dto);
      res.status(201).json(SuccessResponse("Item created", { item }));
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {
    try {
      const dto = req.body;
      const item = await this.itemsService.updateItem(
        req.userId,
        req.params.id,
        dto
      );
      res.json(SuccessResponse("Item updated", { item }));
    } catch (error) {
      next(error);
    }
  };
  delete = async (req, res, next) => {
    try {
      await this.itemsService.deleteItem(req.userId, req.params.id);
      res.json(SuccessResponse("Item deleted"));
    } catch (error) {
      next(error);
    }
  };
};
ItemsController = __decorateClass([
  (0, import_tsyringe5.injectable)(),
  __decorateParam(0, (0, import_tsyringe5.inject)("ItemsService"))
], ItemsController);

// src/modules/items/dto/items.dto.ts
var import_zod4 = require("zod");
var ITEM_NAME_MAX_LENGTH = 255;
var ITEM_CATEGORY_MAX_LENGTH = 50;
var DEFAULT_ITEM_CATEGORY = "Other";
var itemNameSchema = import_zod4.z.string().trim().min(1, "Name is required").max(ITEM_NAME_MAX_LENGTH, `Name must be at most ${ITEM_NAME_MAX_LENGTH} characters`);
var itemDescriptionSchema = import_zod4.z.string().trim().min(1, "Description is required");
var itemCategorySchema = import_zod4.z.string().trim().min(1, "Category is required").max(
  ITEM_CATEGORY_MAX_LENGTH,
  `Category must be at most ${ITEM_CATEGORY_MAX_LENGTH} characters`
);
var itemStatusSchema = import_zod4.z.enum(["active", "draft"], {
  errorMap: () => ({ message: "Status must be published or draft" })
});
var createItemSchema = import_zod4.z.object({
  name: itemNameSchema,
  description: itemDescriptionSchema,
  category: itemCategorySchema.optional().default(DEFAULT_ITEM_CATEGORY),
  status: itemStatusSchema.optional().default("active")
});
var updateItemSchema = import_zod4.z.object({
  name: itemNameSchema.optional(),
  description: itemDescriptionSchema.optional(),
  category: itemCategorySchema.optional(),
  status: itemStatusSchema.optional()
}).refine((data) => Object.values(data).some((value) => value !== void 0), {
  message: "At least one field must be provided"
});
var itemIdParamSchema = import_zod4.z.object({
  id: import_zod4.z.string().uuid("Invalid item id")
});
var listItemsQuerySchema = import_zod4.z.object({
  page: import_zod4.z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  limit: import_zod4.z.coerce.number().int().min(1, "Limit must be at least 1").max(500, "Limit must be at most 500").default(20),
  orderBy: import_zod4.z.enum(["name", "category", "status", "created_at", "updated_at"]).default("created_at"),
  orderDir: import_zod4.z.enum(["asc", "desc"]).default("desc"),
  category: itemCategorySchema.optional(),
  status: itemStatusSchema.optional(),
  search: import_zod4.z.string().trim().min(1, "Search term cannot be empty").max(ITEM_NAME_MAX_LENGTH).optional()
});
var itemsValidation = {
  create: { body: createItemSchema },
  update: { body: updateItemSchema, params: itemIdParamSchema },
  getById: { params: itemIdParamSchema },
  delete: { params: itemIdParamSchema },
  list: { query: listItemsQuerySchema }
};

// src/modules/items/items.route.ts
var router3 = (0, import_express3.Router)();
var getController2 = () => import_tsyringe6.container.resolve(ItemsController);
router3.get(
  "/",
  validateMiddleware(itemsValidation.list),
  (req, res, next) => getController2().list(req, res, next)
);
router3.post(
  "/",
  authMiddleware(),
  validateMiddleware(itemsValidation.create),
  (req, res, next) => getController2().create(req, res, next)
);
router3.put(
  "/:id",
  authMiddleware(),
  validateMiddleware(itemsValidation.update),
  (req, res, next) => getController2().update(req, res, next)
);
router3.delete(
  "/:id",
  authMiddleware(),
  validateMiddleware(itemsValidation.delete),
  (req, res, next) => getController2().delete(req, res, next)
);
var items_route_default = router3;

// src/modules/dashboard/dashboard.route.ts
var import_express4 = require("express");
var import_tsyringe8 = require("tsyringe");

// src/modules/dashboard/dashboard.controller.ts
var import_tsyringe7 = require("tsyringe");
var DashboardController = class {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }
  dashboardService;
  getStats = async (_req, res, next) => {
    try {
      const data = await this.dashboardService.getStats();
      res.json(SuccessResponse("Dashboard stats retrieved", data));
    } catch (error) {
      next(error);
    }
  };
  getRecentItems = async (_req, res, next) => {
    try {
      const items = await this.dashboardService.getRecentItems();
      res.json(SuccessResponse("Recent items retrieved", items));
    } catch (error) {
      next(error);
    }
  };
};
DashboardController = __decorateClass([
  (0, import_tsyringe7.injectable)(),
  __decorateParam(0, (0, import_tsyringe7.inject)("DashboardService"))
], DashboardController);

// src/modules/dashboard/dashboard.route.ts
var router4 = (0, import_express4.Router)();
var getController3 = () => import_tsyringe8.container.resolve(DashboardController);
router4.get(
  "/stats",
  authMiddleware(),
  (req, res, next) => getController3().getStats(req, res, next)
);
router4.get(
  "/recent-items",
  authMiddleware(),
  (req, res, next) => getController3().getRecentItems(req, res, next)
);
var dashboard_route_default = router4;

// src/shared/middlewares/index.ts
var import_express5 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_compression = __toESM(require("compression"));

// src/shared/middlewares/error-handler.middleware.ts
function errorHandler(err, req, res, _next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });
  if (err instanceof AppError) {
    const response2 = ErrorResponse(
      err.message,
      err.errorCode,
      err instanceof ValidationError ? err.errors : void 0
    );
    res.status(err.statusCode).json(response2);
    return;
  }
  if (err.name === "ValidationError") {
    const response2 = ErrorResponse(
      "Validation failed",
      "VALIDATION_ERROR"
    );
    res.status(400).json(response2);
    return;
  }
  if (err.name === "NotFoundError") {
    const response2 = ErrorResponse("Resource not found", "NOT_FOUND");
    res.status(404).json(response2);
    return;
  }
  if (err.name === "UniqueViolationError") {
    const response2 = ErrorResponse(
      "Resource already exists",
      "DUPLICATE_ENTRY"
    );
    res.status(409).json(response2);
    return;
  }
  if (err.name === "ForeignKeyViolationError") {
    const response2 = ErrorResponse(
      "Referenced resource not found",
      "FOREIGN_KEY_VIOLATION"
    );
    res.status(400).json(response2);
    return;
  }
  if (err.name === "JsonWebTokenError") {
    const response2 = ErrorResponse("Invalid token", "INVALID_TOKEN");
    res.status(401).json(response2);
    return;
  }
  if (err.name === "TokenExpiredError") {
    const response2 = ErrorResponse("Token expired", "TOKEN_EXPIRED");
    res.status(401).json(response2);
    return;
  }
  const message = config2.app.isProduction ? "Internal server error" : err.message;
  const response = ErrorResponse(message, "INTERNAL_ERROR");
  res.status(500).json(response);
}
function notFoundHandler(req, res) {
  const response = ErrorResponse(
    `Route ${req.method} ${req.path} not found`,
    "ROUTE_NOT_FOUND"
  );
  res.status(404).json(response);
}

// src/shared/middlewares/index.ts
function initializeMiddlewares(app) {
  app.use((0, import_helmet.default)());
  app.use((0, import_cors.default)({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      const allowedOrigins = [
        "http://localhost:3000"
        // 'https://frontend-production-82f8.up.railway.app',
      ];
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".railway.app") || origin.endsWith(".up.railway.app") || // Allow any custom domain (tenant domains) - they all point to our frontend
      // In production, you could validate against registered tenant domains
      origin.startsWith("https://");
      callback(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id", "x-tenant-slug", "x-idempotency-key"]
  }));
  app.use((0, import_compression.default)());
  app.use(import_express5.default.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(import_express5.default.urlencoded({ extended: true, limit: "10mb" }));
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    });
    next();
  });
}
function initializeErrorHandlers(app) {
  app.use(notFoundHandler);
  app.use(errorHandler);
}

// src/app.ts
function createApp() {
  const app = (0, import_express6.default)();
  initializeMiddlewares(app);
  const apiPrefix = `/api/${config2.app.apiVersion}`;
  app.use("/health", health_route_default);
  app.use(`${apiPrefix}/auth`, auth_route_default);
  app.use(`${apiPrefix}/items`, items_route_default);
  app.use(`${apiPrefix}/dashboard`, dashboard_route_default);
  initializeErrorHandlers(app);
  return app;
}

// src/bootstrap.ts
var import_reflect_metadata = require("reflect-metadata");

// src/repositories/items.repo.ts
var import_tsyringe9 = require("tsyringe");
init_items_model();
var ItemsRepository = class extends BaseRepository {
  constructor() {
    super(Items);
  }
  async findFiltered(filters, options = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const offset = (page - 1) * limit;
    const applyFilters = (query) => {
      if (filters.category) {
        query.where("category", filters.category);
      }
      if (filters.status) {
        query.where("status", filters.status);
      }
      if (filters.search) {
        const term = `%${filters.search}%`;
        query.where((builder) => {
          builder.where("name", "ilike", term).orWhere("description", "ilike", term);
        });
      }
      return query;
    };
    let dataQuery = applyFilters(Items.query());
    const countQuery = applyFilters(Items.query());
    if (options.orderBy) {
      dataQuery = dataQuery.orderBy(options.orderBy, options.orderDir || "asc");
    }
    const [data, countResult] = await Promise.all([
      dataQuery.offset(offset).limit(limit),
      countQuery.count("* as count").first()
    ]);
    const total = Number(countResult?.count || 0);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 0
      }
    };
  }
  async findByIdForUser(id, userId) {
    return Items.query().findById(id).where("user_id", userId).first();
  }
};
ItemsRepository = __decorateClass([
  (0, import_tsyringe9.injectable)()
], ItemsRepository);

// src/modules/auth/auth.service.ts
var import_tsyringe10 = require("tsyringe");

// src/shared/utils/encrypt.util.ts
var bcrypt = __toESM(require("bcryptjs"));
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
async function verifyPassword(password, hash2) {
  return bcrypt.compare(password, hash2);
}

// src/modules/auth/auth.service.ts
var import_objection4 = require("objection");
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var AuthService = class {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }
  userRepo;
  async register(dto) {
    const existingUser = await this.userRepo.findByEmail(
      dto.email.toLowerCase()
    );
    if (existingUser) {
      throw new ConflictError("Email already registered", "Email_Exits");
    }
    const passwwordHash = await hashPassword(dto.password);
    const user = await this.userRepo.create({
      email: dto.email.toLowerCase(),
      password_hash: passwwordHash,
      first_name: dto.firstName,
      last_name: dto.lastName
    });
    const tokens = this.generateTokens(user);
    return { user, tokens };
  }
  async login(dto) {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase());
    if (!user || !user.password_hash) {
      throw new UnauthorizedError(
        "Invalid email or password",
        "INVALID_CREDENTIALS"
      );
    }
    const isValidPassword = await verifyPassword(dto.password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError(
        "Invalid email or password",
        "INVALID_CREDENTIALS"
      );
    }
    const tokens = this.generateTokens(user);
    return { user, tokens };
  }
  async refreshToken(refreshToken) {
    try {
      const payload = import_jsonwebtoken2.default.verify(
        refreshToken,
        config2.jwt.refreshSecret
      );
      if (payload.type !== "refresh") {
        throw new UnauthorizedError("Invalid refresh token", "INVALID_TOKEN");
      }
      const user = await this.userRepo.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
      }
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError("Invalid refresh token", "INVALID_TOKEN");
    }
  }
  //   async forgotPassword(email: string): Promise<void> {
  //     const user = await this.userRepo.findByEmail(email.toLowerCase());
  //     if (!user) {
  //         return
  //     }
  //     const resetToken = generateRandomToken(32);
  //     const expiresAt = addMinutes(new Date(), 60); // 1 hour
  //     await this.userRepo.setResetToken(user.id, resetToken, expiresAt);
  //   }
  async getMe(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new import_objection4.NotFoundError("User not found");
    }
    return user;
  }
  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email
    };
    const accessToken = import_jsonwebtoken2.default.sign(payload, config2.jwt.secret, {
      expiresIn: config2.jwt.expiresIn
    });
    const refreshToken = import_jsonwebtoken2.default.sign(
      { ...payload, type: "refresh" },
      config2.jwt.refreshSecret,
      { expiresIn: config2.jwt.refreshExpiresIn }
    );
    const expiresInMatch = config2.jwt.expiresIn.match(/^(\d+)([dhms])$/);
    let expiresIn = 3600;
    if (expiresInMatch) {
      const value = parseInt(expiresInMatch[1], 10);
      const unit = expiresInMatch[2];
      switch (unit) {
        case "d":
          expiresIn = value * 86400;
          break;
        case "h":
          expiresIn = value * 3600;
          break;
        case "m":
          expiresIn = value * 60;
          break;
        case "s":
          expiresIn = value;
          break;
      }
    }
    return { accessToken, refreshToken, expiresIn };
  }
};
AuthService = __decorateClass([
  (0, import_tsyringe10.injectable)(),
  __decorateParam(0, (0, import_tsyringe10.inject)("UserRepository"))
], AuthService);

// src/modules/items/items.service.ts
var import_tsyringe11 = require("tsyringe");
var ItemsService = class {
  constructor(itemsRepo) {
    this.itemsRepo = itemsRepo;
  }
  itemsRepo;
  async listItems(query) {
    const { page, limit, orderBy, orderDir, category, status, search } = query;
    return this.itemsRepo.findFiltered(
      { category, status, search },
      { page, limit, orderBy, orderDir }
    );
  }
  async createItem(userId, dto) {
    return this.itemsRepo.create({
      user_id: userId,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      status: dto.status
    });
  }
  async updateItem(userId, itemId, dto) {
    const item = await this.itemsRepo.findByIdForUser(itemId, userId);
    if (!item) {
      throw new NotFoundError("Item not found", "ITEM_NOT_FOUND");
    }
    return this.itemsRepo.update(itemId, dto);
  }
  async deleteItem(userId, itemId) {
    const item = await this.itemsRepo.findByIdForUser(itemId, userId);
    if (!item) {
      throw new NotFoundError("Item not found", "ITEM_NOT_FOUND");
    }
    await this.itemsRepo.delete(itemId);
  }
};
ItemsService = __decorateClass([
  (0, import_tsyringe11.injectable)(),
  __decorateParam(0, (0, import_tsyringe11.inject)("ItemsRepository"))
], ItemsService);

// src/modules/dashboard/dashboard.service.ts
var import_tsyringe12 = require("tsyringe");
var DashboardService = class {
  constructor(itemsRepo) {
    this.itemsRepo = itemsRepo;
  }
  itemsRepo;
  async getStats() {
    const items = await this.itemsRepo.findAll();
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const contributorSet = /* @__PURE__ */ new Set();
    const categorySet = /* @__PURE__ */ new Set();
    const categoryCounts = {};
    let addedToday = 0;
    for (const item of items) {
      if (item.user_id) contributorSet.add(item.user_id);
      const cat = item.category || "Other";
      categorySet.add(cat);
      categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
      if (new Date(item.created_at) >= todayStart) addedToday++;
    }
    return {
      total: items.length,
      totalContributors: contributorSet.size,
      totalCategories: categorySet.size,
      addedToday,
      categories: categoryCounts
    };
  }
  async getRecentItems(limit = 6) {
    return this.itemsRepo.findAll(
      void 0,
      { orderBy: "created_at", orderDir: "desc", limit }
    );
  }
};
DashboardService = __decorateClass([
  (0, import_tsyringe12.injectable)(),
  __decorateParam(0, (0, import_tsyringe12.inject)("ItemsRepository"))
], DashboardService);

// src/bootstrap.ts
var import_tsyringe13 = require("tsyringe");
function registerDependenciesInternal() {
  import_tsyringe13.container.registerSingleton("UserRepository", UserRepository);
  import_tsyringe13.container.registerSingleton("AuthService", AuthService);
  import_tsyringe13.container.registerSingleton(AuthController, AuthController);
  import_tsyringe13.container.registerSingleton("ItemsRepository", ItemsRepository);
  import_tsyringe13.container.registerSingleton("ItemsService", ItemsService);
  import_tsyringe13.container.registerSingleton(ItemsController, ItemsController);
  import_tsyringe13.container.registerSingleton("DashboardService", DashboardService);
  import_tsyringe13.container.registerSingleton(DashboardController, DashboardController);
}
registerDependenciesInternal();
function registerDependencies() {
}

// src/server.ts
async function startServer() {
  try {
    await initializeDatabase();
    logger.info("Database initialized");
    registerDependencies();
    logger.info("Dependencies registered");
    const app = createApp();
    logger.info("App created");
    const server = app.listen(config2.app.port, () => {
      logger.info(`Server running on port ${config2.app.port}`);
      logger.info(`Environment: ${config2.app.env}`);
      logger.info(`API Version: http://localhost:${config2.app.port}/api/${config2.app.apiVersion}`);
    });
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        logger.info("Http server closed");
        await closeDatabase();
        logger.info("Database connection closed");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 1e4);
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("uncaughtException", (error) => {
      logger.error({ err: error }, "Uncaught exception");
      process.exit(1);
    });
    process.on("unhandledRejection", (reason, promise) => {
      logger.error({ err: reason, promise }, "Unhandled rejection");
    });
  } catch (error) {
    logger.error({ err: error }, "Server startup failed");
    process.exit(1);
  }
}
startServer();
//# sourceMappingURL=server.js.map
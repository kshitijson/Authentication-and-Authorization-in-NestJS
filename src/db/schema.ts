import { serial, text, pgTable, pgSchema, uuid, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
    id: serial('id').primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const roleSchema = pgTable("roles", {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(()=>userSchema.id),
    role: text("role").notNull(),
})

export const postsSchema = pgTable("posts", {
    id: serial("id").primaryKey(),
    author_id: integer("author_id").notNull().references(()=>userSchema.id),
    title: text("title").notNull(),
    blog: text("blog").notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    is_deleted: boolean('is_deleted').notNull().default(false)
    // is_deleted: boolean("is_deleted").notNull().default(false)
});
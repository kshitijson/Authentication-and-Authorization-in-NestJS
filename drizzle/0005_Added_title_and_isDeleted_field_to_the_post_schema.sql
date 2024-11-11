ALTER TABLE "posts" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;
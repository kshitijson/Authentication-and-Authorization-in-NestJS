ALTER TABLE "posts" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;
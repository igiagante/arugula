ALTER TABLE "Grow" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Grow" ADD CONSTRAINT "Grow_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;
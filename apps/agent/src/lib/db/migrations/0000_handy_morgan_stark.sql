CREATE TABLE "Chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"userId" text,
	"organizationId" text NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Document" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"text" varchar DEFAULT 'text' NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "Document_id_createdAt_pk" PRIMARY KEY("id","createdAt")
);
--> statement-breakpoint
CREATE TABLE "Grow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"indoorId" uuid NOT NULL,
	"organizationId" text NOT NULL,
	"name" text NOT NULL,
	"stage" text NOT NULL,
	"startDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"progress" numeric(3, 1),
	"archived" boolean DEFAULT false NOT NULL,
	"substrateComposition" jsonb,
	"potSize" numeric(5, 2),
	"potSizeUnit" varchar(10) DEFAULT 'L',
	"growingMethod" text,
	"images" text[],
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GrowCollaborator" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"growId" uuid NOT NULL,
	"userId" text NOT NULL,
	"role" varchar NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "GrowCollaborator_userId_growId_unique" UNIQUE("userId","growId")
);
--> statement-breakpoint
CREATE TABLE "Indoor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"height" numeric(5, 2),
	"width" numeric(5, 2),
	"length" numeric(5, 2),
	"dimensionUnit" varchar(10) DEFAULT 'cm',
	"temperature" numeric,
	"humidity" numeric,
	"co2" numeric,
	"images" text[],
	"notes" text,
	"createdBy" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Lamp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"indoorId" uuid NOT NULL,
	"lampType" text NOT NULL,
	"lightIntensity" numeric,
	"fanSpeed" numeric,
	"current" numeric(5, 2),
	"voltage" numeric(5, 1),
	"power" numeric(6, 1),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"role" varchar NOT NULL,
	"content" json NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Organization" (
	"id" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "Organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "Plant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"growId" uuid NOT NULL,
	"strainId" uuid,
	"customName" text NOT NULL,
	"stage" text DEFAULT 'seedling',
	"archived" boolean DEFAULT false NOT NULL,
	"potSize" numeric(5, 2),
	"potSizeUnit" varchar(10) DEFAULT 'L',
	"harvestedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantNote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plantId" uuid NOT NULL,
	"content" text NOT NULL,
	"images" text[],
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"category" text,
	"defaultCost" numeric(10, 2),
	"description" text,
	"productUrl" text,
	"extraData" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SensorReading" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"indoorId" uuid NOT NULL,
	"recordedAt" timestamp with time zone DEFAULT now(),
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Strain" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"genotype" text,
	"breeder" text,
	"floweringType" text,
	"ratio" text,
	"indoorVegTime" text,
	"indoorFlowerTime" text,
	"indoorYield" text,
	"indoorHeight" text,
	"outdoorHeight" text,
	"outdoorYield" text,
	"cannabinoidProfile" jsonb,
	"terpeneProfile" text,
	"awards" text,
	"description" text,
	"images" text[]
);
--> statement-breakpoint
CREATE TABLE "Suggestion" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"documentCreatedAt" timestamp NOT NULL,
	"originalText" text NOT NULL,
	"suggestedText" text NOT NULL,
	"description" text,
	"isResolved" boolean DEFAULT false NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "Suggestion_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "Task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taskTypeId" text NOT NULL,
	"growId" uuid NOT NULL,
	"userId" text NOT NULL,
	"notes" text,
	"details" jsonb,
	"images" text[],
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TaskPlant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taskId" uuid NOT NULL,
	"plantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TaskProduct" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"taskId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"quantity" numeric(10, 2),
	"unit" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TaskType" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text,
	"schema" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"firstName" text DEFAULT '' NOT NULL,
	"lastName" text DEFAULT '' NOT NULL,
	"imageUrl" text DEFAULT '' NOT NULL,
	"preferences" jsonb,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Vote" (
	"chatId" uuid NOT NULL,
	"messageId" uuid NOT NULL,
	"isUpvoted" boolean NOT NULL,
	CONSTRAINT "Vote_chatId_messageId_pk" PRIMARY KEY("chatId","messageId")
);
--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Grow" ADD CONSTRAINT "Grow_indoorId_Indoor_id_fk" FOREIGN KEY ("indoorId") REFERENCES "public"."Indoor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Grow" ADD CONSTRAINT "Grow_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GrowCollaborator" ADD CONSTRAINT "GrowCollaborator_growId_Grow_id_fk" FOREIGN KEY ("growId") REFERENCES "public"."Grow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GrowCollaborator" ADD CONSTRAINT "GrowCollaborator_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Indoor" ADD CONSTRAINT "Indoor_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Lamp" ADD CONSTRAINT "Lamp_indoorId_Indoor_id_fk" FOREIGN KEY ("indoorId") REFERENCES "public"."Indoor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_growId_Grow_id_fk" FOREIGN KEY ("growId") REFERENCES "public"."Grow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_strainId_Strain_id_fk" FOREIGN KEY ("strainId") REFERENCES "public"."Strain"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PlantNote" ADD CONSTRAINT "PlantNote_plantId_Plant_id_fk" FOREIGN KEY ("plantId") REFERENCES "public"."Plant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SensorReading" ADD CONSTRAINT "SensorReading_indoorId_Indoor_id_fk" FOREIGN KEY ("indoorId") REFERENCES "public"."Indoor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_documentId_documentCreatedAt_Document_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskTypeId_TaskType_id_fk" FOREIGN KEY ("taskTypeId") REFERENCES "public"."TaskType"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_growId_Grow_id_fk" FOREIGN KEY ("growId") REFERENCES "public"."Grow"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TaskPlant" ADD CONSTRAINT "TaskPlant_taskId_Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TaskPlant" ADD CONSTRAINT "TaskPlant_plantId_Plant_id_fk" FOREIGN KEY ("plantId") REFERENCES "public"."Plant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TaskProduct" ADD CONSTRAINT "TaskProduct_taskId_Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TaskProduct" ADD CONSTRAINT "TaskProduct_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_messageId_Message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "grow_organizationId_idx" ON "Grow" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "growCollaborator_userId_idx" ON "GrowCollaborator" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "growCollaborator_growId_idx" ON "GrowCollaborator" USING btree ("growId");
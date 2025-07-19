CREATE TABLE "submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"payment_date" date NOT NULL,
	"submission_time" timestamp DEFAULT now() NOT NULL,
	"submitter" varchar(32) NOT NULL,
	"approved" boolean DEFAULT false,
	"country" varchar(2) NOT NULL,
	"declared_value" integer NOT NULL,
	"paid_customs" integer NOT NULL,
	"notes" varchar(500),
	"thing_id" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "things" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"image" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_thing_id_things_id_fk" FOREIGN KEY ("thing_id") REFERENCES "public"."things"("id") ON DELETE no action ON UPDATE no action;
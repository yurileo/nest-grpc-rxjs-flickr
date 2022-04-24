import {MigrationInterface, QueryRunner} from "typeorm";

export class test1650746172630 implements MigrationInterface {
    name = 'test1650746172630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "link" character varying NOT NULL, "media" jsonb NOT NULL, "date_taken" TIMESTAMP WITH TIME ZONE NOT NULL, "description" character varying NOT NULL, "published" TIMESTAMP WITH TIME ZONE NOT NULL, "author" character varying NOT NULL, "author_id" character varying NOT NULL, "tags" character varying NOT NULL, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fa70f05b968e74f1dc010b3d9b" ON "photo" ("link") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fa70f05b968e74f1dc010b3d9b"`);
        await queryRunner.query(`DROP TABLE "photo"`);
    }

}

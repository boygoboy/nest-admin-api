import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1719460512408 implements MigrationInterface {
    name = 'Init1719460512408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE  \`menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(50) NOT NULL COMMENT '权限标识', \`name\` varchar(50) NULL COMMENT '菜单名称', \`component\` varchar(50) NULL COMMENT '菜单组件', \`parentId\` int NULL COMMENT '菜单父级ID', \`path\` varchar(50) NOT NULL COMMENT '菜单路径', \`redirect\` varchar(50) NULL COMMENT '菜单重定向', \`sort\` int NOT NULL COMMENT '菜单排序', \`type\` enum ('1', '2') NOT NULL COMMENT '菜单类型' DEFAULT '1', \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`remark\` varchar(255) NOT NULL COMMENT '菜单备注', \`isLink\` tinyint NOT NULL COMMENT '是否是外链', \`meta\` json NOT NULL COMMENT '菜单元信息', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE  \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roleCode\` varchar(20) NOT NULL COMMENT '角色编码', \`roleName\` varchar(20) NOT NULL COMMENT '角色名称', \`status\` tinyint NOT NULL COMMENT '角色状态' DEFAULT 0, \`remark\` varchar(255) NULL COMMENT '备注', \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE  \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(20) NOT NULL COMMENT '用户名', \`nickName\` varchar(20) NOT NULL COMMENT '昵称', \`accountStatus\` tinyint NOT NULL COMMENT '账好状态' DEFAULT 0, \`password\` varchar(50) NOT NULL COMMENT '密码', \`email\` varchar(50) NOT NULL COMMENT '邮箱', \`mobile\` varchar(20) NOT NULL COMMENT '手机号', \`remark\` varchar(255) NULL COMMENT '备注', \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_d376a9f93bba651f32a2c03a7d\` (\`mobile\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE  \`role_menu\` (\`rolesId\` int NOT NULL, \`menusId\` int NOT NULL, INDEX \`IDX_e514ec73ca15187d43e56511a6\` (\`rolesId\`), INDEX \`IDX_8201d8c066af91187a973ecd23\` (\`menusId\`), PRIMARY KEY (\`rolesId\`, \`menusId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE  \`user_roles\` (\`usersId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_99b019339f52c63ae615358738\` (\`usersId\`), INDEX \`IDX_13380e7efec83468d73fc37938\` (\`rolesId\`), PRIMARY KEY (\`usersId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE  \`menus_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_c81e4048dfb2c0ece2991b2861\` (\`id_ancestor\`), INDEX \`IDX_bf17e591ba8ef6f772d6187888\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`menus\` ADD CONSTRAINT \`FK_8523e13f1ba719e16eb474657ec\` FOREIGN KEY (\`parentId\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_e514ec73ca15187d43e56511a6a\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_menu\` ADD CONSTRAINT \`FK_8201d8c066af91187a973ecd23d\` FOREIGN KEY (\`menusId\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_99b019339f52c63ae6153587380\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`menus_closure\` ADD CONSTRAINT \`FK_c81e4048dfb2c0ece2991b28616\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`menus_closure\` ADD CONSTRAINT \`FK_bf17e591ba8ef6f772d61878884\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menus_closure\` DROP FOREIGN KEY \`FK_bf17e591ba8ef6f772d61878884\``);
        await queryRunner.query(`ALTER TABLE \`menus_closure\` DROP FOREIGN KEY \`FK_c81e4048dfb2c0ece2991b28616\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_99b019339f52c63ae6153587380\``);
        await queryRunner.query(`ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_8201d8c066af91187a973ecd23d\``);
        await queryRunner.query(`ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_e514ec73ca15187d43e56511a6a\``);
        await queryRunner.query(`ALTER TABLE \`menus\` DROP FOREIGN KEY \`FK_8523e13f1ba719e16eb474657ec\``);
        await queryRunner.query(`DROP INDEX \`IDX_bf17e591ba8ef6f772d6187888\` ON \`menus_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_c81e4048dfb2c0ece2991b2861\` ON \`menus_closure\``);
        await queryRunner.query(`DROP TABLE \`menus_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_13380e7efec83468d73fc37938\` ON \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_99b019339f52c63ae615358738\` ON \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_8201d8c066af91187a973ecd23\` ON \`role_menu\``);
        await queryRunner.query(`DROP INDEX \`IDX_e514ec73ca15187d43e56511a6\` ON \`role_menu\``);
        await queryRunner.query(`DROP TABLE \`role_menu\``);
        await queryRunner.query(`DROP INDEX \`IDX_d376a9f93bba651f32a2c03a7d\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`menus\``);
    }

}

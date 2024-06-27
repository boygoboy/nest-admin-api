import { DataSource } from "typeorm";
import { User } from "../api/system/user/entities/user.entity";
import { Role } from "../api/system/role/entities/role.entity";
import { Menu } from "../api/system/menu/entities/menu.entity";
import { getConfig } from "../config";
const appConfig = getConfig()

export default new DataSource({
    type: "mysql",
    host: appConfig.mysql.host,
    port: appConfig.mysql.port,
    username: appConfig.mysql.username,
    password: appConfig.mysql.password,
    database: appConfig.mysql.database,
    synchronize: appConfig.mysql.synchronize,
    logging: appConfig.mysql.logging as boolean,
    entities: [User, Role, Menu],
    poolSize: appConfig.mysql.poolSize,
    migrations: ['src/migrations/**.ts'],
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
});
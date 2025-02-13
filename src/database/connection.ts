import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "sqlite",
    database: "database.db",
    synchronize: true,
    entities: []
});
import 'dotenv/config';
import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [],
});

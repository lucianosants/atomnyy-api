import 'dotenv/config';
import { DataSourceOptions, DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { ShoppingList } from '../shopping-list/entities/shopping-list.entity';

import { CreateUsersTable1725490309183 } from '../migrations/1725490309183-create_users_table';
import { CreateShoppingList1726315908950 } from '../migrations/1726315908950-create_shopping_list';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [User, ShoppingList],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [CreateUsersTable1725490309183, CreateShoppingList1726315908950],
});

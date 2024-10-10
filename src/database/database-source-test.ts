import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { ShoppingList } from '../shopping-list/entities/shopping-list.entity';

export const dataSourceTest: DataSourceOptions = {
  type: 'postgres',
  host: 'atomnyy-api-postgres-test',
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: 'atomnyyapitest',
  entities: [User, ShoppingList],
  synchronize: true,
};

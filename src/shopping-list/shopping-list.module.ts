import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShoppingListController } from './shopping-list.controller';
import { ShoppingList } from './entities/shopping-list.entity';
import { User } from '../users/entities/user.entity';

import { providers } from '../constants/providers';

import { TypeOrmShoppingListRepository } from './repositories/type-orm-shopping-list.repository';
import { TypeOrmUserRepository } from '../users/repositories/typeorm-user.repository';

import { CreateShoppingListUseCase } from './use-cases/create-shopping-list.use-case';
import { FindAllShoppingListsUseCase } from './use-cases/find-all-shopping-lists.use-case';
import { FindShoppingListByIdUseCase } from './use-cases/find-shopping-list-by-id.use-case';
import { RemoveShoppingListUseCase } from './use-cases/remove-shopping-list.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList, User])],
  controllers: [ShoppingListController],
  providers: [
    RemoveShoppingListUseCase,
    FindShoppingListByIdUseCase,
    FindAllShoppingListsUseCase,
    CreateShoppingListUseCase,
    TypeOrmShoppingListRepository,
    TypeOrmUserRepository,
    {
      provide: providers.shoppingLists,
      useExisting: TypeOrmShoppingListRepository,
    },
    {
      provide: providers.user,
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class ShoppingListModule {}

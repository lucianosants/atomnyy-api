import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

import {
  IFindAllShoppingLists,
  IShoppingListsRepository,
} from './shopping-lists.repository';
import { ShoppingList } from '../entities/shopping-list.entity';
import { User } from '../../users/entities/user.entity';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';

@Injectable()
export class InMemoryShoppingListRepository
  implements IShoppingListsRepository
{
  private shoppingLists: ShoppingList[] = [];

  public async findAll(
    userId: string,
    page: number,
  ): Promise<IFindAllShoppingLists | null> {
    const totalPerPage = 5;
    const userShoppingLists = this.shoppingLists.filter(
      (list) => list.user.id === userId,
    );
    const total = userShoppingLists.length;
    const totalPages = Math.ceil(total / totalPerPage);

    const paginatedLists = userShoppingLists.slice(
      (page - 1) * totalPerPage,
      page * totalPerPage,
    );

    return { total, totalPerPage, totalPages, shoppingLists: paginatedLists };
  }

  public async create(
    data: CreateShoppingListDto,
    user: User,
  ): Promise<ShoppingList> {
    const shoppingList: ShoppingList = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
      expires_at: data.expires_at,
      user,
    };

    this.shoppingLists.push(shoppingList);
    return shoppingList;
  }

  public async findById(id: string): Promise<ShoppingList | null> {
    const shoppingList = this.shoppingLists.find((list) => list.id === id);

    shoppingList.user = undefined;

    return shoppingList || null;
  }

  public async delete(shoppingList: ShoppingList): Promise<ShoppingList> {
    this.shoppingLists = this.shoppingLists.filter(
      (list) => list.id !== shoppingList.id,
    );

    return shoppingList;
  }

  public async rename(shoppingList: ShoppingList): Promise<ShoppingList> {
    const index = this.shoppingLists.findIndex(
      (list) => list.id === shoppingList.id,
    );

    if (index !== -1) {
      this.shoppingLists[index] = shoppingList;
    }

    return shoppingList;
  }
}

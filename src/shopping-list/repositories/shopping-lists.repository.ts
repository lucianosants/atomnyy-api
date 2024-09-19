import { User } from '../../users/entities/user.entity';

import { ShoppingList } from '../entities/shopping-list.entity';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';

export interface IFindAllShoppingLists {
  total: number;
  totalPages: number;
  totalPerPage: number;
  shoppingLists: ShoppingList[];
}

export interface IShoppingListsRepository {
  /**
   * @param userId an user id
   * @param page page number for pagination shopping lists
   */
  findAll(userId: string, page: number): Promise<IFindAllShoppingLists | null>;
  create(data: CreateShoppingListDto, user: User): Promise<ShoppingList>;
  findById(id: string): Promise<ShoppingList | null>;
  delete(shoppingList: ShoppingList): Promise<ShoppingList>;
}

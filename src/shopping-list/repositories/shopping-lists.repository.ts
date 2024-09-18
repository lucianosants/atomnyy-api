import { User } from '../../users/entities/user.entity';

import { ShoppingList } from '../entities/shopping-list.entity';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';

export interface IShoppingListsRepository {
  findAll(userId: string): Promise<ShoppingList[] | null>;
  create(data: CreateShoppingListDto, user: User): Promise<ShoppingList>;
  findById(id: string): Promise<ShoppingList | null>;
  delete(shoppingList: ShoppingList): Promise<ShoppingList>;
}

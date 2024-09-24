import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { providers } from '../../constants/providers';

import { User } from '../../users/entities/user.entity';
import { ShoppingList } from '../entities/shopping-list.entity';

import { IShoppingListsRepository } from '../repositories/shopping-lists.repository';
import { IUserRepository } from '../../users/repositories/user.repository';

import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { setExpirationDateShoppingList } from '../../utils/set-expiration-date-shopping-list';

export interface ICreateShoppingListUseCaseRequest
  extends CreateShoppingListDto {}

export interface ICreateShoppingListUseCaseResponse {
  shoppingList: ShoppingList;
}

@Injectable()
export class CreateShoppingListUseCase {
  constructor(
    @Inject(providers.shoppingLists)
    private readonly shoppingListsRepository: IShoppingListsRepository,

    @Inject(providers.user)
    private readonly userRepository: IUserRepository,
  ) {}
  public async execute(
    data: ICreateShoppingListUseCaseRequest,
  ): Promise<ICreateShoppingListUseCaseResponse> {
    try {
      const user = await this.preloadUser(data.userId);
      const { expires_at } = setExpirationDateShoppingList();

      const shoppingListAlreadyExists = user.shopping_lists.some(
        (item) => item.name === data.name,
      );

      if (shoppingListAlreadyExists) {
        throw new BadRequestException(`${data.name} already exist`);
      }

      const shoppingList = await this.shoppingListsRepository.create(
        {
          ...data,
          expires_at,
        },
        user,
      );

      shoppingList.user = undefined;

      return { shoppingList };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }

  private async preloadUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}

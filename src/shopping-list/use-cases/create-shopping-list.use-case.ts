import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { providers } from '../../constants/providers';

import { User } from '../../users/entities/user.entity';
import { ShoppingList } from '../entities/shopping-list.entity';

import { TypeOrmShoppingListRepository } from '../repositories/type-orm-shopping-list.repository';
import { TypeOrmUserRepository } from '../../users/repositories/typeorm-user.repository';

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
    private readonly shoppingListsRepository: TypeOrmShoppingListRepository,

    @Inject(providers.user)
    private readonly userRepository: TypeOrmUserRepository,
  ) {}
  public async execute(
    data: ICreateShoppingListUseCaseRequest,
  ): Promise<ICreateShoppingListUseCaseResponse> {
    const user = await this.preloadUser(data.userId);

    const { expires_at } = setExpirationDateShoppingList();

    const shoppingList = await this.shoppingListsRepository.create(
      {
        ...data,
        expires_at,
      },
      user,
    );

    shoppingList.user = undefined;

    return { shoppingList };
  }

  private async preloadUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}

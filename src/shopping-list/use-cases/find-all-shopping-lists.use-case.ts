import { providers } from 'src/constants/providers';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TypeOrmShoppingListRepository } from '../repositories/type-orm-shopping-list.repository';
import { TypeOrmUserRepository } from 'src/users/repositories/typeorm-user.repository';

import { IFindAllShoppingLists } from '../repositories/shopping-lists.repository';

export interface IFindAllShoppingListsUseCaseRequest {
  userId: string;
  page: number;
}

export interface IFindAllShoppingListsUseCaseResponse
  extends IFindAllShoppingLists {}

@Injectable()
export class FindAllShoppingListsUseCase {
  constructor(
    @Inject(providers.shoppingLists)
    private readonly shoppingListsRepository: TypeOrmShoppingListRepository,

    @Inject(providers.user)
    private readonly userRepository: TypeOrmUserRepository,
  ) {}

  public async execute(
    data: IFindAllShoppingListsUseCaseRequest,
  ): Promise<IFindAllShoppingListsUseCaseResponse> {
    try {
      await this.preloadUser(data.userId);

      const shoppingLists = await this.shoppingListsRepository.findAll(
        data.userId,
        data.page,
      );

      return { ...shoppingLists };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }

  private async preloadUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { providers } from '../../constants/providers';

import {
  IFindAllShoppingLists,
  IShoppingListsRepository,
} from '../repositories/shopping-lists.repository';
import { IUserRepository } from '../../users/repositories/user.repository';

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
    private readonly shoppingListsRepository: IShoppingListsRepository,

    @Inject(providers.user)
    private readonly userRepository: IUserRepository,
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

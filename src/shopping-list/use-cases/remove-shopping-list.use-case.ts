import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { providers } from '../../constants/providers';

import { TypeOrmShoppingListRepository } from '../repositories/type-orm-shopping-list.repository';

export interface IRemoveShoppingListUseCaseRequest {
  id: string;
}

export interface IRemoveShoppingListUseCaseResponse {
  message: string;
}

@Injectable()
export class RemoveShoppingListUseCase {
  constructor(
    @Inject(providers.shoppingLists)
    private readonly shoppingListsRepository: TypeOrmShoppingListRepository,
  ) {}

  public async execute(
    data: IRemoveShoppingListUseCaseRequest,
  ): Promise<IRemoveShoppingListUseCaseResponse> {
    try {
      const shoppingList = await this.shoppingListsRepository.findById(data.id);
      if (!shoppingList) {
        throw new NotFoundException('Shopping list not found');
      }

      await this.shoppingListsRepository.delete(shoppingList);

      return {
        message: 'Shopping list deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }
}

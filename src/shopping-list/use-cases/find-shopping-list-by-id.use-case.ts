import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { providers } from '../../constants/providers';

import { IShoppingListsRepository } from '../repositories/shopping-lists.repository';

import { ShoppingList } from '../entities/shopping-list.entity';

export interface IFindShoppingListByIdUseCaseRequest {
  id: string;
}

export interface IFindShoppingListByIdUseCaseResponse {
  shoppingList: ShoppingList;
}

@Injectable()
export class FindShoppingListByIdUseCase {
  constructor(
    @Inject(providers.shoppingLists)
    private readonly shoppingListsRepository: IShoppingListsRepository,
  ) {}

  public async execute(
    data: IFindShoppingListByIdUseCaseRequest,
  ): Promise<IFindShoppingListByIdUseCaseResponse> {
    try {
      const shoppingList = await this.shoppingListsRepository.findById(data.id);

      if (!shoppingList) {
        throw new NotFoundException('Shopping list not found');
      }

      return { shoppingList };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }
}

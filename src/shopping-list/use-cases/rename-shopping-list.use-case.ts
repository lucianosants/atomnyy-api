import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { providers } from '../../constants/providers';

import { TypeOrmShoppingListRepository } from '../repositories/type-orm-shopping-list.repository';
import { RenameShoppingListDto } from '../dto/rename-shopping-list.dto';

export interface IRenameShoppingListUseCaseRequest
  extends RenameShoppingListDto {
  id: string;
}

export interface IRenameShoppingListUseCaseResponse {
  message: string;
}

@Injectable()
export class RenameShoppingListUseCase {
  constructor(
    @Inject(providers.shoppingLists)
    private readonly shoppingListsRepository: TypeOrmShoppingListRepository,
  ) {}

  public async execute(
    data: IRenameShoppingListUseCaseRequest,
  ): Promise<IRenameShoppingListUseCaseResponse> {
    try {
      const shoppingList = await this.shoppingListsRepository.findById(data.id);

      if (!shoppingList) {
        throw new NotFoundException('Shopping list not found');
      }

      shoppingList.name = data.name;

      await this.shoppingListsRepository.rename(shoppingList);

      return {
        message: `Shopping list renamed to ${data.name} successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(error.message);
    }
  }
}

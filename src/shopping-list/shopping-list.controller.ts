import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { CreateShoppingListUseCase } from './use-cases/create-shopping-list.use-case';

import { CreateShoppingListDto } from './dto/create-shopping-list.dto';

import { bearer_key } from '../constants/swagger';

@Controller('shopping-list')
export class ShoppingListController {
  @Inject(CreateShoppingListUseCase)
  private readonly createShoppingListUseCase: CreateShoppingListUseCase;

  @ApiBearerAuth(bearer_key)
  @Post()
  create(@Body() createShoppingListDto: CreateShoppingListDto) {
    return this.createShoppingListUseCase.execute({
      ...createShoppingListDto,
    });
  }
}

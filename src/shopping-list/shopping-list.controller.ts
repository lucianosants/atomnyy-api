import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { bearer_key } from '../constants/swagger';

import { CreateShoppingListDto } from './dto/create-shopping-list.dto';

import { FindAllShoppingListsUseCase } from './use-cases/find-all-shopping-lists.use-case';
import { CreateShoppingListUseCase } from './use-cases/create-shopping-list.use-case';

@Controller('shopping-list')
export class ShoppingListController {
  @Inject(CreateShoppingListUseCase)
  private readonly createShoppingListUseCase: CreateShoppingListUseCase;

  @Inject(FindAllShoppingListsUseCase)
  private readonly findAllShoppingListsUseCase: FindAllShoppingListsUseCase;

  @ApiBearerAuth(bearer_key)
  @Post()
  create(@Body() createShoppingListDto: CreateShoppingListDto) {
    return this.createShoppingListUseCase.execute({
      ...createShoppingListDto,
    });
  }

  @ApiBearerAuth(bearer_key)
  @Get(':id')
  findAll(@Param('id') id: string, @Query('page') page: number) {
    return this.findAllShoppingListsUseCase.execute({
      userId: id,
      page: page || 1,
    });
  }
}

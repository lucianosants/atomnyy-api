import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { bearer_key } from '../constants/swagger';

import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { RenameShoppingListDto } from './dto/rename-shopping-list.dto';

import { FindAllShoppingListsUseCase } from './use-cases/find-all-shopping-lists.use-case';
import { CreateShoppingListUseCase } from './use-cases/create-shopping-list.use-case';
import { FindShoppingListByIdUseCase } from './use-cases/find-shopping-list-by-id.use-case';
import { RemoveShoppingListUseCase } from './use-cases/remove-shopping-list.use-case';
import { RenameShoppingListUseCase } from './use-cases/rename-shopping-list.use-case';

@ApiBearerAuth(bearer_key)
@Controller('shopping-list')
export class ShoppingListController {
  @Inject(CreateShoppingListUseCase)
  private readonly createShoppingListUseCase: CreateShoppingListUseCase;

  @Inject(FindAllShoppingListsUseCase)
  private readonly findAllShoppingListsUseCase: FindAllShoppingListsUseCase;

  @Inject(FindShoppingListByIdUseCase)
  private readonly findShoppingListByIdUseCase: FindShoppingListByIdUseCase;

  @Inject(RemoveShoppingListUseCase)
  private readonly removeShoppingListUseCase: RemoveShoppingListUseCase;

  @Inject(RenameShoppingListUseCase)
  private readonly renameShoppingListUseCase: RenameShoppingListUseCase;

  @Post()
  create(@Body() createShoppingListDto: CreateShoppingListDto) {
    return this.createShoppingListUseCase.execute({
      ...createShoppingListDto,
    });
  }

  @Get('user/:userId')
  findAll(@Param('userId') userId: string, @Query('page') page: number) {
    return this.findAllShoppingListsUseCase.execute({
      userId,
      page: page || 1,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.findShoppingListByIdUseCase.execute({ id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeShoppingListUseCase.execute({ id });
  }

  @Patch(':id')
  rename(
    @Param('id') id: string,
    @Body() renameShoppingListDto: RenameShoppingListDto,
  ) {
    return this.renameShoppingListUseCase.execute({
      id,
      name: renameShoppingListDto.name,
    });
  }
}

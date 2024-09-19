import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IFindAllShoppingLists,
  IShoppingListsRepository,
} from './shopping-lists.repository';

import { ShoppingList } from '../entities/shopping-list.entity';
import { User } from '../../users/entities/user.entity';

import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';

@Injectable()
export class TypeOrmShoppingListRepository implements IShoppingListsRepository {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
  ) {}

  public async findAll(
    userId: string,
    page: number,
  ): Promise<IFindAllShoppingLists | null> {
    const totalPerPage = 5;
    const [shoppingLists, total] =
      await this.shoppingListRepository.findAndCount({
        where: { user: { id: userId } },
        order: { created_at: 'DESC' },
        take: totalPerPage,
        skip: (page - 1) * 5,
      });

    const totalPages = Math.ceil(total / totalPerPage);

    return { total, totalPerPage, totalPages, shoppingLists };
  }

  public async create(
    data: CreateShoppingListDto,
    user: User,
  ): Promise<ShoppingList> {
    const shoppingList = this.shoppingListRepository.create({
      ...data,
      user,
    });

    return await this.shoppingListRepository.save(shoppingList);
  }

  public async findById(id: string): Promise<ShoppingList | null> {
    const shoppingList = await this.shoppingListRepository.findOne({
      where: { id },
    });

    return shoppingList;
  }

  public async delete(shoppingList: ShoppingList): Promise<ShoppingList> {
    await this.shoppingListRepository.remove(shoppingList);

    return shoppingList;
  }

  public async rename(shoppingList: ShoppingList): Promise<ShoppingList> {
    await this.shoppingListRepository.save(shoppingList);

    return shoppingList;
  }
}

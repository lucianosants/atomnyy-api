import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IShoppingListsRepository } from './shopping-lists.repository';

import { ShoppingList } from '../entities/shopping-list.entity';
import { User } from '../../users/entities/user.entity';

import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';

@Injectable()
export class TypeOrmShoppingListRepository implements IShoppingListsRepository {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
  ) {}

  public async findAll(userId: string): Promise<ShoppingList[] | null> {
    const shoppingLists = await this.shoppingListRepository.find({
      relations: {
        user: true,
      },
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      select: {
        user: { id: true, name: true },
      },
    });

    return shoppingLists;
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
}

import { BadRequestException } from '@nestjs/common';

import { InMemoryUserRepository } from '../../users/repositories/in-memory-user-repository';
import { InMemoryShoppingListRepository } from '../repositories/in-memory-shopping-lists.repository';

import { setExpirationDateShoppingList } from '../../utils/set-expiration-date-shopping-list';
import { FindShoppingListByIdUseCase } from './find-shopping-list-by-id.use-case';

describe('Find Shopping List by Id(Use Case)', () => {
  let shoppingListsRepository: InMemoryShoppingListRepository;
  let userRepository: InMemoryUserRepository;
  let sut: FindShoppingListByIdUseCase;

  beforeEach(() => {
    shoppingListsRepository = new InMemoryShoppingListRepository();
    userRepository = new InMemoryUserRepository();

    sut = new FindShoppingListByIdUseCase(shoppingListsRepository);
  });

  it('should be return a shopping list successfully', async () => {
    const { expires_at } = setExpirationDateShoppingList();

    const user = await userRepository.create({
      name: 'John',
      email: 'johndoe@example.com',
      last_name: 'Doe',
      cellphone: '5589912345678',
      password_hash: 'password123',
    });

    const { id } = await shoppingListsRepository.create(
      {
        name: 'Lista de compras 1',
        total_price: 0,
        userId: user.id,
        expires_at,
      },
      user,
    );

    const { shoppingList } = await sut.execute({ id });

    expect(shoppingList.name).toEqual('Lista de compras 1');
    expect(shoppingList.total_price).toEqual(0);
    expect(shoppingList.user).toBeUndefined();
  });

  it('should throw an error if non-exists shopping list', async () => {
    await expect(
      sut.execute({
        id: 'invalid_shopping_list_id',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

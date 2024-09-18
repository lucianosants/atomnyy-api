import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateShoppingListName1726662957025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'shopping_lists',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('shopping_lists', 'name');
  }
}

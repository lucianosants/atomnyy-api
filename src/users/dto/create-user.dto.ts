import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Your first name',
    default: 'John',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Your last name',
    default: 'Doe',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'Your email address',
    default: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Your password',
    default: 'password123',
  })
  @IsString()
  password_hash: string;

  @ApiProperty({
    description: 'Your cellphone number',
    default: '5589912345678',
  })
  @IsString()
  cellphone: string;
}

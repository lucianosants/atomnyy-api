import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'Your email address',
    default: 'john.doe@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Your password',
    default: 'password123',
  })
  @IsString()
  password_hash: string;
}

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name of the tenant',
    required: true,
    example: 'Microsoft Sales Team',
  })
  name?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class addTenantDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;
}

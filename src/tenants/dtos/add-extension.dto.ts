import { IsString, IsOptional } from 'class-validator';

export class addExtensionDto {
  @IsString()
  tech: string;

  @IsString()
  tenantId: string;

  @IsString()
  sipTechnology: string;

  @IsOptional()
  @IsString()
  description?: string;
}

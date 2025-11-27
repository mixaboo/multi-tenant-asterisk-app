import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTenantDto } from '@app/tenants/dtos/add-tenant.dto';
import { CreateExtensionDto } from '@app/tenants/dtos/add-extension.dto';

@ApiTags('Tenants')
@Controller('tenant')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  createTenant(@Body() body: CreateTenantDto) {
    return this.tenantsService.createTenant(body);
  }

  @Post(':id/extension')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Tenant ID (auto-increment from DB)',
    example: 1,
  })
  @ApiBody({ type: CreateExtensionDto })
  createExtension(
    @Param('id', ParseIntPipe) tenantId: number,
    @Body() body: CreateExtensionDto,
  ) {
    return this.tenantsService.createExtension(tenantId, body);
  }

  @Get(':id/extensions')
  listExtensions(@Param('id', ParseIntPipe) tenantId: number) {
    return this.tenantsService.listExtensions(tenantId);
  }
}

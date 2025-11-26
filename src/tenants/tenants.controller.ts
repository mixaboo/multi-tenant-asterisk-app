import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenant')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  createTenant(@Body() body: any) {
    return this.tenantsService.createTenant(body);
  }

  @Post(':id/extension')
  createExtension(@Param('id') tenantId: string, @Body() body: any) {
    return this.tenantsService.createExtension(tenantId, body);
  }

  @Get(':id/extensions')
  listExtensions(@Param('id') tenantId: string) {
    return this.tenantsService.listExtensions(tenantId);
  }
}

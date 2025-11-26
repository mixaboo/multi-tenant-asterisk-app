import { Injectable } from '@nestjs/common';
import { addTenantDto } from '@app/tenants/dtos/add-tenant.dto';
import { addExtensionDto } from '@app/tenants/dtos/add-extension.dto';

@Injectable()
export class TenantsService {
  createTenant(dto: addTenantDto): addTenantDto {
    return dto;
  }

  createExtension(tenantId: string, dto: addExtensionDto): addExtensionDto {
    console.log(tenantId);
    return dto;
  }

  listExtensions(tenantId: string) {
    console.log(tenantId);
    return null;
  }
}

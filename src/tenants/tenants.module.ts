import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant } from '@app/entities/tenant.entity';
import { PsAuth } from '@app/entities/ps-auth.entity';
import { PsAor } from '@app/entities/ps-aor.entity';
import { PsEndpoint } from '@app/entities/ps-endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, PsAuth, PsAor, PsEndpoint])],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}

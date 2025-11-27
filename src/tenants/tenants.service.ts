import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTenantDto } from '@app/tenants/dtos/add-tenant.dto';
import { CreateExtensionDto } from '@app/tenants/dtos/add-extension.dto';
import { Tenant } from '@app/entities/tenant.entity';
import { PsAuth } from '@app/entities/ps-auth.entity';
import { PsAor } from '@app/entities/ps-aor.entity';
import { PsEndpoint } from '@app/entities/ps-endpoint.entity';

@Injectable()
export class TenantsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    @InjectRepository(PsAuth)
    private readonly authRepository: Repository<PsAuth>,
    @InjectRepository(PsAor) private readonly aorRepository: Repository<PsAor>,
    @InjectRepository(PsEndpoint)
    private readonly endpointRepository: Repository<PsEndpoint>,
  ) {}

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const entity = this.tenantsRepository.create({
      tenantName: dto.name ?? undefined,
      createdAt: new Date(),
    });
    return await this.tenantsRepository.save(entity);
  }

  async createExtension(
    tenantId: number,
    dto: CreateExtensionDto,
  ): Promise<{ auth: PsAuth; aor: PsAor; endpoint: PsEndpoint }> {
    const ext = dto.number;
    const authId = `${ext}-auth`;

    return await this.dataSource.transaction(async (manager) => {
      const auth = manager.getRepository(PsAuth).create({
        id: authId,
        username: ext,
        password: dto.password,
        tenantId,
      });
      await manager.getRepository(PsAuth).save(auth);

      const aor = manager.getRepository(PsAor).create({
        id: ext,
        maxContacts: dto.maxContacts ?? 1,
        removeExisting: dto.removeExisting ?? true,
        tenantId,
      });
      await manager.getRepository(PsAor).save(aor);

      const endpoint = manager.getRepository(PsEndpoint).create({
        id: ext,
        transport: dto.transport ?? 'transport-udp',
        aors: ext,
        auth: authId,
        context: `from-tenant${tenantId}`,
        disallow: dto.disallow ?? 'all',
        allow: dto.allow ?? 'ulaw,alaw',
        tenantId,
      });
      await manager.getRepository(PsEndpoint).save(endpoint);

      return { auth, aor, endpoint };
    });
  }

  async listExtensions(tenantId: number): Promise<PsEndpoint[]> {
    return this.endpointRepository.find({ where: { tenantId } });
  }
}

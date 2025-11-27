import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTenantDto } from '@app/tenants/dtos/add-tenant.dto';
import { CreateExtensionDto } from '@app/tenants/dtos/add-extension.dto';
import { Tenant } from '@app/entities/tenant.entity';
import { PsAuth } from '@app/entities/ps-auth.entity';
import { PsAor } from '@app/entities/ps-aor.entity';
import { PsEndpoint } from '@app/entities/ps-endpoint.entity';
import { Extension } from '@app/entities/extension.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TenantsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    //@InjectRepository(PsAuth)
    //private readonly authRepository: Repository<PsAuth>,
    //@InjectRepository(PsAor)
    //private readonly aorRepository: Repository<PsAor>,
    @InjectRepository(PsEndpoint)
    private readonly endpointRepository: Repository<PsEndpoint>,
  ) {}

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const tenantExist = await this.tenantsRepository.findOneBy({
      tenantName: dto.name,
    });
    if (tenantExist)
      throw new BadRequestException(`Tenant "${dto.name}" already exists`);

    return await this.dataSource.transaction(async (manager) => {
      const newTenant = manager.getRepository(Tenant).create({
        tenantName: dto.name ?? undefined,
        createdAt: new Date(),
      });
      const savedTenant = await manager.getRepository(Tenant).save(newTenant);

      // work with JSON template
      const templatePath = process.env.DIALPLAN_TEMPLATE_PATH
        ? path.resolve(process.cwd(), process.env.DIALPLAN_TEMPLATE_PATH)
        : path.resolve(process.cwd(), 'src/dialplan/extensions-template.json');

      let rows: Array<{
        context: string;
        exten: string;
        priority: number;
        app: string;
        appdata?: string | null;
      }> = [];
      try {
        const raw = fs.readFileSync(templatePath, 'utf8');
        const parsed = JSON.parse(raw) as typeof rows;
        const replace = (s: string) =>
          s
            .replaceAll('<tenant_id>', String(savedTenant.tenantId))
            .replaceAll('<tenant_name>', savedTenant.tenantName ?? '');
        rows = parsed.map((r) => ({
          context: replace(r.context),
          exten: replace(r.exten),
          priority: r.priority,
          app: replace(r.app),
          appdata:
            r.appdata === undefined || r.appdata === null
              ? null
              : replace(r.appdata),
        }));
      } catch (e) {
        throw new BadRequestException(
          `Failed to load dialplan template at ${templatePath}: ${(e as Error).message}`,
        );
      }

      if (rows.length > 0) {
        const extRepo = manager.getRepository(Extension);
        // Avoid duplicates just in case: delete existing rows for this context first
        const context = `from-tenant${savedTenant.tenantId}`;
        await extRepo.delete({ context });
        await extRepo.save(rows.map((r) => extRepo.create(r)));
      }

      return savedTenant;
    });
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

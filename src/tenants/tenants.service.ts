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
import { Queue } from '@app/entities/queue.entity';
import { QueueMember } from '@app/entities/queue-member.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TenantsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
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
        const context = `from-tenant${savedTenant.tenantId}`;
        await extRepo.delete({ context });
        await extRepo.save(rows.map((r) => extRepo.create(r)));
      }

      // Create a default queue for this tenant
      const queueRepo = manager.getRepository(Queue);
      const queue = queueRepo.create({
        name: `main-tenant${savedTenant.tenantId}`,
        strategy: 'ringall',
        timeout: 15,
        retry: 5,
        wrapuptime: 0,
        maxlen: 0,
        announce: null,
        context: `from-tenant${savedTenant.tenantId}`,
        musiconhold: 'default',
      });
      await queueRepo.save(queue);

      return savedTenant;
    });
  }

  async createExtension(
    tenantId: number,
    dto: CreateExtensionDto,
  ): Promise<{ auth: PsAuth; aor: PsAor; endpoint: PsEndpoint }> {
    const ext = dto.number;

    return await this.dataSource.transaction(async (manager) => {
      // Validate global uniqueness of extension number (system-wide, across tenants)
      const existing = await manager
        .getRepository(PsEndpoint)
        .findOne({ where: { id: `${ext}-tenant${tenantId}` } });
      if (existing) {
        throw new BadRequestException(
          `Extension number "${ext}" already exists for the ${tenantId}`,
        );
      }

      const auth = manager.getRepository(PsAuth).create({
        id: `${ext}-auth-tenant${tenantId}`,
        username: `${ext}-tenant${tenantId}`,
        password: dto.password,
        tenantId,
      });
      await manager.getRepository(PsAuth).save(auth);

      const aor = manager.getRepository(PsAor).create({
        id: `${ext}-tenant${tenantId}`,
        maxContacts: dto.maxContacts ?? 1,
        removeExisting: dto.removeExisting ?? true,
        tenantId,
      });
      await manager.getRepository(PsAor).save(aor);

      const endpoint = manager.getRepository(PsEndpoint).create({
        id: `${ext}-tenant${tenantId}`,
        transport: dto.transport ?? 'transport-udp',
        aors: `${ext}-tenant${tenantId}`,
        auth: `${ext}-auth-tenant${tenantId}`,
        context: `from-tenant${tenantId}`,
        disallow: dto.disallow ?? 'all',
        allow: dto.allow ?? 'ulaw,alaw',
        tenantId,
      });
      await manager.getRepository(PsEndpoint).save(endpoint);

      const queueName = `main-tenant${tenantId}`;
      const iface = `PJSIP/${ext}-tenant${tenantId}`;
      const membername = `${ext}-tenant${tenantId}`;

      const qmRepo = manager.getRepository(QueueMember);
      const exists = await qmRepo.findOne({
        where: { queueName, interface: iface },
      });
      if (!exists) {
        const qm = qmRepo.create({
          queueName,
          interface: iface,
          memberName: membername,
          penalty: 0,
          paused: 0,
        });
        await qmRepo.save(qm);
      }
      return { auth, aor, endpoint };
    });
  }

  async listExtensions(tenantId: number): Promise<PsEndpoint[]> {
    return this.endpointRepository.find({ where: { tenantId } });
  }
}

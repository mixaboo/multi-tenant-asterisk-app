import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'ps_endpoints' })
@Index(['tenantId'])
export class PsEndpoint {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id!: string; // e.g., '201'

  @Column({ type: 'varchar', length: 191 })
  transport!: string; // e.g., 'transport-udp'

  @Column({ type: 'varchar', length: 191 })
  aors!: string; // same as extension id

  @Column({ type: 'varchar', length: 191 })
  auth!: string; // e.g., '201-auth'

  @Column({ type: 'varchar', length: 191 })
  context!: string; // e.g., 'from-tenant2'

  @Column({ type: 'varchar', length: 191, default: 'all' })
  disallow!: string;

  @Column({ type: 'varchar', length: 191, default: 'ulaw,alaw' })
  allow!: string;

  @Column({ name: 'tenant_id', type: 'int' })
  tenantId!: number;
}

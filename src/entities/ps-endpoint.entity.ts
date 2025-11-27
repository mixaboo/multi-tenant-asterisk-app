import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'ps_endpoints' })
@Index(['tenantId'])
export class PsEndpoint {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id!: string;

  @Column({ type: 'varchar', length: 191 })
  transport!: string; //'transport-udp'

  @Column({ type: 'varchar', length: 191 })
  aors!: string;

  @Column({ type: 'varchar', length: 191 })
  auth!: string;

  @Column({ type: 'varchar', length: 191 })
  context!: string;

  @Column({ type: 'varchar', length: 191, default: 'all' })
  disallow!: string;

  @Column({ type: 'varchar', length: 191, default: 'ulaw,alaw' })
  allow!: string;

  @Column({ name: 'tenant_id', type: 'int' })
  tenantId!: number;
}

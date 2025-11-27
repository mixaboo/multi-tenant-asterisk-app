import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'ps_auths' })
@Index(['tenantId'])
export class PsAuth {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id!: string; // e.g., '201-auth'

  @Column({ type: 'varchar', length: 191 })
  username!: string; // e.g., '201'

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ name: 'tenant_id', type: 'int' })
  tenantId!: number;
}

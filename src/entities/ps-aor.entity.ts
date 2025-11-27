import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'ps_aors' })
@Index(['tenantId'])
export class PsAor {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id!: string; // e.g., '201'

  @Column({ name: 'max_contacts', type: 'int', default: 1 })
  maxContacts!: number;

  @Column({ name: 'remove_existing', type: 'boolean', default: true })
  removeExisting!: boolean;

  @Column({ name: 'tenant_id', type: 'int' })
  tenantId!: number;
}

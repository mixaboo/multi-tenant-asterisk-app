import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn({ name: 'tenant_id', type: 'int' })
  tenantId!: number;

  @Column({ name: 'tenant_name', type: 'varchar', length: 50, nullable: true })
  tenantName!: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}

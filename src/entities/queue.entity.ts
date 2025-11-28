import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'queues' })
export class Queue {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  name!: string; // main-tenant<tenant_id>

  @Column({ type: 'varchar', length: 50 })
  strategy!: string; // ringall, rrmemory.....

  @Column({ type: 'int' })
  timeout!: number;

  @Column({ type: 'int' })
  retry!: number;

  @Column({ type: 'int' })
  wrapuptime!: number;

  @Column({ type: 'int' })
  maxlen!: number;

  @Column({ type: 'text', nullable: true })
  announce!: string | null;

  @Column({ type: 'varchar', length: 100 })
  context!: string; // from-tenant<tenant_id>

  @Column({ type: 'varchar', length: 50 })
  musiconhold!: string;
}

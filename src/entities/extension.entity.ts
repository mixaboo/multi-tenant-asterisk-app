import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'extensions' })
@Index(['context', 'exten'])
export class Extension {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  context!: string;

  @PrimaryColumn({ type: 'varchar', length: 80 })
  exten!: string;

  @PrimaryColumn({ type: 'int' })
  priority!: number;

  @Column({ type: 'varchar', length: 80 })
  app!: string;

  @Column({ type: 'text', nullable: true })
  appdata!: string | null;
}

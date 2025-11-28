import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@Entity({ name: 'queue_members' })
@Index(['queueName'])
export class QueueMember {
  @PrimaryColumn({ name: 'queue_name', type: 'varchar', length: 50 })
  queueName!: string;

  @PrimaryColumn({ name: 'interface', type: 'varchar', length: 100 })
  interface!: string;

  @Column({ name: 'membername', type: 'varchar', length: 100 })
  memberName!: string;

  @Column({ type: 'int', default: 0 })
  penalty!: number;

  @Column({ type: 'tinyint', default: 0 })
  paused!: number;
}

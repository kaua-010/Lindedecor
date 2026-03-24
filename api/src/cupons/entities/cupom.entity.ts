import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('cupons')
export class Cupom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column({ default: 'percentual' })
  tipo: 'percentual' | 'valor';

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  minimoCompra: number;

  @Column({ default: 999 })
  usosMax: number;

  @Column({ default: 0 })
  usos: number;

  @Column({ type: 'date', nullable: true })
  validoDe: Date;

  @Column({ type: 'date', nullable: true })
  validoAte: Date;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}

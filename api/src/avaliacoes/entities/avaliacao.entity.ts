import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  produtoId: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column({ default: 5 })
  nota: number;

  @Column('text', { nullable: true })
  texto: string;

  @Column({ default: false })
  aprovado: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}

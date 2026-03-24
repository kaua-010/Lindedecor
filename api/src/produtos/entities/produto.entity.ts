import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precoOriginal: number;

  @Column()
  categoria: string;

  @Column({ default: '✨' })
  emoji: string;

  @Column({ nullable: true })
  imagem: string;

  @Column({ default: 10 })
  estoque: number;

  @Column({ default: 0 })
  vendas: number;

  @Column({ nullable: true })
  badge: string;

  @Column({ nullable: true })
  colecao: string;

  @Column({ default: false })
  kitCombo: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}

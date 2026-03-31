import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  nomeCliente: string;

  @Column()
  emailCliente: string;

  @Column({ nullable: true })
  telefoneCliente: string;

  @ManyToOne(() => User, (u) => u.pedidos, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('jsonb')
  itens: { id: string; nome: string; qty: number; preco: number; emoji?: string }[];

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  frete: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  desconto: number;

  @Column({ nullable: true })
  cupom: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pendente' })
  status: 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado';

  @Column({ nullable: true })
  codigoRastreio: string;

  @Column({ nullable: true })
  transportadora: string;

  @Column('text', { nullable: true })
  enderecoEntrega: string;

  @Column({ nullable: true })
  notas: string;
  @Column({ nullable: true })
  stripeSessionId: string;

  @Column({ nullable: true })
  stripePaymentId: string;
  @CreateDateColumn()
  criadoEm: Date;
}

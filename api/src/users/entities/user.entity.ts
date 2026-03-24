import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { Endereco } from './endereco.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
  telefone: string;

  @CreateDateColumn()
  criadoEm: Date;

  @OneToMany(() => Pedido, (p) => p.user)
  pedidos: Pedido[];

  @OneToMany(() => Endereco, (e) => e.user)
  enderecos: Endereco[];
}

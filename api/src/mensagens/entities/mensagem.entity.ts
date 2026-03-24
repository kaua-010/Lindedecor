import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('mensagens')
export class Mensagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  assunto: string;

  @Column('text')
  mensagem: string;

  @Column({ default: 'contato' })
  tipo: 'contato' | 'feedback' | 'sugestao';

  @Column({ default: false })
  lida: boolean;

  @CreateDateColumn()
  criadoEm: Date;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { CuponsModule } from './cupons/cupons.module';
import { MensagensModule } from './mensagens/mensagens.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SheetsModule } from './sheets/sheets.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'linedecor',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    ProdutosModule,
    PedidosModule,
    CuponsModule,
    MensagensModule,
    AvaliacoesModule,
    ChatModule,
    NotificationsModule,
    SheetsModule,
    NewsletterModule,
  ],
})
export class AppModule {}

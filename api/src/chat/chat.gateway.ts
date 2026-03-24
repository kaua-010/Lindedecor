import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clientes = new Map<string, { nome?: string }>();

  handleConnection(client: any) {
    this.clientes.set(client.id, {});
  }

  handleDisconnect(client: any) {
    this.clientes.delete(client.id);
  }

  @SubscribeMessage('mensagem')
  handleMensagem(client: any, payload: { texto: string; nome?: string }) {
    this.clientes.set(client.id, { nome: payload.nome || 'Anônimo' });
    this.server.emit('mensagem', {
      id: client.id,
      texto: payload.texto,
      nome: payload.nome || 'Cliente',
      data: new Date().toISOString(),
    });
  }

  // Admin envia resposta
  @SubscribeMessage('admin_resposta')
  handleAdminResposta(client: any, payload: { texto: string; para?: string }) {
    if (payload.para) {
      this.server.to(payload.para).emit('resposta', { texto: payload.texto });
    } else {
      this.server.emit('resposta', { texto: payload.texto });
    }
  }
}

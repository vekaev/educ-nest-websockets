import { Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

@WebSocketGateway(3001, {
  path: '/websockets',
  serveClient: true,
  namespaces: '/',
})
export class TestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client ${client.id} - disconnected`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client ${client.id} - connected`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('msgToClient', text);
    // : WsResponse<string>
    // return { event: 'msgToClient', data: text };WsResponse<string>
  }
}

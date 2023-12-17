import { v4 as uuidv4 } from 'uuid';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/general/date-vo';

export class RemovePlayerCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  constructor(id: string, timestamp: number, playerId: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
  }

  static new(playerId: string) {
    return new RemovePlayerCommand(uuidv4(), DateVo.now().getTimestamp(), playerId);
  }

  static load(id: string, timestamp: number, playerId: string) {
    return new RemovePlayerCommand(id, timestamp, playerId);
  }

  public execute({ playerManager }: CommandParams): void {
    playerManager.removePlayer(this.playerId);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }
}
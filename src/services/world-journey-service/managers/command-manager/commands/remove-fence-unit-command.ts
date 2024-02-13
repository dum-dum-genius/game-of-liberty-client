import { PositionVo } from '@/models/world/common/position-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemoveFenceUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionVo;

  constructor(id: string, timestamp: number, position: PositionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionVo) {
    return new RemoveFenceUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionVo) {
    return new RemoveFenceUnitCommand(id, timestamp, position);
  }

  public execute({ unitManager }: CommandParams): void {
    unitManager.removeUnit(this.position);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPosition() {
    return this.position;
  }
}
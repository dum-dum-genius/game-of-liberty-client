import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemoveFenceUnitCommand extends BaseCommand {
  private unitId: string;

  constructor(id: string, timestamp: number, unitId: string) {
    super(id, timestamp);
    this.unitId = unitId;
  }

  static new(unitId: string) {
    return new RemoveFenceUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unitId);
  }

  static load(id: string, timestamp: number, unitId: string) {
    return new RemoveFenceUnitCommand(id, timestamp, unitId);
  }

  public execute({ unitManager }: CommandParams): void {
    unitManager.removeUnit(this.unitId);
  }

  public getUnitId() {
    return this.unitId;
  }
}

import LocationVo from './LocationVo';
import SizeVo from './SizeVo';
import OffsetVo from './OffsetVo';

export default class BoundVo {
  private from: LocationVo;

  private to: LocationVo;

  constructor(from: LocationVo, to: LocationVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: LocationVo, to: LocationVo): BoundVo {
    return new BoundVo(from, to);
  }

  public isEqual(bound: BoundVo): Boolean {
    return this.from.isEqual(bound.getFrom()) && this.to.isEqual(bound.getTo());
  }

  public getSize(): SizeVo {
    return SizeVo.new(this.to.getX() - this.from.getX() + 1, this.to.getY() - this.from.getY() + 1);
  }

  public getFrom(): LocationVo {
    return this.from;
  }

  public getTo(): LocationVo {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getHeight(): number {
    return this.to.getY() - this.from.getY() + 1;
  }

  public getCenter(): LocationVo {
    const centerX = Math.floor((this.from.getX() + this.to.getX()) / 2);
    const centerY = Math.floor((this.from.getY() + this.to.getY()) / 2);
    return LocationVo.new(centerX, centerY);
  }

  private coversLocation(globalLocation: LocationVo): boolean {
    const x = globalLocation.getX();
    const y = globalLocation.getY();
    return this.from.getX() <= x && this.to.getX() >= x && this.from.getY() <= y && this.to.getY() >= y;
  }

  public calculateLocationInBound(globalLocation: LocationVo): LocationVo | null {
    if (!this.coversLocation(globalLocation)) {
      return null;
    }

    return globalLocation.getRelativeLocation(this.from);
  }

  public calculateOffsetWithBound(boundB: BoundVo): OffsetVo {
    return OffsetVo.new(this.from.getX() - boundB.getFrom().getX(), this.from.getY() - boundB.getFrom().getY());
  }
}
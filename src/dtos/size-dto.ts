import { SizeModel } from '@/models/world/size-model';

type SizeDto = {
  width: number;
  height: number;
};

function parseSizeDto(sizeDto: SizeDto): SizeModel {
  return SizeModel.new(sizeDto.width, sizeDto.height);
}

export type { SizeDto };
export { parseSizeDto };

import { Axios } from 'axios';
import { WorldMemberDto, convertWorldMemberDtoToWorldMember } from '@/dtos';
import { AxiosProvider } from '@/providers/axios-provider';
import { WorldMemberModel } from '@/models/world-member-model';

export class WorldMemberApiService {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/worlds`);
  }

  static new(): WorldMemberApiService {
    return new WorldMemberApiService();
  }

  async getWorldMembers(worldId: string): Promise<WorldMemberModel[]> {
    const { data } = await this.axios.get<WorldMemberDto[]>(`/${worldId}/members`);
    return data.map(convertWorldMemberDtoToWorldMember);
  }
}

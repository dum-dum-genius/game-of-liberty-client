import { PlayerDto, PositionDto, newPositionDto, parsePlayerDto } from '@/apis/dtos';
import {
  Command,
  AddPlayerCommand,
  CreateStaticUnitCommand,
  RemoveStaticUnitCommand,
  CreatePortalUnitCommand,
  RemovePortalUnitCommand,
  MovePlayerCommand,
  SendPlayerIntoPortalCommand,
  RemovePlayerCommand,
  RotateUnitCommand,
  ChangePlayerHeldItemCommand,
} from '@/logics/world-journey/commands';
import { DirectionModel } from '@/models/world/common/direction-model';
import { PositionModel } from '@/models/world/common/position-model';

enum CommandNameEnum {
  Ping = 'PING',
  DisplayError = 'DISPLAY_ERROR',
  AddPlayer = 'ADD_PLAYER',
  RemovePlayer = 'REMOVE_PLAYER',
  MovePlayer = 'MOVE_PLAYER',
  SendPlayerIntoPortal = 'SEND_PLAYER_INTO_PORTAL',
  ChangePlayerHeldItem = 'CHANGE_PLAYER_HELD_ITEM',
  CreateStaticUnit = 'CREATE_STATIC_UNIT',
  RemoveStaticUnit = 'REMOVE_STATIC_UNIT',
  CreatePortalUnit = 'CREATE_PORTAL_UNIT',
  RemovePortalUnit = 'REMOVE_PORTAL_UNIT',
  RotateUnit = 'ROTATE_UNIT',
}

export type PingCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.Ping;
};

type AddPlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.AddPlayer;
  player: PlayerDto;
};

type MovePlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.MovePlayer;
  playerId: string;
  position: PositionDto;
  direction: number;
};

type SendPlayerIntoPortalCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.SendPlayerIntoPortal;
  playerId: string;
  position: PositionDto;
};

type RemovePlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePlayer;
  playerId: string;
};

type ChangePlayerHeldItemCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerHeldItem;
  playerId: string;
  itemId: string;
};

type CreateStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateStaticUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveStaticUnit;
  position: PositionDto;
};

type CreatePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreatePortalUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemovePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePortalUnit;
  position: PositionDto;
};

type RotateUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RotateUnit;
  position: PositionDto;
};

function parseCreateStaticCommandDto(command: CreateStaticUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseRemoveStaticUnitCommand(command: RemoveStaticUnitCommandDto): RemoveStaticUnitCommand {
  return RemoveStaticUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreatePortalUnitCommand {
  return CreatePortalUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseRemovePortalUnitCommand(command: RemovePortalUnitCommandDto): RemovePortalUnitCommand {
  return RemovePortalUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseAddPlayerAddPlayerCommand(command: AddPlayerCommandDto): AddPlayerCommand {
  return AddPlayerCommand.load(command.id, command.timestamp, parsePlayerDto(command.player));
}

function parseMovePlayerCommand(command: MovePlayerCommandDto): MovePlayerCommand {
  return MovePlayerCommand.load(
    command.id,
    command.timestamp,
    command.playerId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}
function parseSendPlayerIntoPortalCommand(command: SendPlayerIntoPortalCommandDto): SendPlayerIntoPortalCommand {
  return SendPlayerIntoPortalCommand.load(
    command.id,
    command.timestamp,
    command.playerId,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseChangeChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.load(command.id, command.timestamp, command.playerId, command.itemId);
}

function parseRemoveRemovePlayerCommand(command: RemovePlayerCommandDto): RemovePlayerCommand {
  return RemovePlayerCommand.load(command.id, command.timestamp, command.playerId);
}

export const parseCommandDto = (commandDto: CommandDto) => {
  if (commandDto.name === CommandNameEnum.CreateStaticUnit) {
    return parseCreateStaticCommandDto(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemoveStaticUnit) {
    return parseRemoveStaticUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.CreatePortalUnit) {
    return parseCreatePortalUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemovePortalUnit) {
    return parseRemovePortalUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RotateUnit) {
    return parseRotateUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.AddPlayer) {
    return parseAddPlayerAddPlayerCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.MovePlayer) {
    return parseMovePlayerCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.SendPlayerIntoPortal) {
    return parseSendPlayerIntoPortalCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerHeldItem) {
    return parseChangeChangePlayerHeldItemCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemovePlayer) {
    return parseRemoveRemovePlayerCommand(commandDto);
  }
  return null;
};

export const toCommandDto = (command: Command) => {
  if (command instanceof CreateStaticUnitCommand) {
    const commandDto: CreateStaticUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateStaticUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    return commandDto;
  } else if (command instanceof RemoveStaticUnitCommand) {
    const commandDto: RemoveStaticUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemoveStaticUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof CreatePortalUnitCommand) {
    const commandDto: CreatePortalUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreatePortalUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    return commandDto;
  } else if (command instanceof RemovePortalUnitCommand) {
    const commandDto: RemovePortalUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemovePortalUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof RotateUnitCommand) {
    const commandDto: RotateUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RotateUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof MovePlayerCommand) {
    const commandDto: MovePlayerCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.MovePlayer,
      playerId: command.getPlayerId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    return commandDto;
  } else if (command instanceof SendPlayerIntoPortalCommand) {
    const commandDto: SendPlayerIntoPortalCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.SendPlayerIntoPortal,
      playerId: command.getPlayerId(),
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof ChangePlayerHeldItemCommand) {
    const commandDto: ChangePlayerHeldItemCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.ChangePlayerHeldItem,
      playerId: command.getPlayerId(),
      itemId: command.getItemId(),
    };
    return commandDto;
  }
  return null;
};

export { CommandNameEnum };

export type CommandDto =
  | PingCommandDto
  | AddPlayerCommandDto
  | MovePlayerCommandDto
  | SendPlayerIntoPortalCommandDto
  | RemovePlayerCommandDto
  | ChangePlayerHeldItemCommandDto
  | CreateStaticUnitCommandDto
  | RemoveStaticUnitCommandDto
  | CreatePortalUnitCommandDto
  | RemovePortalUnitCommandDto
  | RotateUnitCommandDto;

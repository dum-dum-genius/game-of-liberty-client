import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApi } from '@/adapters/apis/world-journey-api';
import { ItemApi } from '@/adapters/apis/item-api';
import { ItemModel } from '@/models/world/item/item-model';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { WorldJourneyService } from '@/services/world-journey-service';
import { PositionVo } from '@/models/world/common/position-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { DateVo } from '@/models/global/date-vo';
import { AddItemCommand } from '@/services/world-journey-service/managers/command-manager/commands/add-item-command';
import { SendPlayerIntoPortalCommand } from '@/services/world-journey-service/managers/command-manager/commands/send-player-into-portal-command';
import { AddPerspectiveDepthCommand } from '@/services/world-journey-service/managers/command-manager/commands/add-perspective-depth-command';
import { SubtractPerspectiveDepthCommand } from '@/services/world-journey-service/managers/command-manager/commands/subtract-perspective-depth-command';
import { ChangePlayerActionCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-action-command';
import { CreateStaticUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-static-unit-command';
import { ChangePlayerHeldItemCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-held-item-command';
import { CreatePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-portal-unit-command';
import { RemoveStaticUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-static-unit-command';
import { RemovePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-portal-unit-command';
import { RotateUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/rotate-unit-command';
import { CreateFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-fence-unit-command';
import { RemoveFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-fence-unit-command';
import { CreateLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-link-unit-command';
import { RemoveLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-link-unit-command';
import { dipatchUnitType } from '@/models/world/unit/utils';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';
import { LinkUnitApi } from '@/adapters/apis/link-unit-api';
import { FenceUnitModel } from '@/models/world/unit/fence-unit-model';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  worldJourneyService: WorldJourneyService | null;
  connectionStatus: ConnectionStatus;
  items: ItemModel[] | null;
  enterWorld: (WorldId: string) => void;
  addPerspectiveDepth: () => void;
  subtractPerspectiveDepth: () => void;
  makePlayerStand: () => void;
  makePlayerWalk: (direction: DirectionVo) => void;
  changePlayerHeldItem: (item: ItemModel) => void;
  engageUnit: () => void;
  createUnit: () => void;
  removeUnit: () => void;
  rotateUnit: () => void;
  leaveWorld: () => void;
};

const Context = createContext<ContextValue>({
  worldJourneyService: null,
  connectionStatus: 'WAITING',
  items: null,
  enterWorld: () => {},
  addPerspectiveDepth: () => {},
  subtractPerspectiveDepth: () => {},
  makePlayerStand: () => {},
  makePlayerWalk: () => {},
  changePlayerHeldItem: () => {},
  engageUnit: () => {},
  createUnit: () => {},
  removeUnit: () => {},
  rotateUnit: () => {},
  leaveWorld: () => {},
});

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const linkUnitApi = useMemo(() => LinkUnitApi.new(), []);
  const itemApi = useMemo<ItemApi>(() => ItemApi.new(), []);
  const [items, setItems] = useState<ItemModel[] | null>([]);
  const [worldJourneyService, setWorldJourneyService] = useState<WorldJourneyService | null>(null);

  useEffect(() => {
    if (!worldJourneyService) return;

    worldJourneyService.subscribePlaceholderItemIdsAdded((placeholderItemIds) => {
      itemApi.getItemsOfIds(placeholderItemIds).then((_items) => {
        _items.forEach((item) => {
          worldJourneyService.executeCommand(AddItemCommand.new(item));
        });
      });
    });
  }, [worldJourneyService]);

  const fetchItems = useCallback(async () => {
    const newItems = await itemApi.getItems();
    setItems(newItems);
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!worldJourneyService || !items) return;
    items.forEach((item) => {
      worldJourneyService.executeCommand(AddItemCommand.new(item));
    });
  }, [worldJourneyService, items]);

  const worldJourneyApi = useRef<WorldJourneyApi | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('WAITING');

  useEffect(
    function destroyWorldJourneyService() {
      return () => {
        if (worldJourneyService) {
          worldJourneyService.destroy();
        }
      };
    },
    [worldJourneyService]
  );

  const enterWorld = useCallback((WorldId: string) => {
    if (worldJourneyApi.current) {
      return;
    }

    let newWorldJourneyService: WorldJourneyService | null = null;
    const newWorldJourneyApi = WorldJourneyApi.new(WorldId, {
      onWorldEntered: (_worldJourneyService) => {
        newWorldJourneyService = _worldJourneyService;
        setWorldJourneyService(_worldJourneyService);
      },
      onCommandSucceeded: (command) => {
        if (!newWorldJourneyService) return;
        newWorldJourneyService.executeCommand(command);
      },
      onErrored: () => {
        // TODO - do something
      },
      onOpen: () => {
        setConnectionStatus('OPEN');
      },
      onClose: () => {
        setConnectionStatus('DISCONNECTED');
        worldJourneyApi.current = null;
      },
    });
    setConnectionStatus('CONNECTING');
    worldJourneyApi.current = newWorldJourneyApi;
  }, []);

  useEffect(() => {
    if (!worldJourneyService) return;

    worldJourneyService.subscribeMyPlayerChanged((oldPlayer, player) => {
      if (!worldJourneyApi.current) return;

      const oldPlayerPos = oldPlayer.getPosition();
      const playerPos = player.getPosition();
      if (oldPlayerPos.isEqual(playerPos)) {
        return;
      }

      const unitAtPlayerPos = worldJourneyService.getUnit(playerPos);
      if (!unitAtPlayerPos) return;

      if (unitAtPlayerPos instanceof PortalUnitModel) {
        const command = SendPlayerIntoPortalCommand.new(player.getId(), playerPos);
        worldJourneyService.executeCommand(command);
        worldJourneyApi.current.sendCommand(command);
      }
    });
  }, [worldJourneyService]);

  const addPerspectiveDepth = useCallback(() => {
    if (!worldJourneyService) return;

    worldJourneyService.executeCommand(AddPerspectiveDepthCommand.new());
  }, [worldJourneyService]);

  const subtractPerspectiveDepth = useCallback(() => {
    if (!worldJourneyService) return;

    worldJourneyService.executeCommand(SubtractPerspectiveDepthCommand.new());
  }, [worldJourneyService]);

  const makePlayerStand = useCallback(() => {
    if (!worldJourneyApi.current || !worldJourneyService) {
      return;
    }

    const myPlayer = worldJourneyService.getMyPlayer();
    const playerPrecisePosition = myPlayer.getPrecisePosition();
    const playerDirection = worldJourneyService.getMyPlayer().getDirection();
    const playerAction = PlayerActionVo.newStand(playerPrecisePosition, playerDirection, DateVo.now());
    const command = ChangePlayerActionCommand.new(myPlayer.getId(), playerAction);
    worldJourneyService.executeCommand(command);
    worldJourneyApi.current.sendCommand(command);
  }, [worldJourneyService]);

  const makePlayerWalk = useCallback(
    (direction: DirectionVo) => {
      if (!worldJourneyApi.current || !worldJourneyService) {
        return;
      }

      const myPlayer = worldJourneyService.getMyPlayer();
      const playerPrecisePosition = myPlayer.getPrecisePosition();
      const playerAction = PlayerActionVo.newWalk(playerPrecisePosition, direction, DateVo.now());
      const command = ChangePlayerActionCommand.new(myPlayer.getId(), playerAction);
      worldJourneyService.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourneyService]
  );

  const leaveWorld = useCallback(() => {
    setWorldJourneyService(null);
    setConnectionStatus('DISCONNECTING');
    worldJourneyApi.current?.disconnect();
  }, []);

  const changePlayerHeldItem = useCallback(
    (item: ItemModel) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = ChangePlayerHeldItemCommand.new(worldJourneyService.getMyPlayer().getId(), item.getId());
      worldJourneyService.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourneyService]
  );

  const createStaticUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateStaticUnitCommand.new(StaticUnitModel.new(itemId, position, direction));
      worldJourneyService.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourneyService]
  );

  const createFenceUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateFenceUnitCommand.new(FenceUnitModel.new(itemId, position, direction));
      worldJourneyService.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourneyService]
  );

  const createPortalUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreatePortalUnitCommand.new(PortalUnitModel.new(itemId, position, direction, null));
      worldJourneyService.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourneyService]
  );

  const createLinkUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo, url: string) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateLinkUnitCommand.new(LinkUnitModel.new(itemId, position, direction), url);
      worldJourneyService.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourneyService]
  );

  const createUnit = useCallback(() => {
    if (!worldJourneyService) return;

    const myPlayerHeldItem = worldJourneyService.getMyPlayerHeldItem();
    if (!myPlayerHeldItem) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const direction = myPlayer.getDirection().getOppositeDirection();

    const compatibleUnitType = myPlayerHeldItem.getCompatibleUnitType();
    dipatchUnitType(compatibleUnitType, {
      static: () => {
        createStaticUnit(myPlayerHeldItem.getId(), unitPos, direction);
      },
      fence: () => {
        createFenceUnit(myPlayerHeldItem.getId(), unitPos, direction);
      },
      portal: () => {
        createPortalUnit(myPlayerHeldItem.getId(), unitPos, direction);
      },
      link: () => {
        const url = prompt('Enter url');
        createLinkUnit(myPlayerHeldItem.getId(), unitPos, direction, url || '');
      },
    });
  }, [worldJourneyService]);

  const engageUnit = useCallback(async () => {
    if (!worldJourneyService) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const unitAtPos = worldJourneyService.getUnit(unitPos);
    if (!unitAtPos) return;

    if (unitAtPos instanceof LinkUnitModel) {
      const linkUnitUrl = await linkUnitApi.getLinkUnitUrl(unitAtPos.getId());
      window.open(linkUnitUrl);
    }
  }, [worldJourneyService]);

  const removeUnit = useCallback(() => {
    if (!worldJourneyService) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const unitAtPos = worldJourneyService.getUnit(unitPos);
    if (!unitAtPos) return;

    const unitId = unitAtPos.getId();

    dipatchUnitType(unitAtPos.getType(), {
      static: () => {
        if (!worldJourneyApi.current) return;

        const command = RemoveStaticUnitCommand.new(unitId);
        worldJourneyService.executeCommand(command);
        worldJourneyApi.current.sendCommand(command);
      },
      fence: () => {
        if (!worldJourneyApi.current) return;

        const command = RemoveFenceUnitCommand.new(unitId);
        worldJourneyService.executeCommand(command);
        worldJourneyApi.current.sendCommand(command);
      },
      portal: () => {
        if (!worldJourneyApi.current) return;

        const command = RemovePortalUnitCommand.new(unitId);
        worldJourneyService.executeCommand(command);
        worldJourneyApi.current.sendCommand(command);
      },
      link: () => {
        if (!worldJourneyApi.current) return;

        const command = RemoveLinkUnitCommand.new(unitId);
        worldJourneyService.executeCommand(command);
        worldJourneyApi.current.sendCommand(command);
      },
    });
  }, [worldJourneyService]);

  const rotateUnit = useCallback(() => {
    if (!worldJourneyService || !worldJourneyApi.current) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const unitAtPos = worldJourneyService.getUnit(unitPos);
    if (!unitAtPos) return;

    const command = RotateUnitCommand.new(unitAtPos.getId());
    worldJourneyService.executeCommand(command);
    worldJourneyApi.current.sendCommand(command);
  }, [worldJourneyService]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worldJourneyService,
          connectionStatus,
          items,
          enterWorld,
          addPerspectiveDepth,
          subtractPerspectiveDepth,
          makePlayerStand,
          makePlayerWalk,
          leaveWorld,
          changePlayerHeldItem,
          engageUnit,
          createUnit,
          removeUnit,
          rotateUnit,
        }),
        [
          worldJourneyService,
          connectionStatus,
          items,
          enterWorld,
          addPerspectiveDepth,
          subtractPerspectiveDepth,
          makePlayerStand,
          makePlayerWalk,
          leaveWorld,
          changePlayerHeldItem,
          engageUnit,
          createUnit,
          removeUnit,
          rotateUnit,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldJourneyServiceProvider, Context as WorldJourneyServiceContext };

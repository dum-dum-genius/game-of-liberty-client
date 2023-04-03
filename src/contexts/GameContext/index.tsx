import { createContext, useCallback, useRef, useState, useMemo, MutableRefObject } from 'react';
import GameSocket from '@/apis/GameSocket';
import { DirectionVo, BoundVo } from '@/models/valueObjects';
import { UnitAgg, PlayerAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  otherPlayers: PlayerAgg[] | null;
  visionBound: BoundVo | null;
  units: UnitAgg[] | null;
  joinGame: (gameId: string) => void;
  move: (direction: DirectionVo) => void;
  changeHeldItem: (itemId: string) => void;
  placeItem: () => void;
  removeItem: () => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'WAITING',
    myPlayer: null,
    otherPlayers: null,
    visionBound: null,
    units: null,
    joinGame: () => {},
    move: () => {},
    changeHeldItem: () => {},
    placeItem: () => {},
    removeItem: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const gameSocket: MutableRefObject<GameSocket | null> = useRef(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');
  const initialContextValue = createInitialContextValue();
  const [myPlayer, setMyPlayer] = useState<PlayerAgg | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<PlayerAgg[] | null>([]);
  const [visionBound, setVisionBound] = useState<BoundVo | null>(initialContextValue.visionBound);
  const [units, setUnits] = useState<UnitAgg[] | null>(initialContextValue.units);

  const reset = useCallback(() => {
    setMyPlayer(null);
    setOtherPlayers([]);
    setVisionBound(initialContextValue.visionBound);
    setUnits(initialContextValue.units);
  }, []);

  const joinGame = useCallback(
    (gameId: string) => {
      if (gameSocket.current) {
        return;
      }

      const newGameSocket = GameSocket.newGameSocket(gameId, {
        onGameJoined: () => {},
        onPlayersUpdated: (newMyPlayer, newOtherPlayers: PlayerAgg[]) => {
          setMyPlayer(newMyPlayer);
          setOtherPlayers(newOtherPlayers);
        },
        onUnitsUpdated: (newVisionBound: BoundVo, newUnits: UnitAgg[]) => {
          setVisionBound(newVisionBound);
          setUnits(newUnits);
        },
        onOpen: () => {
          setGameStatus('OPEN');
        },
        onClose: (disconnectedByClient: boolean) => {
          if (disconnectedByClient) {
            setGameStatus('WAITING');
            gameSocket.current = null;
            reset();
          } else {
            setGameStatus('DISCONNECTED');
            gameSocket.current = null;
          }
        },
      });
      setGameStatus('CONNECTING');
      gameSocket.current = newGameSocket;
    },
    [gameSocket]
  );

  const move = useCallback((direction: DirectionVo) => {
    gameSocket.current?.move(direction);
  }, []);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocket.current?.disconnect();
  }, []);

  const changeHeldItem = useCallback((itemId: string) => {
    gameSocket.current?.changeHeldItem(itemId);
  }, []);

  const placeItem = useCallback(() => {
    gameSocket.current?.placeItem();
  }, []);

  const removeItem = useCallback(() => {
    gameSocket.current?.removeItem();
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          myPlayer,
          otherPlayers,
          visionBound,
          units,
          joinGame,
          move,
          leaveGame,
          changeHeldItem,
          placeItem,
          removeItem,
        }),
        [gameStatus, myPlayer, otherPlayers, visionBound, units, joinGame, move, changeHeldItem, placeItem, leaveGame]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;

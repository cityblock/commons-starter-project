export interface IIdleStart {
  type: 'IDLE_START';
}

export interface IIdleEnd {
  type: 'IDLE_END';
}

export function idleStart(): IIdleStart {
  return {
    type: 'IDLE_START',
  };
}

export function idleEnd(): IIdleEnd {
  return {
    type: 'IDLE_END',
  };
}

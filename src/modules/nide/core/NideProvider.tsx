import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { NideContextState, NideAction, NideDomain } from '../types/nide.types';
import { NIDE_VERSION } from './constants';

const initialState: NideContextState = {
  activeDomain: null,
  isFullscreen: true,
  version: NIDE_VERSION
};

function nideReducer(state: NideContextState, action: NideAction): NideContextState {
  switch (action.type) {
    case 'SET_ACTIVE_DOMAIN':
      return { ...state, activeDomain: action.payload };
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    default:
      return state;
  }
}

interface NideContextValue {
  state: NideContextState;
  setActiveDomain: (domain: NideDomain | null) => void;
  setFullscreen: (value: boolean) => void;
}

const NideContext = createContext<NideContextValue | null>(null);

export const useNideContext = (): NideContextValue => {
  const ctx = useContext(NideContext);
  if (!ctx) {
    throw new Error('useNideContext deve ser usado dentro de NideProvider');
  }
  return ctx;
};

interface NideProviderProps {
  children: ReactNode;
}

export const NideProvider: React.FC<NideProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(nideReducer, initialState);

  const setActiveDomain = useCallback((domain: NideDomain | null) => {
    dispatch({ type: 'SET_ACTIVE_DOMAIN', payload: domain });
  }, []);

  const setFullscreen = useCallback((value: boolean) => {
    dispatch({ type: 'SET_FULLSCREEN', payload: value });
  }, []);

  return (
    <NideContext.Provider value={{ state, setActiveDomain, setFullscreen }}>
      {children}
    </NideContext.Provider>
  );
};

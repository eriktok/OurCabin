import React, { createContext, useContext, useMemo } from 'react';
import { ICabinApiService } from '../core/services/ICabinApiService';
import { cabinApiService } from './SupabaseService';

const CabinApiContext = createContext<ICabinApiService | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode; service?: ICabinApiService }> = ({ children, service }) => {
  const value = useMemo(() => service ?? cabinApiService, [service]);
  return <CabinApiContext.Provider value={value}>{children}</CabinApiContext.Provider>;
};

export function useCabinApi(): ICabinApiService {
  const ctx = useContext(CabinApiContext);
  if (!ctx) {
    throw new Error('useCabinApi must be used within ServiceProvider');
  }
  return ctx;
}



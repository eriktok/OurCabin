import React, { createContext, useContext, useMemo } from 'react';
import { ICabinApiService } from '../core/services/ICabinApiService';
import { cabinApiService } from './SupabaseService';
import { composedSupabaseService } from './supabase/ComposedSupabaseService';

const CabinApiContext = createContext<ICabinApiService | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode; service?: ICabinApiService }> = ({ children, service }) => {
  // Use real Supabase service if environment variables are set, otherwise use mock
  const useRealService = process.env.SUPABASE_URL && 
    process.env.SUPABASE_URL !== 'your-supabase-url' && 
    process.env.SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
    process.env.SUPABASE_ANON_KEY && 
    process.env.SUPABASE_ANON_KEY !== 'your-anon-key-here';
  
  const value = useMemo(() => {
    if (service) return service;
    
    if (useRealService) {
      console.log('🚀 Using real Supabase service');
      return composedSupabaseService;
    } else {
      console.log('📱 Using mock service (set SUPABASE_URL and SUPABASE_ANON_KEY to use real backend)');
      return cabinApiService;
    }
  }, [service, useRealService]);
  
  return <CabinApiContext.Provider value={value}>{children}</CabinApiContext.Provider>;
};

export function useCabinApi(): ICabinApiService {
  const ctx = useContext(CabinApiContext);
  if (!ctx) {
    throw new Error('useCabinApi must be used within ServiceProvider');
  }
  return ctx;
}



import React, { useState, useEffect } from 'react';
import { RAIAgent, RAICapture, RAIReading, RAIAlert, RAIFilters } from '../types';
import { raiAgentsService, raiCapturesService, raiInsightsService } from '../services/raiServices';

export const useRAIAgents = () => {
  const [agents, setAgents] = useState<RAIAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    raiAgentsService.getAgents().then(data => {
      setAgents(data);
      setLoading(false);
    });
  }, []);

  return { agents, loading };
};

export const useRAICaptures = (initialFilters?: RAIFilters) => {
  const [captures, setCaptures] = useState<RAICapture[]>([]);
  const [filters, setFilters] = useState<RAIFilters>(initialFilters || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    raiCapturesService.getCaptures(filters).then(data => {
      setCaptures(data);
      setLoading(false);
    });
  }, [filters]);

  return { captures, filters, setFilters, loading };
};

export const useRAIInsights = () => {
  const [readings, setReadings] = useState<RAIReading[]>([]);
  const [alerts, setAlerts] = useState<RAIAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      raiInsightsService.getReadings(),
      raiInsightsService.getAlerts()
    ]).then(([r, a]) => {
      setReadings(r);
      setAlerts(a);
      setLoading(false);
    });
  }, []);

  return { readings, alerts, loading };
};

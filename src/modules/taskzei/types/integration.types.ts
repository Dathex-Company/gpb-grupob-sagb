export interface SagBIntegrationContext {
  userId?: string;
  projectId?: string;
  organizationId?: string;
}

export interface TaskzeiConfig {
  useMockBackend: boolean;
  enableSagBIntegration: boolean;
}

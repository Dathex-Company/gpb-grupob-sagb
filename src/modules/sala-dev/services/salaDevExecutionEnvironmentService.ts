export type DevExecutionEnvironmentStatus =
  | 'not_connected'
  | 'configured'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed';

export interface DevExecutionEnvironmentState {
  environmentType: 'sagb_ui' | 'vscode' | 'roo_code';
  status: DevExecutionEnvironmentStatus;
  repositoryRef?: string;
  workspacePath?: string;
  nextAction?: 'export_package' | 'open_technical_task' | 'sync_repository';
}

export const salaDevExecutionEnvironmentService = {
  getDefaultState(): DevExecutionEnvironmentState {
    return {
      environmentType: 'sagb_ui',
      status: 'configured',
      nextAction: 'export_package'
    };
  }
};


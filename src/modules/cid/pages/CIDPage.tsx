import React from 'react';
import CIDView from '../../../../components/CIDView';
import { getCidRuntimeContext } from '../store';

const CIDPage: React.FC = () => {
  const runtime = getCidRuntimeContext();

  return (
    <CIDView
      workspaceId={runtime.workspaceId}
      ownerUserId={runtime.ownerUserId}
      userProfile={runtime.userProfile}
      ventures={runtime.ventures}
      onBack={runtime.onBack}
    />
  );
};

export default CIDPage;

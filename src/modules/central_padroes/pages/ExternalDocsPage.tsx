import React from 'react';
import DocumentsPage from './DocumentsPage';
type Props = { onOpenDocument?: (documentId: string) => void };
const ExternalDocsPage: React.FC<Props> = ({ onOpenDocument }) => <DocumentsPage title="Documentos externos" subtitle="Documentos classificados como externos ou fonte externa." initialFilters={{ status: 'externo' }} onOpenDocument={onOpenDocument} />;
export default ExternalDocsPage;

import { NideDomainManifest } from '../../registry/domain.types';

/**
 * Domain Manifest de Metodologias como domínio plugável do NIDE.
 *
 * Metodologias é o primeiro domínio real migrado para dentro do NIDE (ET 05/08).
 * Mantém sua especialidade própria: estruturação, governança, versionamento
 * e aplicação de metodologias proprietárias do SagB.
 *
 * O módulo original em src/modules/metodologias/ foi preservado como fallback.
 */
export const metodologiasDomainManifest: NideDomainManifest = {
  id: 'metodologias',
  displayName: 'Metodologias',
  description: 'Domínio especialista para estruturação, governança, versionamento e aplicação de metodologias dentro do NIDE.',
  icon: 'BookIcon',
  basePath: '/nide/metodologias',
  status: 'active',
  order: 10,
  category: 'estrutura',
  owner: {
    type: 'agent',
    id: 'metodologias-agent',
    displayName: 'Agente de Metodologias'
  },
  tags: ['estrutura', 'metodologias', 'proprietario', 'canonico'],
  isCore: false,
  isPlanned: false,
  isEnabledByDefault: true
};

import { NideDomainManifest } from '../../registry/domain.types';

/**
 * Domain Manifest de Mentorias como domínio plugável do NIDE.
 *
 * Mentorias é o segundo domínio real migrado para dentro do NIDE (ET 06/08).
 * Mantém sua especialidade própria: estruturação, aplicação, acompanhamento,
 * versionamento e evolução de mentorias dentro do SagB.
 *
 * O módulo original em src/modules/mentorias/ foi preservado como fallback.
 */
export const mentoriasDomainManifest: NideDomainManifest = {
  id: 'mentorias',
  displayName: 'Central de Mentorias',
  description: 'Domínio especialista para estruturação, aplicação, acompanhamento, versionamento e evolução de mentorias dentro do NIDE.',
  icon: 'BookIcon',
  basePath: '/nide/mentorias',
  status: 'active',
  order: 20,
  category: 'ensino',
  owner: {
    type: 'agent',
    id: 'mentorias-agent',
    displayName: 'Agente de Mentorias'
  },
  tags: ['ensino', 'mentorias', 'capacitacao', 'biblioteca'],
  isCore: false,
  isPlanned: false,
  isEnabledByDefault: true
};

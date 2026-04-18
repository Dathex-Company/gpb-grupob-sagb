import { db, doc, updateDoc, Timestamp } from '../../../../services/supabase';
import { Empresa } from '../types';
import { toLegacyVentureCompat } from './empresaMapper';

export interface EmpresaUpdateInput {
  nome: string;
  nomeCurto?: string;
  slug?: string;
  status: Empresa['status'];
  tipo: Empresa['tipo'];
  esfera: Empresa['esfera'];
  segmento?: string;
  nicho?: string;
  descricaoCurta?: string;
  siteUrl?: string;
  logoUrl: string;
  camposAuxiliares?: Record<string, unknown>;
}

/**
 * Persistência oficial de atualização cadastral de Empresa.
 * Mantém o modelo canônico no módulo e publica compatibilidade transitória para coleção legada `ventures`.
 */
export const updateEmpresaCadastro = async (
  empresaAtual: Empresa,
  input: EmpresaUpdateInput
): Promise<Empresa> => {
  if (!empresaAtual?.id) {
    throw new Error('Empresa inválida para update: id não informado.');
  }

  const agora = new Date();
  const empresaAtualizada: Empresa = {
    ...empresaAtual,
    ...input,
    id: empresaAtual.id,
    createdAt: empresaAtual.createdAt,
    updatedAt: agora,
    timestamp: agora,
    camposAuxiliares: {
      ...(empresaAtual.camposAuxiliares || {}),
      ...(input.camposAuxiliares || {})
    }
  };

  const payloadLegado = {
    ...toLegacyVentureCompat(empresaAtualizada),
    createdAt: Timestamp.fromDate(empresaAtualizada.createdAt),
    updatedAt: Timestamp.fromDate(agora),
    timestamp: Timestamp.fromDate(agora)
  };

  await updateDoc(doc(db, 'ventures', empresaAtualizada.id), payloadLegado as any);

  return empresaAtualizada;
};

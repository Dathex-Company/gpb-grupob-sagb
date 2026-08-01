import { MentorshipSimulation, ScenarioInput } from '../types/simulador-mentorias.types';

const baseScenario: Omit<ScenarioInput, 'id' | 'kind' | 'name' | 'participants' | 'refundPercent'> = {
  capacity: 40,
  courtesySeats: 2,
  sponsoredSeats: 0,
  sponsorshipRevenueCents: 0,
  otherRevenueCents: 0,
  defaultTaxPercent: 6,
  defaultPaymentFeePercent: 3.2,
  contingencyCents: 250000,
  minMarginPercent: 25,
  priceTiers: [
    { id: 'early', name: 'Early bird', plannedQuantity: 10, listPriceCents: 250000, discountPercent: 12 },
    { id: 'standard', name: 'Preço padrão', plannedQuantity: 18, listPriceCents: 250000, discountPercent: 0 },
    { id: 'partner', name: 'Parceiros', plannedQuantity: 4, listPriceCents: 250000, discountPercent: 20 }
  ],
  acquisitionChannels: [
    { id: 'base', name: 'Base própria', budgetCents: 0, leads: 140, contacts: 70, meetings: 32, proposals: 24, sales: 14, additionalCostCents: 30000, attributedRevenueCents: 3500000 },
    { id: 'referral', name: 'Indicação', budgetCents: 40000, leads: 40, contacts: 28, meetings: 14, proposals: 10, sales: 6, additionalCostCents: 0, attributedRevenueCents: 1500000 },
    { id: 'partners', name: 'Parceiros', budgetCents: 60000, leads: 55, contacts: 32, meetings: 18, proposals: 12, sales: 5, additionalCostCents: 50000, attributedRevenueCents: 1250000 },
    { id: 'paid-media', name: 'Mídia paga', budgetCents: 180000, leads: 220, contacts: 88, meetings: 28, proposals: 16, sales: 7, additionalCostCents: 20000, attributedRevenueCents: 1750000 }
  ],
  costItems: [
    { id: 'space', name: 'Espaço', kind: 'fixed', amountCents: 180000, base: 'manual' },
    { id: 'team', name: 'Equipe', kind: 'fixed', amountCents: 240000, base: 'manual' },
    { id: 'page', name: 'Página de venda', kind: 'fixed', amountCents: 90000, base: 'manual' },
    { id: 'coffee', name: 'Coffee break', kind: 'per_participant', unitCostCents: 4500, base: 'manual' },
    { id: 'kit', name: 'Material e kit', kind: 'per_participant', unitCostCents: 2800, base: 'manual' },
    { id: 'commission', name: 'Comissão comercial', kind: 'percentage', percent: 5, base: 'principal_revenue' }
  ],
  upsells: [
    { id: 'follow-up', name: 'Acompanhamento pós-mentoria', eligibleParticipants: 32, priceCents: 120000, conversionPercent: 18, paymentFeePercent: 3.2, taxPercent: 6, commissionPercent: 6, deliveryCostCents: 18000, refundPercent: 2 },
    { id: 'implementation', name: 'Implantação assistida', eligibleParticipants: 32, priceCents: 350000, conversionPercent: 6, paymentFeePercent: 3.2, taxPercent: 6, commissionPercent: 8, deliveryCostCents: 60000, refundPercent: 1 }
  ]
};

export const defaultScenarios: ScenarioInput[] = [
  { ...baseScenario, id: 'conservative', kind: 'conservative', name: 'Conservador', participants: 24, refundPercent: 6 },
  { ...baseScenario, id: 'probable', kind: 'probable', name: 'Provável', participants: 32, refundPercent: 3 },
  { ...baseScenario, id: 'optimistic', kind: 'optimistic', name: 'Otimista', participants: 38, refundPercent: 2 }
];

export const defaultMentorshipSimulation: MentorshipSimulation = {
  id: 'sim-demo-mentorias-001',
  mentorshipId: 'mentoria-demo',
  title: 'Turma Mentoria Estratégica — Simulação MVP',
  status: 'draft',
  approvedScenarioId: 'probable',
  scenarios: defaultScenarios,
  actuals: {
    paidParticipants: 30,
    presentParticipants: 28,
    contractedRevenueCents: 7500000,
    receivedRevenueCents: 7160000,
    refundsCents: 120000,
    marketingCents: 270000,
    realCostsCents: 1450000,
    commissionsCents: 350000,
    taxesCents: 430000,
    upsellRevenueCents: 1320000,
    finalResultCents: 5230000,
    learning: 'Validar mais cedo os canais de indicação e parceiros para reduzir dependência de mídia paga.'
  },
  createdAt: '2026-08-01T12:00:00.000Z',
  updatedAt: '2026-08-01T12:00:00.000Z'
};

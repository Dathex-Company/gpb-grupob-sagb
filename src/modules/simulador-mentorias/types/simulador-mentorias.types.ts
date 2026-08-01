export type SimulationStatus =
  | 'draft'
  | 'in_analysis'
  | 'approved'
  | 'selling'
  | 'running'
  | 'realized'
  | 'closed'
  | 'archived'
  | 'cancelled';

export type ScenarioKind = 'conservative' | 'probable' | 'optimistic';
export type CostKind = 'fixed' | 'per_participant' | 'percentage';

export interface PriceTierInput {
  id: string;
  name: string;
  plannedQuantity: number;
  listPriceCents: number;
  discountPercent: number;
  effectivePriceCents?: number;
}

export interface AcquisitionChannelInput {
  id: string;
  name: string;
  budgetCents: number;
  leads: number;
  contacts: number;
  meetings: number;
  proposals: number;
  sales: number;
  additionalCostCents: number;
  attributedRevenueCents: number;
}

export interface CostItemInput {
  id: string;
  name: string;
  kind: CostKind;
  amountCents?: number;
  unitCostCents?: number;
  quantity?: number;
  percent?: number;
  base: 'gross_revenue' | 'net_revenue' | 'principal_revenue' | 'upsell_revenue' | 'manual';
}

export interface UpsellOfferInput {
  id: string;
  name: string;
  eligibleParticipants: number;
  priceCents: number;
  conversionPercent: number;
  paymentFeePercent: number;
  taxPercent: number;
  commissionPercent: number;
  deliveryCostCents: number;
  refundPercent: number;
}

export interface ScenarioInput {
  id: string;
  kind: ScenarioKind;
  name: string;
  participants: number;
  capacity: number;
  courtesySeats: number;
  sponsoredSeats: number;
  sponsorshipRevenueCents: number;
  otherRevenueCents: number;
  refundPercent: number;
  defaultTaxPercent: number;
  defaultPaymentFeePercent: number;
  contingencyCents: number;
  minMarginPercent: number;
  priceTiers: PriceTierInput[];
  acquisitionChannels: AcquisitionChannelInput[];
  costItems: CostItemInput[];
  upsells: UpsellOfferInput[];
}

export interface ScenarioResult {
  scenarioId: string;
  principalGrossRevenueCents: number;
  upsellGrossRevenueCents: number;
  totalGrossRevenueCents: number;
  lossesCents: number;
  paymentFeesCents: number;
  taxesCents: number;
  netRevenueCents: number;
  fixedCostsCents: number;
  variableCostsCents: number;
  percentageCostsCents: number;
  marketingCostsCents: number;
  totalCostsCents: number;
  operationalResultWithoutUpsellCents: number;
  operationalResultWithUpsellCents: number;
  marginPercent: number;
  roiPercent: number;
  roas: number;
  paidCacCents: number;
  averageTicketCents: number;
  occupancyPercent: number;
  breakEvenPaidParticipants: number;
  requiredLeads: number;
  alerts: SimulationAlert[];
  calculatedAt: string;
  calculationVersion: string;
}

export interface SimulationAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
}

export interface MentorshipSimulation {
  id: string;
  mentorshipId: string;
  title: string;
  status: SimulationStatus;
  approvedScenarioId?: string;
  scenarios: ScenarioInput[];
  actuals?: SimulationActuals;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationActuals {
  paidParticipants: number;
  presentParticipants: number;
  contractedRevenueCents: number;
  receivedRevenueCents: number;
  refundsCents: number;
  marketingCents: number;
  realCostsCents: number;
  commissionsCents: number;
  taxesCents: number;
  upsellRevenueCents: number;
  finalResultCents: number;
  learning?: string;
}

export interface PlanActualVariance {
  label: string;
  plannedCents?: number;
  actualCents?: number;
  plannedNumber?: number;
  actualNumber?: number;
  absolute: number;
  percent: number;
}

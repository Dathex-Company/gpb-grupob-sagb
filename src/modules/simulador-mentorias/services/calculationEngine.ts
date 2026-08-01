import {
  AcquisitionChannelInput,
  CostItemInput,
  PlanActualVariance,
  ScenarioInput,
  ScenarioResult,
  SimulationActuals,
  SimulationAlert,
  UpsellOfferInput
} from '../types/simulador-mentorias.types';

export const CALCULATION_VERSION = 'mentorship-simulator-mvp-1.0.0';

const clampPercent = (value: number) => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
const safeInteger = (value: number) => Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
const safeCents = (value?: number) => Math.max(0, Math.round(Number.isFinite(value || 0) ? value || 0 : 0));
const percentOf = (baseCents: number, percent: number) => Math.round(baseCents * clampPercent(percent) / 100);
const divide = (a: number, b: number) => (b === 0 ? 0 : a / b);

export const formatCurrency = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((cents || 0) / 100);

export const formatPercent = (value: number) => `${Number.isFinite(value) ? value.toFixed(1) : '0.0'}%`;

export const effectivePriceCents = (listPriceCents: number, discountPercent: number) => {
  const discount = percentOf(safeCents(listPriceCents), discountPercent);
  return Math.max(0, safeCents(listPriceCents) - discount);
};

const sumAcquisitionBudget = (channels: AcquisitionChannelInput[]) =>
  channels.reduce((total, channel) => total + safeCents(channel.budgetCents) + safeCents(channel.additionalCostCents), 0);

const sumChannelSales = (channels: AcquisitionChannelInput[]) =>
  channels.reduce((total, channel) => total + safeInteger(channel.sales), 0);

const sumPaidLeads = (channels: AcquisitionChannelInput[]) =>
  channels.reduce((total, channel) => total + safeInteger(channel.leads), 0);

const sumAttributedRevenue = (channels: AcquisitionChannelInput[]) =>
  channels.reduce((total, channel) => total + safeCents(channel.attributedRevenueCents), 0);

const calculateUpsell = (upsells: UpsellOfferInput[]) => {
  return upsells.reduce((acc, upsell) => {
    const eligible = safeInteger(upsell.eligibleParticipants);
    const buyers = Math.min(eligible, Math.round(eligible * clampPercent(upsell.conversionPercent) / 100));
    const gross = buyers * safeCents(upsell.priceCents);
    const fees = percentOf(gross, upsell.paymentFeePercent);
    const taxes = percentOf(gross, upsell.taxPercent);
    const commissions = percentOf(gross, upsell.commissionPercent);
    const refunds = percentOf(gross, upsell.refundPercent);
    const delivery = buyers * safeCents(upsell.deliveryCostCents);
    acc.gross += gross;
    acc.costs += fees + taxes + commissions + refunds + delivery;
    acc.buyers += buyers;
    return acc;
  }, { gross: 0, costs: 0, buyers: 0 });
};

const resolvePercentageBase = (item: CostItemInput, context: {
  grossRevenueCents: number;
  netRevenueCents: number;
  principalRevenueCents: number;
  upsellRevenueCents: number;
}) => {
  if (item.base === 'net_revenue') return context.netRevenueCents;
  if (item.base === 'principal_revenue') return context.principalRevenueCents;
  if (item.base === 'upsell_revenue') return context.upsellRevenueCents;
  if (item.base === 'manual') return safeCents(item.amountCents);
  return context.grossRevenueCents;
};

const calculateCosts = (items: CostItemInput[], context: {
  participants: number;
  grossRevenueCents: number;
  netRevenueCents: number;
  principalRevenueCents: number;
  upsellRevenueCents: number;
}) => {
  return items.reduce((acc, item) => {
    if (item.kind === 'fixed') {
      acc.fixed += safeCents(item.amountCents);
      return acc;
    }

    if (item.kind === 'per_participant') {
      const quantity = item.quantity === undefined ? context.participants : safeInteger(item.quantity);
      acc.variable += quantity * safeCents(item.unitCostCents);
      return acc;
    }

    const base = resolvePercentageBase(item, context);
    acc.percentage += percentOf(base, item.percent || 0);
    return acc;
  }, { fixed: 0, variable: 0, percentage: 0 });
};

const buildAlerts = (scenario: ScenarioInput, result: Omit<ScenarioResult, 'alerts'>): SimulationAlert[] => {
  const alerts: SimulationAlert[] = [];
  const capacity = safeInteger(scenario.capacity);
  const courtesySeats = safeInteger(scenario.courtesySeats);
  const participants = safeInteger(scenario.participants);

  if (result.breakEvenPaidParticipants > capacity) {
    alerts.push({
      id: 'break-even-over-capacity',
      severity: 'critical',
      title: 'Ponto de equilíbrio acima da capacidade',
      description: 'A turma não se paga dentro da capacidade informada.'
    });
  }

  if (result.operationalResultWithUpsellCents < 0) {
    alerts.push({ id: 'negative-result', severity: 'critical', title: 'Resultado negativo', description: 'O cenário projeta prejuízo operacional.' });
  }

  if (result.marginPercent < scenario.minMarginPercent) {
    alerts.push({ id: 'margin-below-target', severity: 'warning', title: 'Margem abaixo da meta', description: `Margem projetada menor que ${scenario.minMarginPercent}%.` });
  }

  if (result.roiPercent < 0) {
    alerts.push({ id: 'negative-roi', severity: 'critical', title: 'ROI negativo', description: 'O retorno sobre investimento está negativo.' });
  }

  if (result.operationalResultWithoutUpsellCents < 0 && result.operationalResultWithUpsellCents >= 0) {
    alerts.push({ id: 'upsell-dependence', severity: 'warning', title: 'Dependência de upsell', description: 'A operação só fica viável quando receitas de upsell entram no cálculo.' });
  }

  if (courtesySeats > capacity * 0.15) {
    alerts.push({ id: 'excessive-courtesy', severity: 'warning', title: 'Cortesias elevadas', description: 'Cortesias superam 15% da capacidade.' });
  }

  if (participants + courtesySeats + safeInteger(scenario.sponsoredSeats) > capacity) {
    alerts.push({ id: 'capacity-exceeded', severity: 'critical', title: 'Capacidade excedida', description: 'Pagantes, cortesias e patrocinados superam a capacidade total.' });
  }

  if (scenario.defaultTaxPercent === 0 || scenario.defaultPaymentFeePercent === 0) {
    alerts.push({ id: 'missing-tax-fee', severity: 'warning', title: 'Imposto ou taxa ausente', description: 'Revise se imposto e taxa de pagamento devem estar zerados.' });
  }

  if (scenario.contingencyCents === 0 && result.fixedCostsCents > 0) {
    alerts.push({ id: 'missing-contingency', severity: 'info', title: 'Contingência zerada', description: 'Operações presenciais devem revisar reserva de contingência.' });
  }

  return alerts;
};

export const calculateScenario = (scenario: ScenarioInput): ScenarioResult => {
  const participants = safeInteger(scenario.participants);
  const principalGrossRevenueCents = scenario.priceTiers.reduce((total, tier) => {
    const price = tier.effectivePriceCents ?? effectivePriceCents(tier.listPriceCents, tier.discountPercent);
    return total + safeInteger(tier.plannedQuantity) * safeCents(price);
  }, 0) + safeCents(scenario.sponsorshipRevenueCents);

  const upsell = calculateUpsell(scenario.upsells);
  const totalGrossRevenueCents = principalGrossRevenueCents + upsell.gross + safeCents(scenario.otherRevenueCents);
  const lossesCents = percentOf(principalGrossRevenueCents, scenario.refundPercent);
  const paymentFeesCents = percentOf(totalGrossRevenueCents, scenario.defaultPaymentFeePercent);
  const taxesCents = percentOf(totalGrossRevenueCents, scenario.defaultTaxPercent);
  const netRevenueCents = Math.max(0, totalGrossRevenueCents - lossesCents - paymentFeesCents - taxesCents);
  const marketingCostsCents = sumAcquisitionBudget(scenario.acquisitionChannels);

  const costs = calculateCosts(scenario.costItems, {
    participants,
    grossRevenueCents: totalGrossRevenueCents,
    netRevenueCents,
    principalRevenueCents: principalGrossRevenueCents,
    upsellRevenueCents: upsell.gross
  });

  const totalCostsWithoutUpsellCents = costs.fixed + costs.variable + costs.percentage + marketingCostsCents + safeCents(scenario.contingencyCents);
  const totalCostsCents = totalCostsWithoutUpsellCents + upsell.costs;
  const netRevenueWithoutUpsellCents = Math.max(0, principalGrossRevenueCents - percentOf(principalGrossRevenueCents, scenario.refundPercent) - percentOf(principalGrossRevenueCents, scenario.defaultPaymentFeePercent) - percentOf(principalGrossRevenueCents, scenario.defaultTaxPercent));
  const operationalResultWithoutUpsellCents = netRevenueWithoutUpsellCents - totalCostsWithoutUpsellCents;
  const operationalResultWithUpsellCents = netRevenueCents - totalCostsCents;
  const investmentTotalCents = totalCostsCents || marketingCostsCents;
  const averageTicketCents = participants === 0 ? 0 : Math.round(principalGrossRevenueCents / participants);
  const variableCostPerParticipantCents = participants === 0 ? 0 : Math.round((costs.variable + costs.percentage) / participants);
  const netPrincipalPerPaidParticipantCents = participants === 0 ? 0 : Math.round(netRevenueWithoutUpsellCents / participants);
  const contributionUnitCents = netPrincipalPerPaidParticipantCents - variableCostPerParticipantCents;
  const breakEvenPaidParticipants = contributionUnitCents <= 0 ? safeInteger(scenario.capacity) + 1 : Math.ceil((costs.fixed + marketingCostsCents + safeCents(scenario.contingencyCents)) / contributionUnitCents);
  const sales = sumChannelSales(scenario.acquisitionChannels);
  const leads = sumPaidLeads(scenario.acquisitionChannels);
  const totalConversion = divide(sales, leads);

  const resultWithoutAlerts: Omit<ScenarioResult, 'alerts'> = {
    scenarioId: scenario.id,
    principalGrossRevenueCents,
    upsellGrossRevenueCents: upsell.gross,
    totalGrossRevenueCents,
    lossesCents,
    paymentFeesCents,
    taxesCents,
    netRevenueCents,
    fixedCostsCents: costs.fixed,
    variableCostsCents: costs.variable,
    percentageCostsCents: costs.percentage,
    marketingCostsCents,
    totalCostsCents,
    operationalResultWithoutUpsellCents,
    operationalResultWithUpsellCents,
    marginPercent: divide(operationalResultWithUpsellCents, netRevenueCents) * 100,
    roiPercent: divide(operationalResultWithUpsellCents, investmentTotalCents) * 100,
    roas: divide(sumAttributedRevenue(scenario.acquisitionChannels), marketingCostsCents),
    paidCacCents: sales === 0 ? 0 : Math.round(marketingCostsCents / sales),
    averageTicketCents,
    occupancyPercent: divide(participants + safeInteger(scenario.courtesySeats) + safeInteger(scenario.sponsoredSeats), scenario.capacity) * 100,
    breakEvenPaidParticipants,
    requiredLeads: totalConversion === 0 ? 0 : Math.ceil(Math.max(0, breakEvenPaidParticipants - sales) / totalConversion),
    calculatedAt: new Date().toISOString(),
    calculationVersion: CALCULATION_VERSION
  };

  return {
    ...resultWithoutAlerts,
    alerts: buildAlerts(scenario, resultWithoutAlerts)
  };
};

export const calculatePlanActualVariance = (planned: ScenarioResult, actuals: SimulationActuals): PlanActualVariance[] => {
  const moneyRows = [
    ['Receita recebida', planned.netRevenueCents, actuals.receivedRevenueCents],
    ['Marketing', planned.marketingCostsCents, actuals.marketingCents],
    ['Custos totais', planned.totalCostsCents, actuals.realCostsCents],
    ['Impostos', planned.taxesCents, actuals.taxesCents],
    ['Upsells', planned.upsellGrossRevenueCents, actuals.upsellRevenueCents],
    ['Resultado final', planned.operationalResultWithUpsellCents, actuals.finalResultCents]
  ] as const;

  const numberRows = [
    ['Pagantes', planned.breakEvenPaidParticipants, actuals.paidParticipants],
    ['Presentes', planned.breakEvenPaidParticipants, actuals.presentParticipants]
  ] as const;

  return [
    ...moneyRows.map(([label, plannedCents, actualCents]) => ({
      label,
      plannedCents,
      actualCents,
      absolute: actualCents - plannedCents,
      percent: divide(actualCents - plannedCents, plannedCents) * 100
    })),
    ...numberRows.map(([label, plannedNumber, actualNumber]) => ({
      label,
      plannedNumber,
      actualNumber,
      absolute: actualNumber - plannedNumber,
      percent: divide(actualNumber - plannedNumber, plannedNumber) * 100
    }))
  ];
};

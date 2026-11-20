/**
 * Zambian payroll arithmetic, for the calculator and the guides.
 *
 * A PORT, not a new implementation. Every rule here comes from
 * `Glamified HR V3/src/lib/zambian-compliance.ts`, which is what runs a
 * customer's payroll:
 *
 *   gross       = basic + allowances
 *   NAPSA       = 5% of min(gross, ceiling), employee and employer each
 *   NHIMA       = 1% of BASIC — allowances are outside the base
 *   PAYE        = the bands applied to gross; neither NAPSA nor NHIMA
 *                 reduces chargeable income (this follows ZRA's own calculator)
 *   net         = gross − (PAYE + employee NAPSA + employee NHIMA)
 *
 * Checked against a real payroll run: on gross K6,582.82 with basic K4,318.18
 * the software produces PAYE K296.56, NAPSA K329.14, NHIMA K43.18, and so does
 * this.
 *
 * The rates themselves are not here. They live in `site.config.js` under
 * `statutory`, so the site quotes one set of figures everywhere and a budget
 * change is an edit in one place.
 */

import type { PayeBand, Statutory } from "../types";

/** Two decimal places, the way money rounds. Matches the product's round2. */
const round2 = (value: number): number => Math.round(value * 100) / 100;

export interface BandCharge {
  band: PayeBand;
  /** Income falling inside this band. */
  taxable: number;
  /** Tax charged on it. */
  amount: number;
}

export interface Breakdown {
  basic: number;
  allowances: number;
  gross: number;
  paye: number;
  payeBands: BandCharge[];
  napsaEmployee: number;
  napsaEmployer: number;
  /** True once gross is above the ceiling, so NAPSA has stopped rising. */
  napsaCapped: boolean;
  nhimaEmployee: number;
  nhimaEmployer: number;
  totalDeductions: number;
  netPay: number;
  /** Gross plus the employer's own contributions. */
  employerCost: number;
}

/** PAYE on an income, band by band. */
export function payeFor(income: number, bands: PayeBand[]): BandCharge[] {
  const ordered = [...bands].sort((a, b) => a.from - b.from);
  return ordered.map((band) => {
    if (income <= band.from) return { band, taxable: 0, amount: 0 };
    const upper = band.to === null ? income : Math.min(income, band.to);
    const taxable = round2(upper - band.from);
    return { band, taxable, amount: round2(taxable * band.rate) };
  });
}

/** One employee, one month. */
export function calculate(
  basic: number,
  allowances: number,
  s: Statutory
): Breakdown {
  const safeBasic = Math.max(basic || 0, 0);
  const safeAllowances = Math.max(allowances || 0, 0);
  const gross = round2(safeBasic + safeAllowances);

  const pensionable = Math.min(gross, s.napsa.ceiling);
  const napsaEmployee = round2(pensionable * s.napsa.employeeRate);
  const napsaEmployer = round2(pensionable * s.napsa.employerRate);

  const nhimaEmployee = round2(safeBasic * s.nhima.employeeRate);
  const nhimaEmployer = round2(safeBasic * s.nhima.employerRate);

  const payeBands = payeFor(gross, s.paye.bands);
  const paye = round2(payeBands.reduce((sum, b) => sum + b.amount, 0));

  const totalDeductions = round2(paye + napsaEmployee + nhimaEmployee);

  return {
    basic: safeBasic,
    allowances: safeAllowances,
    gross,
    paye,
    payeBands,
    napsaEmployee,
    napsaEmployer,
    napsaCapped: gross > s.napsa.ceiling,
    nhimaEmployee,
    nhimaEmployer,
    totalDeductions,
    netPay: round2(gross - totalDeductions),
    employerCost: round2(gross + napsaEmployer + nhimaEmployer),
  };
}

/** "K6,582.82" — always two decimals, because these are money figures. */
export function kwacha(value: number): string {
  return `K${value.toLocaleString("en-ZM", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** "K5,100" — for thresholds, where the decimals are noise. */
export function kwachaRound(value: number): string {
  return `K${value.toLocaleString("en-ZM", { maximumFractionDigits: 0 })}`;
}

/** "20%" from 0.2. */
export function percent(rate: number): string {
  return `${Math.round(rate * 10000) / 100}%`;
}

/** "First K5,100", "K5,100 – K7,100", "Above K9,200". */
export function bandLabel(band: PayeBand, first: boolean): string {
  if (band.to === null) return `Above ${kwachaRound(band.from)}`;
  if (first) return `First ${kwachaRound(band.to)}`;
  return `${kwachaRound(band.from)} – ${kwachaRound(band.to)}`;
}

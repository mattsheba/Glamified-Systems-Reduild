/**
 * Payroll guides.
 *
 * DOCUMENTED FR-1 EXEMPTION, on the same grounds as src/content/legal.ts:
 * three long-form documents would otherwise sit in site.config.js and be
 * carried, unread, by every industry variant. The text is instead
 * *parameterised* by `config.statutory`, so a budget that moves the PAYE bands
 * or the NAPSA ceiling updates every sentence that quotes one.
 *
 * WHAT MAY BE WRITTEN HERE.
 *
 * Every statutory claim below is one the product itself implements, in
 * `Glamified HR V3/src/lib/zambian-compliance.ts` and
 * `.../terminal-benefits.ts`, including the sections of the Employment Code
 * Act those files cite. Nothing here was written from memory of Zambian tax
 * law, and nothing should be: if GlamifiedHR does not calculate it, this site
 * does not claim it. Deadlines in particular are deliberately absent — the
 * software tracks what you have marked as filed, it does not hold a calendar
 * of due dates, so the guides do not print any.
 */

import site from "../lib/site";
import { calculate, kwacha, kwachaRound, percent, bandLabel } from "../lib/payroll";

export interface Guide {
  slug: string;
  title: string;
  /** Shown under the title and used as the meta description fallback. */
  standfirst: string;
  /** Title tag. Leads with the search term, brand last. */
  seoTitle: string;
  seoDescription: string;
  /** One line on the card in the index. */
  summary: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const s = site.statutory;
const product = site.products[0]?.name ?? site.brand.name;

/*
 * Rendered into the prose, so a rate appears in one place in this repository.
 * Falls back to an empty document when a variant carries no statutory block —
 * the guides are Zambian payroll, and a lodge has no use for them.
 */
const bands = s?.paye.bands ?? [];
const bandLines = bands.map((band, i) => `${bandLabel(band, i === 0)} — ${percent(band.rate)}`);

const ceiling = s ? kwachaRound(s.napsa.ceiling) : "";
const napsaRate = s ? percent(s.napsa.employeeRate) : "";
const napsaMax = s ? kwacha(s.napsa.ceiling * s.napsa.employeeRate) : "";
const nhimaRate = s ? percent(s.nhima.employeeRate) : "";
const days = s?.workingDaysPerMonth ?? 22;
const act = s?.employmentAct ?? "the Employment Code Act";

/** The worked example, calculated rather than typed, so it cannot be wrong. */
const eg = s ? calculate(8000, 2000, s) : null;
const egBasic = kwachaRound(8000);
const egAllow = kwachaRound(2000);

const statutoryGuide: Guide = {
  slug: "paye-napsa-nhima-explained",
  title: "How PAYE, NAPSA and NHIMA are calculated in Zambia",
  seoTitle: "PAYE, NAPSA & NHIMA Explained — Zambian Payroll | GlamifiedHR",
  seoDescription:
    "What comes off a Zambian payslip and how each figure is worked out: PAYE on the current bands, NAPSA at 5% to the ceiling, and NHIMA on basic pay. With a worked example.",
  summary:
    "The three deductions, what each is charged on, and a payslip worked out line by line.",
  standfirst:
    "Three deductions, three different bases. Most payroll mistakes we are asked to fix come from applying one of them to the wrong figure.",
  sections: [
    {
      heading: "Start with gross pay",
      body: [
        `Gross pay is everything the employee earns for the month: basic salary plus housing, transport, lunch, medical, risk and any other allowance, plus overtime. It is the figure the payslip foots to and the one net pay is worked back from.`,
        `It is not, however, the base for all three deductions. PAYE and NAPSA are charged on gross. NHIMA is charged on basic salary alone. That single distinction is worth getting right before anything else, because an employee on a large housing allowance will be over-deducted all year if NHIMA is run on gross.`,
      ],
    },
    {
      heading: "PAYE",
      body: [
        `PAYE is charged band by band on gross pay. Each slice of income is taxed at its own rate, so a rise only ever taxes the part of the salary that crosses into the next band:`,
        ...bandLines,
        `Neither NAPSA nor NHIMA reduces chargeable income. This follows the ${s?.authority ?? "Zambia Revenue Authority"}'s own calculator: the contributions are separate deductions from pay, not reliefs against tax. If your spreadsheet subtracts NAPSA before applying the bands, it is under-deducting PAYE, and the shortfall is the employer's problem rather than the employee's.`,
        `The bands change with the national budget. What matters as much as the current figures is which set you apply to a given month: re-running a past period should use the rates that were in force then, not today's. ${product} stores the bands against the date they took effect for exactly that reason.`,
      ],
    },
    {
      heading: "NAPSA",
      body: [
        `NAPSA is ${napsaRate} from the employee and ${napsaRate} from the employer, charged on gross pay up to a monthly pensionable-earnings ceiling of ${ceiling}. Earnings above the ceiling are not assessed, so each side is capped at ${napsaMax} a month however large the salary is.`,
        `The ceiling changes every year, which is why it is a setting rather than something baked into the software. The rates themselves are fixed in law.`,
        `Both halves are remitted by the employer, and both appear on the NAPSA return. The employer's half is a cost of employment, not a deduction from the employee — it does not come off net pay.`,
      ],
    },
    {
      heading: "NHIMA",
      body: [
        `NHIMA is ${nhimaRate} from the employee and ${nhimaRate} from the employer, charged on basic salary. Allowances are outside the base, so a housing or transport allowance does not raise the contribution.`,
        `There is no ceiling. The contribution rises with basic pay without limit.`,
      ],
    },
    {
      heading: "A payslip, worked through",
      body: eg
        ? [
            `Take an employee on ${egBasic} basic with ${egAllow} of allowances. Gross pay is ${kwacha(eg.gross)}.`,
            `**PAYE.** The bands are applied to the whole ${kwacha(eg.gross)}: ${eg.payeBands
              .filter((charge) => charge.taxable > 0)
              .map(
                (charge) =>
                  `${kwacha(charge.taxable)} at ${percent(charge.band.rate)} is ${kwacha(charge.amount)}`
              )
              .join("; ")}. That totals ${kwacha(eg.paye)}.`,
            `**NAPSA.** ${kwacha(eg.gross)} is below the ${ceiling} ceiling, so the whole of it is pensionable: ${napsaRate} is ${kwacha(eg.napsaEmployee)} from the employee, and the employer pays the same again.`,
            `**NHIMA.** ${nhimaRate} of the ${egBasic} basic — not of gross — is ${kwacha(eg.nhimaEmployee)}, with the same again from the employer.`,
            `**Net pay.** ${kwacha(eg.gross)} less ${kwacha(eg.paye)}, ${kwacha(eg.napsaEmployee)} and ${kwacha(eg.nhimaEmployee)} leaves ${kwacha(eg.netPay)}.`,
            `**What it costs the employer.** ${kwacha(eg.gross)} of pay plus ${kwacha(eg.napsaEmployer)} of NAPSA and ${kwacha(eg.nhimaEmployer)} of NHIMA is ${kwacha(eg.employerCost)} — ${kwacha(eg.employerCost - eg.gross)} more than the salary on the contract.`,
          ]
        : [],
    },
    {
      heading: "The four mistakes we are asked to fix",
      body: [
        `**NHIMA charged on gross.** Costs the employee ${nhimaRate} of every allowance, every month, and nobody notices until someone checks a payslip against the rules.`,
        `**NAPSA deducted before PAYE.** Under-deducts tax. The ZRA does not treat the contribution as a relief.`,
        `**The ceiling left at last year's figure.** NAPSA stops rising at ${ceiling}; an out-of-date ceiling either over- or under-deducts for everyone above it.`,
        `**Today's bands applied to last year's payroll.** A re-run of a prior month must use the rates that applied in that month, or the figures no longer agree with what was filed.`,
      ],
    },
    {
      heading: "Where these figures come from",
      body: [
        `The rates on this page are the ones ${product} applies, and the calculator on this site runs the same arithmetic as the software does. They are published with the date they took effect so you can see what you are looking at.`,
        `They are not a substitute for the authority's own guidance. Confirm anything you are about to file with the ${s?.authority ?? "Zambia Revenue Authority"}, NAPSA or NHIMA.`,
      ],
    },
  ],
};

const terminalGuide: Guide = {
  slug: "terminal-benefits-zambia",
  title: "What an employee is owed when they leave",
  seoTitle: "Terminal Benefits in Zambia — Employment Code Act | GlamifiedHR",
  seoDescription:
    "Resignation, redundancy, end of contract or retirement: what each one entitles an employee to under Zambia's Employment Code Act, and how the figures are worked out.",
  summary:
    "Why the reason for leaving changes the figure, and what the Act sets as the minimum in each case.",
  standfirst: `Under ${act}, what a leaver is owed depends on why they are leaving. A single "terminal benefits" rate applied to everyone is the most expensive mistake in this part of payroll — in both directions.`,
  sections: [
    {
      heading: "The reason decides the entitlement",
      body: [
        `There is no one calculation. ${act} provides differently for each circumstance, and the first thing to settle is which one you are in:`,
        `**Resignation.** Outstanding salary to the last working day, and accrued leave paid out.`,
        `**End of a fixed-term contract.** Outstanding salary, leave pay, and gratuity.`,
        `**Termination by the employer.** Outstanding salary, leave pay, and pay in lieu of notice where notice was not given or worked.`,
        `**Redundancy.** Outstanding salary, leave pay, pay in lieu of notice, and a redundancy package.`,
        `**Retirement.** Outstanding salary, leave pay, and gratuity where it applies.`,
        `**Death in service.** The same as retirement, payable to the estate.`,
      ],
    },
    {
      heading: "Gratuity on a fixed-term contract",
      body: [
        `Section 73 of the Act sets a minimum gratuity of 25% of the basic pay earned over the term of the contract. It is a floor, not a rate to settle on: many contracts and collective agreements provide better, and where they do, the contract governs.`,
        `It is worked out on basic pay over the contract, which is why the start date and the last working day both matter — a contract that ran fourteen months is not the same calculation as one that ran twelve.`,
      ],
    },
    {
      heading: "Redundancy",
      body: [
        `Section 55 sets a minimum redundancy package of not less than two months' basic pay for every completed year of service. Part years do not count toward it, so the completed-years figure is the one to check.`,
        `Redundancy also attracts pay in lieu of notice where notice was not given — the package and the notice are separate amounts, and one does not absorb the other.`,
      ],
    },
    {
      heading: "Notice, leave and loans",
      body: [
        `**Notice.** Where the employer terminates or makes a position redundant without giving notice, a month's basic pay in lieu is the usual figure.`,
        `**Accrued leave.** Leave days still owed are paid out at a day's pay. A day's pay is basic salary divided by the working days in a month — ${days} in the default setting, which is what ${product} uses unless you change it.`,
        `**Outstanding loans and advances.** Anything still owed on a staff loan or salary advance is recovered from the final payment. Where the final payment does not cover it, the balance remains a debt and should be recorded as one rather than quietly written off.`,
      ],
    },
    {
      heading: "What gets taxed",
      body: [
        `The salary-type components — outstanding salary, leave pay and notice pay — are assessed for PAYE, NAPSA and NHIMA in the ordinary way, on the same bases as a monthly payroll.`,
        `Lump sums are not so simple. The treatment of gratuity and redundancy payments depends on the circumstances and on exemption limits, so ${product} does not auto-tax them: it calculates the gross figures, applies the statutory deductions to the salary-type amounts, and leaves the lump-sum treatment for you to confirm with the ZRA and enter. A payroll system that silently taxes a gratuity is guessing on your behalf.`,
      ],
    },
    {
      heading: "Minimums, not maximums",
      body: [
        `Everything above is the statutory floor. Contracts, collective agreements and long-standing practice frequently provide more, and where they do, the better term applies. Treat a calculated figure as a starting point to check against the contract in front of you, not as the answer.`,
        `Finish the file properly: a final payslip showing how the figure was reached, and a certificate of service. Both are ordinary requests months later, and both are much harder to produce after the fact.`,
      ],
    },
  ],
};

const returnsGuide: Guide = {
  slug: "napsa-nhima-paye-returns",
  title: "Filing the NAPSA, NHIMA and PAYE returns",
  seoTitle: "NAPSA, NHIMA & PAYE Returns in Zambia — How to File | GlamifiedHR",
  seoDescription:
    "What goes in each monthly return, which figure each portal wants, and how to produce the NAPSA iCare and eNHIMA upload files from your payroll.",
  summary:
    "What each portal expects, which figure it wants, and how to get the upload files out of a payroll run.",
  standfirst:
    "Three returns, three portals, three different bases. The arithmetic is the easy part; the time goes on assembling the files in the shape each one accepts.",
  sections: [
    {
      heading: "What each return is asking for",
      body: [
        `**${s?.napsa.label ?? "NAPSA"}.** Pensionable earnings per employee for the month, with the ${napsaRate} employee contribution, the ${napsaRate} employer contribution and the total for each person. Pensionable earnings are gross pay capped at the ${ceiling} ceiling, so for anyone above it the figure in the return is the ceiling, not their salary.`,
        `**${s?.nhima.label ?? "NHIMA"}.** Basic salary per employee, with ${nhimaRate} from each side. Allowances are not in this return at all, which is the usual reason an NHIMA return disagrees with a NAPSA return for the same month.`,
        `**PAYE.** Gross pay, the NAPSA and NHIMA deducted, the chargeable income and the tax, per employee, totalled for the filing.`,
      ],
    },
    {
      heading: "The upload files",
      body: [
        `${s?.napsa.portal ?? "The NAPSA portal"} and ${s?.nhima.portal ?? "the NHIMA portal"} both accept an upload rather than line-by-line entry, and each wants its own layout. The account number on the file is your company's — the NAPSA number for the first, the NHIMA employer identifier for the second — so both have to be set up once before a file will be accepted.`,
        `${product} produces both as CSVs in the layout the portals expect, from an approved payroll run, along with the PAYE figures for the ZRA filing. The alternative is a spreadsheet rebuilt by hand every month, which is where transposition errors come from.`,
      ],
    },
    {
      heading: "Keeping track of what has been filed",
      body: [
        `Nothing in this guide tells you when a return is due. Deadlines are set by the authorities and change; check them with the ZRA, NAPSA and NHIMA rather than with a payroll vendor, and build your calendar from what they publish.`,
        `What you can control is knowing where you stand. ${product} shows each month's returns as filed or outstanding and counts the ones still open on its dashboard, so "did we submit NHIMA for August" is a question you can answer by looking rather than by asking three people.`,
      ],
    },
    {
      heading: "Before you file",
      body: [
        `Check the headcount in the return against the payroll run it came from — a starter added after the run, or a leaver processed in the wrong month, shows up here first.`,
        `Check anyone above the NAPSA ceiling: their pensionable earnings should read ${ceiling}, not their gross.`,
        `Check that the NHIMA figures track basic pay rather than gross. If the two returns move together when an allowance changes, something is assessed on the wrong base.`,
        `Keep the approved run. Once a payroll has been approved its figures are what you filed, and a system that lets a past month be edited after the fact leaves you unable to reconcile a query six months later.`,
      ],
    },
  ],
};

/** Newest first is not meaningful here; this is the order they should be read. */
export const guides: Guide[] = s
  ? [statutoryGuide, terminalGuide, returnsGuide]
  : [];

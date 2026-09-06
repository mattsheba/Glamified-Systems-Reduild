/**
 * Legal page templates.
 *
 * DOCUMENTED FR-1 EXEMPTION. Legal boilerplate lives in the engine rather than
 * in site.config.js on purpose: twenty industry variants would otherwise each
 * carry an identical copy of the same three documents. The text is instead
 * *parameterised* by config (FR-11), so changing brand.name or contact.email
 * updates every clause.
 *
 * ⚠ These are STARTING POINTS, not legal advice. They have not been reviewed by
 * a lawyer and are written against Zambian general practice. Have them checked
 * before any client site goes live — the prior audit flagged their absence, and
 * shipping wrong ones is worse than shipping none.
 */

import site from "../lib/site";

export interface LegalDoc {
  slug: string;
  title: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const name = site.legal.registeredName;
const email = site.contact.email;
const city = site.contact.city;
const jurisdiction = site.legal.jurisdiction;

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy policy",
  sections: [
    {
      heading: "What we collect",
      body: [
        `When you contact ${name} through this site, whether by enquiry form, email, phone or WhatsApp, we collect the details you choose to give us: your name, email address, phone number, organisation and the content of your message.`,
        "We do not collect payment details through this website.",
      ],
    },
    {
      heading: "Why we hold it",
      body: [
        `We use these details only to respond to your enquiry and to provide services you ask us for. We do not sell them, and we do not share them with third parties except where we need a service provider to deliver something you have asked for.`,
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Enquiry records are kept for as long as we have an active or prospective working relationship with you, and are deleted on request.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Write to ${email} and we will respond within a reasonable period.`,
      ],
    },
    {
      heading: "Contact",
      body: [`${name}, ${city}. Questions about this policy: ${email}.`],
    },
  ],
};

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of service",
  sections: [
    {
      heading: "Who these terms are between",
      body: [
        `These terms govern your use of this website and any services you engage ${name} to provide. Project-specific work is additionally governed by a written scope agreed with you in advance, which takes precedence over these terms where the two differ.`,
      ],
    },
    {
      heading: "Quotes and scope",
      body: [
        "Quotes are valid for 30 days unless stated otherwise. Work begins once scope and payment terms are agreed in writing. Changes to an agreed scope may change the price and the timeline, and we will tell you before doing that work.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "On full payment, you own the deliverables produced specifically for you. We retain ownership of our underlying tools, libraries and templates, and of anything built before or outside your engagement.",
      ],
    },
    {
      heading: "Liability",
      body: [
        `To the extent permitted by the law of ${jurisdiction}, our liability in connection with any engagement is limited to the fees paid for that engagement.`,
      ],
    },
    {
      heading: "Governing law",
      body: [`These terms are governed by the law of ${jurisdiction}.`],
    },
  ],
};

export const refund: LegalDoc = {
  slug: "refund",
  title: "Refund policy",
  sections: [
    {
      heading: "Deposits",
      body: [
        "Project deposits secure a place in our schedule and cover work started. Where no work has begun, a deposit is refundable in full within 7 days of payment.",
      ],
    },
    {
      heading: "Work in progress",
      body: [
        "If you end a project after work has started, you are charged for work completed to that point and the balance is returned to you. We will provide a written breakdown of what has been done.",
      ],
    },
    {
      heading: "Subscriptions and support",
      body: [
        "Monthly support and hosting are billed in advance and can be cancelled at any time, taking effect at the end of the paid period. We do not pro-rate part months.",
      ],
    },
    {
      heading: "How to ask",
      body: [`Email ${email} with your project reference. We respond within one working day.`],
    },
  ],
};

export const legalDocs: LegalDoc[] = [privacy, terms, refund];

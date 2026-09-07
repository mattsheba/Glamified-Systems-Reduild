/**
 * Legal pages.
 *
 * DOCUMENTED FR-1 EXEMPTION. Legal text lives in the engine rather than in
 * site.config.js on purpose: twenty industry variants would otherwise each carry
 * an identical copy of the same three documents. The text is instead
 * *parameterised* by config (FR-11), so changing legal.registeredName,
 * contact.email or legal.jurisdiction updates every clause that mentions them.
 *
 * Written specifically for how Glamified Systems actually operates: desktop
 * software that keeps client data on the client's own machine, a 30-day trial
 * before purchase, and consultancy work that involves filing with Zambian
 * statutory bodies on a client's behalf. A variant selling something else will
 * need these revisited, particularly the software licence and refund clauses.
 */

import site from "../lib/site";

export interface LegalDoc {
  slug: string;
  title: string;
  standfirst?: string;
  sections: Array<{ heading: string; body: string[] }>;
}

const name = site.legal.registeredName;
const email = site.contact.email;
const phone = site.contact.phone;
const phoneAlt = site.contact.phoneAlt;
// Both numbers, so a reader is never left with the one that is engaged.
const phones = [phone, phoneAlt].filter(Boolean).join(" or ");
const city = site.contact.city;
const jurisdiction = site.legal.jurisdiction;
const office = site.legal.registeredOffice;
const dpa = site.legal.dataProtectionAct ?? "applicable data protection law";

/**
 * "Glamified Systems Limited of Lusaka, Zambia".
 *
 * The TPIN is deliberately not included. A tax number is not needed to identify
 * the contracting party in these documents, and publishing one in a contract
 * invites it being quoted back in places it was never checked against.
 */
const identity = [name, `of ${office ?? city}`].filter(Boolean).join(" ");

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy policy",
  standfirst: `How ${name} handles personal information, and the parts of our software that never send it to us at all.`,
  sections: [
    {
      heading: "Who we are",
      body: [
        `${identity} is the data controller for the personal information described in this policy. We are contactable at ${email}, and on ${phones}.`,
      ],
    },
    {
      heading: "What this policy covers",
      body: [
        "This policy covers information collected through this website, and information we handle when providing services to you.",
        "It also explains, in the section below, the significant category of information we do not receive at all.",
      ],
    },
    {
      heading: "What our software does not send us",
      body: [
        "GlamifiedHR, GlamifiedSales and GlamifiedFleet are desktop applications. They run on your own computer and store their data there, in a database on that machine.",
        "Your payroll figures, employee records, customer details, invoices and vehicle costs are not transmitted to us, are not stored on our servers, and are not accessible to us. We cannot read them, and we cannot produce them if asked to.",
        "The practical consequence is that you remain the controller of that data. Backing it up, restricting who can open the machine, and deciding how long to keep it are yours to manage.",
      ],
    },
    {
      heading: "Information we collect through this website",
      body: [
        `When you contact us by enquiry form, email, phone or WhatsApp, we receive what you choose to send: typically your name, email address, phone number, organisation, and the content of your message.`,
        "The website sets no advertising or tracking cookies. It stores one item in your browser to remember whether you chose the light or dark theme; that stays on your device and is never sent to us.",
        "We do not take payment through this website, so no card or bank details are collected here.",
      ],
    },
    {
      heading: "Information we handle when delivering services",
      body: [
        "Some of our services require us to handle personal information belonging to you or to your staff. Where that happens we act on your instructions, as a processor rather than a controller.",
        "Payroll outsourcing requires employee names, NRC numbers, NAPSA and NHIMA numbers, TPINs, salaries and bank details, so that payroll can be run and statutory returns filed.",
        "Business registration and compliance work requires director and shareholder details, identity documents and company records, so that filings can be submitted to the relevant authority.",
        "IT support may give us incidental access to files on a machine we are repairing. We look only at what the fault requires, and we do not copy your data off the machine unless you have asked us to recover it.",
      ],
    },
    {
      heading: "Why we are allowed to hold it",
      body: [
        "We hold enquiry information because you asked us to respond to you. We hold service information because it is necessary to perform the contract you have with us, or to meet an obligation the law places on us or on you.",
        "We do not sell personal information, and we do not use it to advertise to you.",
      ],
    },
    {
      heading: "Who else sees it",
      body: [
        "Statutory bodies, where you have engaged us to file on your behalf. That includes PACRA, the Zambia Revenue Authority, NAPSA, NHIMA, the Workers' Compensation Fund Control Board, ZPPA, NCC, EIZ, ZDA and local councils, depending on the work.",
        "Service providers who host this website and deliver our software downloads. They hold technical records such as IP addresses in the ordinary course of serving a page or a file.",
        "Nobody else, unless the law requires it of us.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Enquiries that do not become work are kept while there is a realistic prospect of working together, and deleted after that.",
        "Records connected to work we have done are kept for as long as the law requires them to be kept, which for tax and company records in Zambia is generally several years, and then deleted.",
        "You can ask us to delete anything we are not legally required to retain.",
      ],
    },
    {
      heading: "How we protect it",
      body: [
        "Access is limited to the people doing the work. Devices holding client information are password protected. Information sent to statutory bodies goes through their own portals rather than by open email where a portal exists.",
        "No system is perfectly secure. If a breach occurred that was likely to affect your rights, we would tell you and the relevant authority.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `Under ${dpa} you may ask what we hold about you, ask us to correct it, ask us to delete it, object to how we are using it, or ask for a copy in a portable form.`,
        `Write to ${email} and we will respond within one month. There is no charge for a reasonable request.`,
        "If you are not satisfied with our response, you may complain to the data protection authority in Zambia.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        `This policy was last updated on ${site.legal.lastUpdated}. Where we change it materially we will say so on this page.`,
      ],
    },
    {
      heading: "Contact",
      body: [
        `${name}, ${office ?? city}. Questions about this policy, or any request about your information: ${email}, or ${phones}.`,
      ],
    },
  ],
};

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of service",
  standfirst: `The terms on which ${name} licenses its software and provides services.`,
  sections: [
    {
      heading: "Who these terms are between",
      body: [
        `These terms are between you and ${identity}.`,
        "They govern your use of this website, your use of software licensed from us, and any services you engage us to provide. Where we agree a written scope for a project, that scope takes precedence over these terms if the two differ.",
      ],
    },
    {
      heading: "Using this website",
      body: [
        "You may read this site, download our software, and contact us through it. You may not attempt to disrupt it, or use it to send unlawful or abusive material.",
        "Product descriptions and prices on this site are provided in good faith. Prices are in Zambian Kwacha and may change; the price that applies is the one on the invoice we issue you.",
      ],
    },
    {
      heading: "Software licences",
      body: [
        "Our products are licensed, not sold. Paying for a licence gives you a perpetual right to use that version of the software for your own business. It does not transfer ownership of the software itself.",
        "A licence is issued to the business named on the invoice, and is activated with a licence key we supply. You may not resell, sublicense, rent out or redistribute the software or your key.",
        "Each product runs free for 30 days from installation so that you can evaluate it on your own data before buying. After 30 days it requires a valid licence key to continue running.",
        "You may not decompile or reverse engineer the software except to the extent the law expressly permits despite this restriction.",
      ],
    },
    {
      heading: "Updates and statutory changes",
      body: [
        "Our payroll and invoicing products calculate against Zambian statutory rules, and those rules change. Where rates or thresholds change we issue an update.",
        "We take reasonable care that these calculations are correct, but responsibility for what you file and what you pay remains yours. Check figures against the current guidance from the relevant authority before relying on them, particularly after a statutory change.",
      ],
    },
    {
      heading: "Your data and your backups",
      body: [
        "Our desktop products store your data on your own machine, so we hold no copy of it and cannot retrieve it for you if that machine is lost, stolen or damaged.",
        "Each product includes backup and restore. A backup is a single file you can keep on a memory stick or in any cloud folder you already use, and the software warns you when one is overdue. Taking those backups, and keeping a copy somewhere other than the machine itself, remains yours to do.",
        "We are not liable for data lost where no backup existed.",
      ],
    },
    {
      heading: "Services and project work",
      body: [
        "Quotes are valid for 30 days unless stated otherwise. Work starts once the scope and the payment terms are agreed in writing.",
        "Changes to an agreed scope may change the price and the timeline. We will tell you what a change costs before doing that work, not after.",
        "Where we act for you with a statutory body, you remain responsible for the accuracy of the information you give us, and for meeting any deadline that the law places on you rather than on us.",
      ],
    },
    {
      heading: "Fees and payment",
      body: [
        "Invoices are payable by the date shown on them. Statutory fees and disbursements we pay on your behalf are charged on to you at cost.",
        "We may pause work on an overdue account after telling you first.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "On full payment you own the deliverables produced specifically for you.",
        "We keep ownership of our own software, tools, libraries and templates, including anything that existed before your engagement or was built outside it. Where an agreement includes source files, that is stated in the written scope.",
      ],
    },
    {
      heading: "What we do not warrant",
      body: [
        "We provide our software and services with reasonable skill and care. We do not warrant that any software is free of every defect, or that it will be uninterrupted.",
        "Nothing in these terms excludes liability that cannot lawfully be excluded, including for death or personal injury caused by negligence, or for fraud.",
      ],
    },
    {
      heading: "Liability",
      body: [
        `Subject to the paragraph above, and to the extent permitted by the law of ${jurisdiction}, our total liability in connection with an engagement is limited to the fees paid to us for that engagement.`,
        "We are not liable for loss of profit, loss of business, or loss of data where a backup was available and not kept.",
      ],
    },
    {
      heading: "Ending an engagement",
      body: [
        "Either of us may end a project engagement in writing. You are charged for work completed up to that point, and we hand over what has been paid for. The refund policy sets out how any balance is returned.",
        "A perpetual software licence is not affected by ending a services engagement.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        `These terms are governed by the law of ${jurisdiction}, and the courts of ${jurisdiction} have exclusive jurisdiction over any dispute arising from them.`,
        `Last updated ${site.legal.lastUpdated}.`,
      ],
    },
  ],
};

export const refund: LegalDoc = {
  slug: "refund",
  title: "Refund policy",
  standfirst:
    "What is refundable, what is not, and how to ask. Written to be read before you buy rather than after.",
  sections: [
    {
      heading: "Software licences",
      body: [
        "Every product runs free for 30 days before it needs a licence key. That trial is the intended way to decide whether the software suits your business, on your own data, at no cost and no risk.",
        "Because of that, a licence fee is not generally refundable once a key has been issued. The software is not a subscription, so there is nothing to cancel.",
        "If the software does not do something we told you it does, tell us. We will fix it, or refund the licence fee in full.",
      ],
    },
    {
      heading: "Project deposits",
      body: [
        "A deposit secures a place in our schedule and covers work started. Where we have not yet begun, a deposit is refundable in full if you tell us within 7 days of paying it.",
      ],
    },
    {
      heading: "Work already started",
      body: [
        "If you end a project after work has begun, you are charged for the work completed to that point and the balance is returned to you.",
        "We provide a written breakdown of what was done and what it cost, so the figure is checkable rather than asserted.",
      ],
    },
    {
      heading: "Support and retainers",
      body: [
        "Support and hosting arrangements are billed in advance and can be stopped at any time, taking effect at the end of the period already paid for. Part months are not pro-rated.",
      ],
    },
    {
      heading: "Statutory fees paid on your behalf",
      body: [
        "Fees paid to PACRA, the Zambia Revenue Authority, NAPSA, NHIMA, a council or any other authority are not ours to refund once they have been paid over. That applies even where an application is later refused.",
        "Our own fee for handling the work is treated as project work under the sections above.",
      ],
    },
    {
      heading: "How to ask",
      body: [
        `Email ${email} with your invoice number and what you would like refunded, or call ${phones}. We reply within one working day and aim to resolve a request within seven.`,
      ],
    },
    {
      heading: "How refunds are paid",
      body: [
        "Refunds are returned by the route the payment arrived on, usually bank transfer or mobile money, to an account in the paying party's name. We do not refund to a third party.",
        `Last updated ${site.legal.lastUpdated}.`,
      ],
    },
  ],
};

export const legalDocs: LegalDoc[] = [privacy, terms, refund];

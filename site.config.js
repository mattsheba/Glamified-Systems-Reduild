/**
 * The engine.
 *
 * Every user-visible string and every image path on this site comes from this
 * file (FR-1, FR-2). A new industry variant is this file plus a folder of images
 * — no .astro, .css or .ts edits (FR-3). If you find yourself opening a
 * component to change wording, the engine has sprung a leak; add the field here.
 *
 * Contract: specs/glamified-site.md, "API Contracts".
 *
 * Product copy is drawn from each product's own documentation under
 * ../SOFTWARES/<product>/. Product images are still placeholders.
 */

export default {
  brand: {
    name: "Glamified Systems",
    tagline: "Compliant by default. Offline by design.",
    accent: "#006C90",
    logo: "/images/brand/logo.webp",
    mark: "/images/brand/mark.webp",
    favicon: "/favicon.svg",
  },

  contact: {
    phone: "+260 977 669 883",
    phoneAlt: "+260 770 029 595",
    whatsapp: "260977669883",
    // Used by every WhatsApp button on the site: the floating one, the product
    // and service pages, and the hero's secondary action.
    ctaLabel: "Chat on WhatsApp",
    whatsappMessage:
      "Hello Glamified Systems. I'd like to talk about a project.",
    email: "info.glamifiedsystems@gmail.com",
    city: "Lusaka, Zambia",
    hours: "Mon–Fri, 08:00–17:00 CAT",
  },

  // Real pages, not on-page anchors. `childrenFrom` builds the dropdown from
  // products[] / services[] at build time, so adding a product adds a menu
  // entry — there is no second list to keep in step.
  nav: [
    { label: "Products", href: "/products", childrenFrom: "products" },
    { label: "Services", href: "/services", childrenFrom: "services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  // Homepage composition. Order here IS render order; delete an entry to drop
  // the section (FR-7). Detail lives on the dedicated pages below.
  sections: [
    { key: "hero" },
    { key: "proofStrip", mode: "inverse" },
    { key: "logoMarquee", mode: "light", heading: "Trusted by" },
    { key: "products", heading: "Three systems, in production" },
    { key: "services", heading: "And the work around them" },
    { key: "proof", heading: "What our clients say" },
    { key: "custom", heading: "Don't see your business here?" },
    { key: "process", heading: "How we build" },
    // Pinned light: the footer is an inverse band, and an inverse FAQ above it
    // ran the two together with no visible boundary.
    { key: "faq", mode: "light" },
  ],

  // Per-page copy for the standalone routes.
  pages: {
    products: {
      heading: "Our products",
      seo: {
        title: "Business Software for Zambian Companies | Glamified Systems",
        description:
          "Payroll, invoicing and fleet management software built for Zambian businesses. Statutory calculations to current ZRA rules, and every system runs offline.",
      },
      standfirst:
        "Three systems in production with Zambian businesses. Each runs on your own machine, offline, because a system that stops when the line goes down is not a system.",
    },
    services: {
      heading: "Services",
      seo: {
        title: "Software, IT Support & Payroll Services in Lusaka, Zambia",
        description:
          "Software development, IT support, business consultancy, payroll outsourcing and graphic design for organisations in Lusaka and across Zambia.",
      },
      standfirst:
        "The work around the software, and the work that has nothing to do with it.",
      forWhoLabel: "Who this is for",
      otherServicesLabel: "Other services",
    },
    about: {
      heading: "About Glamified Systems",
      standfirst:
        "Technology built around the way Zambian businesses actually work.",
      body: [
        "Glamified Systems is a Zambian technology and business solutions company based in Lusaka. We develop practical digital systems, websites and business solutions that help organisations manage their operations more efficiently, make better decisions and grow with confidence.",
        "Our approach is simple: **understand the business first, then build the technology around it.**",
        "We develop customised business systems for different industries and operational needs, including **HR and payroll, fleet management, sales and invoicing, loan management, property management, hospitality, asset management, procurement, approvals and other business processes.** We also design and develop professional websites that help businesses establish a stronger digital presence.",
        "Alongside technology, we provide selected business support services including **PACRA, ZRA, ZPPA, ZDA and NAPSA-related services, business registrations, filings, graphic design, digital marketing and other professional services.** This allows our clients to access both the technology and practical business support they need from one trusted partner.",
      ],
      sections: [
        {
          title: "Products built for Zambia",
          body: [
            "Our own software products are designed around real business requirements, not generic templates.",
            "**Glamified HR** is built to support employee management and payroll requirements relevant to Zambian businesses, including statutory considerations such as PAYE, NAPSA and NHIMA.",
            "**Glamified Sales** helps businesses create and manage professional sales documents while supporting requirements around **ZRA Smart Invoice**.",
            "**Glamified Fleet** helps businesses understand the real cost of operating their vehicles, including fuel, maintenance and other running costs, so that fleet decisions can be based on actual figures rather than guesswork.",
            "These products come from problems we have encountered while working with businesses, and our goal is to turn those problems into reliable, usable software.",
          ],
        },
        {
          title: "More than software",
          // Renders in the right column, filling the space under facts and values.
          aside: true,
          body: [
            "We understand that running a business involves much more than software.",
            "A growing company may need a website, an HR system, a PACRA filing, branded documents, digital marketing or help setting up its business operations. Instead of treating these as completely separate problems, Glamified Systems brings technology and professional business services together under one roof.",
            "We are a growing company, and we value being close to our clients. When you contact Glamified Systems, you are dealing with people who understand the solution being offered and are directly involved in delivering it.",
            "**We build the systems businesses need, provide the services that support them, and keep our solutions practical, accessible and relevant to the Zambian market.**",
          ],
        },
      ],
      values: [
        {
          title: "Offline first",
          detail:
            "Our systems run without internet. Nothing is lost when the line goes down.",
          icon: "offline",
        },
        {
          title: "Built for Zambian rules",
          detail:
            "PAYE, NAPSA, NHIMA, ZRA Smart Invoice, NRC validation, ZMW. Compliance is not an add-on module.",
          icon: "shield",
        },
        {
          title: "Supported by the people who built it",
          detail:
            "Support comes from us, not a reseller. The person answering has read the code.",
          icon: "users",
        },
      ],
    },
    paymentSuccess: {
      heading: "Thank you, your payment is being confirmed",
      standfirst:
        "You have been returned from the payment gateway. We confirm every payment before issuing a licence key.",
      body: [
        "Once the payment clears we email your licence key to the address you gave at checkout. That is usually within a few hours during working hours.",
        "If you have not heard from us by the next working day, send us the payment reference on WhatsApp and we will look it up.",
      ],
    },
    thankYou: {
      heading: "Thank you, we have your enquiry",
      standfirst:
        "We reply within one working day. If it is urgent, WhatsApp reaches us faster than email.",
    },
    notFound: {
      heading: "That page does not exist",
      standfirst:
        "The address may have changed, or it may have been mistyped. Everything the site holds is below.",
    },
    contact: {
      heading: "Talk to us",
      standfirst:
        "WhatsApp is fastest. For anything larger, the form below reaches us directly.",
    },
  },

  /**
   * Installer hosting. The bucket is Cloudflare R2, served from a custom domain.
   * `baseUrl` is the only place the host appears, with no trailing slash.
   *
   * Run `npm run verify:downloads` after uploading a new installer. Nothing
   * else in the build can tell whether a file really exists in the bucket.
   */
  /*
   * Online payment via Lenco.
   *
   * `enabled` is the safety catch. While it is false no buy button renders and
   * the functions refuse to run, so the code can ship and be reviewed before a
   * single real transaction is possible. Turn it on only after a sandbox
   * payment has been taken and the webhook confirmed.
   *
   * Prices are NOT repeated here. The functions read them from products[], so a
   * price change cannot leave the checkout charging the old amount. The
   * previous implementation hardcoded them and drifted.
   */
  payments: {
    enabled: false,
    provider: "lenco",
    label: "Buy now",
    confirmLabel: "Continue to payment",
    note: "Pay by Airtel Money, MTN Money or card. Your licence key is sent by email once payment clears.",
    successPath: "/payment-success",
    currency: "ZMW",
    methods: ["airtel", "mtn", "card"],
  },

  /*
   * Shown on every product page, under the capability lists.
   *
   * "Your data stays on your machine" is the strongest thing these products
   * say, and it immediately raises the question it does not answer: what
   * happens when that machine dies. Leaving that unanswered is what loses a
   * payroll sale, so it gets a section rather than a line in the FAQ.
   *
   * Everything here is drawn from the products' own user guides. Do not add a
   * claim the software does not actually make.
   */
  /*
   * What the licence fee buys, shown beside the price.
   *
   * Every line here is something the site already commits to elsewhere: the
   * migration and training come from the FAQ, the guide from the download
   * block. Nothing has been added to make the offer look fuller than it is.
   * CONFIRM before adding anything to this list.
   */
  /*
   * Sits between the products and the process. Without it the homepage says
   * "we sell three things" and stops, when the larger part of the business is
   * building systems that do not exist yet.
   */
  custom: {
    standfirst:
      "These are the systems we have already turned into products. If your operation works differently, we build around your workflow rather than bending the work to fit software bought off a shelf.",
    examples: [
      "Loan management",
      "Property management",
      "Hospitality",
      "Asset registers",
      "Procurement",
      "Approvals",
    ],
    cta: { label: "How we build custom systems", href: "/services/web-software-development" },
  },

  licenceIncludes: {
    label: "What the licence includes",
    items: [
      "The software, licensed to your business",
      "Installation on your machine",
      "Migration of your existing records from spreadsheets",
      "Staff training and a handover document",
      "Updates when statutory rates change",
      "The user guide",
      "Support afterwards, from the people who built it",
    ],
  },

  dataSafety: {
    heading: "Offline does not mean unprotected",
    standfirst:
      "Your records live on your own computer, which is the point. Here is what keeps them safe there.",
    points: [
      {
        title: "Backup and restore is built in",
        detail:
          "Settings, then Backup and Restore. Click Back up now, choose a folder, and you have a backup. Restoring is the same file going back the other way.",
      },
      {
        title: "One file, so it goes anywhere",
        detail:
          "A backup is a single file. Put it on a memory stick, or in Google Drive, OneDrive or Dropbox exactly as you would any other document. Nothing new to learn and nothing new to pay for.",
      },
      {
        title: "The software tells you when you are overdue",
        detail:
          "If a backup has not been taken for a while a warning appears at the top of the screen, so a forgotten backup does not stay forgotten.",
      },
      {
        title: "Moving to a new computer is a backup and a restore",
        detail:
          "Take a backup on the old machine, install on the new one, restore the file. Hardware failure is a bad day rather than a lost year.",
      },
      {
        title: "Your data is never locked to a licence",
        detail:
          "Backups keep working even after a licence has expired. Your records are yours, and a lapsed key never holds them hostage.",
      },
      {
        title: "We can set the routine up with you",
        detail:
          "Deployment includes showing your staff how and when to back up. For payroll we suggest a backup at every run and a copy kept off the machine.",
      },
    ],
  },

  downloads: {
    baseUrl: "https://downloads.glamifiedsystems.com",
    label: "Download for Windows",
    note: "Windows 10 and 11",
    trial: "Runs free for 30 days. After that it needs a licence key.",
    guideLabel: "User guide (PDF)",
  },

  hero: {
    headline: "Software for the work your business actually does",
    /*
     * The sectors line. Set as its own field rather than folded into the
     * standfirst because it reads as a list, not a sentence, and it is styled
     * as one. It is also the fastest way for a visitor to find themselves on
     * the page: most people are scanning for their own word.
     */
    capabilities: [
      "Payroll",
      "HR",
      "Loans",
      "Fleet",
      "Invoicing",
      "Property",
      "School",
    ],
    standfirst:
      "Business systems built for Zambian businesses, with offline-first operations and local statutory requirements in mind.",
    primaryCta: { label: "Browse our software", type: "link", href: "/products" },
    secondaryCta: { label: "Chat on WhatsApp", type: "whatsapp" },
    image: "/images/brand/hero-desk.webp",
  },

  products: [
    {
      slug: "glamified-hr",
      name: "GlamifiedHR",
      // The H1 leads with the problem, not the product name. Nobody searches
      // "GlamifiedHR" unless they already know it exists.
      headline: "Payroll that follows Zambian law, not a spreadsheet",
      seo: {
        title: "Payroll & HR Software for Zambian Businesses | GlamifiedHR",
        description:
          "Payroll software built for Zambia. PAYE, NAPSA and NHIMA calculated automatically to current ZRA rules, with statutory returns ready to file. Runs offline.",
        // The live site ranks on this URL — keep it working (see public/_redirects).
        previousPath: "/glamifiedhr",
      },
      price: { amount: 15000, currency: "ZMW", note: "One-time licence. No subscription." },
      summary:
        "HR and payroll for Zambian businesses, with NAPSA, PAYE and NHIMA calculated for you.",
      description:
        "GlamifiedHR runs the whole employment cycle: staff records, leave and attendance, monthly payroll with statutory deductions calculated against current Zambia Revenue Authority rules, and separations with terminal benefits worked out under the Employment Code Act. Statutory returns come out the other end, including the upload files the NAPSA and NHIMA portals expect.\n\nIt runs as a desktop application on your own machine. Your payroll data never leaves the building, and a bad line does not stop you paying people.",
      image: "/images/products/glamified-hr.webp",
      download: {
        // Must match the object key in the R2 bucket exactly, including the
        // extension. The bucket holds the .zip, not the bare .exe.
        file: "GlamifiedHR-Setup-1.0.0.zip",
        version: "1.0.0",
        size: "119 MB",
        platform: "Windows 10 and 11",
      },
      guide: { file: "GlamifiedHR-User-Guide-1.0.0.pdf" },
      features: [
        "PAYE, NAPSA and NHIMA to current ZRA rules",
        "Leave, attendance and separations",
        "Statutory returns ready to file",
        "Runs offline on your own machine",
      ],
      groups: [
        {
          title: "Employees and departments",
          items: [
            "Full staff records: NRC, NAPSA number, TPIN, department, position, bank details, salary and allowances",
            "Departments with codes, used for grouping and headcount",
            "Contract types, job titles and reporting lines",
            "Document notes against each employee",
            "Bulk import from a spreadsheet, with the columns it recognises listed in the guide",
          ],
        },
        {
          title: "Leave and attendance",
          items: [
            "Leave types with monthly accrual rules you define",
            "Leave requests recorded and tracked, with accrued, used and remaining balances printed on every payslip",
            "Attendance capture, with absence deductions feeding straight into payroll",
            "Public holidays and working patterns",
          ],
        },
        {
          title: "Payroll",
          items: [
            "Monthly payroll runs with a full audit trail",
            "PAYE calculated against the current tax bands",
            "NAPSA and NHIMA calculated to current rules, employer and employee portions",
            "Additional pension schemes, with control over who is in and how it is calculated",
            "Allowances, deductions, loans and advances",
            "Payslips as PDF, printed or sent",
          ],
        },
        {
          title: "Separations and terminal benefits",
          items: [
            "Resignation, dismissal, redundancy, end of contract and retirement",
            "Terminal benefits calculated under the Employment Code Act",
            "Leave days paid out on separation",
            "Final payslip and certificate of service",
          ],
        },
        {
          title: "Statutory returns",
          items: [
            "PAYE return figures for the ZRA filing",
            "NAPSA upload file in the format the portal expects",
            "NHIMA upload file in the format the portal expects",
            "Monthly summaries by department and by employee",
          ],
        },
        {
          title: "Running it",
          items: [
            "Desktop application, works with no internet connection",
            "User accounts with roles, so payroll is not open to everyone",
            "Data stored on your own machine, backed up on your own terms",
            "Licence editions, with a clear warning before a term runs out",
          ],
        },
      ],
    },

    {
      slug: "glamified-sales",
      name: "GlamifiedSales",
      headline: "Quotations, invoices and receipts that reconcile themselves",
      seo: {
        title: "Invoicing & Quotation Software in Zambia | GlamifiedSales",
        description:
          "Business document software for Zambian companies. Quotations, invoices, receipts and delivery notes, with ZRA Smart Invoice support. Works offline.",
        previousPath: "/glamifiedsales",
      },
      price: { amount: 1800, currency: "ZMW", note: "One-time licence. No subscription." },
      summary:
        "Quotations, invoices, receipts and delivery notes, linked to each other and to the customer.",
      description:
        "GlamifiedSales replaces the quotation book and the separate invoice pad. A quotation becomes an invoice in one step, a receipt stays linked to the invoice it settles, and what a customer still owes is a number you can look up rather than work out.\n\nIt runs on your own machine and keeps working without a connection, which matters when a customer is standing in front of you.",
      image: "/images/products/glamified-sales.webp",
      download: {
        file: "GlamifiedSales-Setup-1.3.0.zip",
        version: "1.3.0",
        size: "94 MB",
        platform: "Windows 10 and 11",
      },
      // Uncomment once the file is in the bucket, then run:
      //   npm run verify:downloads
      // It returns 404 today, and a guide link that 404s is worse than none.
      // guide: { file: "GlamifiedSales-User-Guide-1.3.0.pdf" },
      features: [
        "Quotations that convert to invoices in one step",
        "Receipts and part-payments linked to the invoice",
        "ZRA Smart Invoice support",
        "Works offline, prints or shares as PDF",
      ],
      groups: [
        {
          title: "Customers and products",
          items: [
            "Customer records with TPIN, contact details and terms",
            "Walk-in customers, for a sale that does not need a full record",
            "Archiving, so an old customer leaves the list without losing their history",
            "Products and categories with prices, ready to drop into a document",
          ],
        },
        {
          title: "Documents",
          items: [
            "A quotation is a price offered, valid until a date you set",
            "Once issued a quotation can be marked Accepted or Expired, or converted straight into an invoice",
            "Invoices, with VAT handled correctly whether or not you are registered",
            "Receipts, including part-payments against an invoice",
            "Delivery notes tied to the invoice they belong to",
            "Draft and issued are deliberately different: a draft can be edited, an issued document cannot",
          ],
        },
        {
          title: "Getting paid",
          items: [
            "Outstanding balance per customer, calculated rather than remembered",
            "Part-payments recorded against the invoice, with the balance carried",
            "Payments recorded as cash, Airtel Money, MTN Money, Zamtel Kwacha, bank transfer or direct debit, with the transaction or reference number kept against the receipt",
            "Ageing of what is owed, so the oldest debt is visible",
          ],
        },
        {
          title: "Corrections and audit",
          items: [
            "An issued document is corrected by a credit note, not by editing history",
            "Every document keeps its number, its date and who issued it",
            "Audit log of changes",
          ],
        },
        {
          title: "Sharing",
          items: [
            "Print, or export to PDF",
            "Send straight to a customer on WhatsApp",
            "Your logo and business details on every document",
          ],
        },
        {
          // CONFIRM BEFORE LAUNCH: the GlamifiedSales user guide (v1.3.0) notes
          // that Smart Invoice is not yet tested against live ZRA hardware.
          title: "ZRA Smart Invoice",
          items: [
            "Documents built to the Smart Invoice requirements",
            "TPIN captured against the customer record",
            "VAT treatment per line",
          ],
        },
      ],
    },

    {
      slug: "glamified-fleet",
      name: "GlamifiedFleet",
      headline: "What your vehicles actually cost to run",
      seo: {
        title: "Fleet Management Software in Zambia | GlamifiedFleet",
        description:
          "Fleet management software for Zambian businesses. Track fuel, trips, servicing, licences and the true running cost per vehicle. Runs offline on your own machine.",
        previousPath: "/glamifiedfleet",
      },
      price: { amount: 6000, currency: "ZMW", note: "One-time licence. No subscription." },
      summary:
        "Fuel, trips, servicing and licences, added up into a real cost per vehicle.",
      description:
        "GlamifiedFleet answers a question most fleets cannot: what does this vehicle cost to run. Fuel fills, trips, job cards, service schedules and licence renewals all attach to the vehicle, so the running cost is a figure you can read rather than an estimate.\n\nIt runs on your own machine, offline, which matters for a fleet office that is not always near a good line.",
      image: "/images/products/glamified-fleet.webp",
      download: {
        file: "GlamifiedFleet-Setup-1.2.0.zip",
        version: "1.2.0",
        size: "94 MB",
        platform: "Windows 10 and 11",
      },
      // Note the dot before the version, where HR's guide uses a hyphen. The
      // filename has to match the bucket key exactly, so the inconsistency is
      // reproduced here rather than tidied.
      guide: { file: "GlamifiedFleet-User-Guide.1.2.0.pdf" },
      features: [
        "Cost per vehicle, built from real records",
        "Fuel, trips, servicing and licence renewals",
        "Warning thresholds before a renewal is missed",
        "Runs offline on your own machine",
      ],
      groups: [
        {
          title: "Vehicles",
          items: [
            "Vehicle records with registration, make, model, year and odometer",
            "The vehicle list, showing status at a glance",
            "Opening a vehicle to see its full history in one place",
            "Assigning a vehicle to a driver or a department",
          ],
        },
        {
          title: "Trips",
          items: [
            "Starting a trip against a vehicle and a driver",
            "Closing a trip off with distance and purpose",
            "Trip history per vehicle",
          ],
        },
        {
          title: "Fuel",
          items: [
            "Recording a fill with litres, cost and odometer reading",
            "Consumption worked out from the readings, not estimated",
            "Fuel cost rolled into the vehicle's running cost",
          ],
        },
        {
          title: "Maintenance",
          items: [
            "Garages, set up once and reused",
            "Job cards for work done, with parts and labour",
            "Service schedules, so the next service is known before it is late",
            "Costs added by hand where a record does not fit the usual shape",
          ],
        },
        {
          title: "Licences and renewals",
          items: [
            "Road tax, insurance, fitness and other renewals per vehicle",
            "Warning thresholds, so a renewal is flagged before the date passes",
            "Renewal history",
          ],
        },
        {
          title: "Running it",
          items: [
            "Desktop application, works with no internet connection",
            "Audit log of what changed and who changed it",
            "Backup and restore",
          ],
        },
      ],
    },
  ],

  services: [
    {
      slug: "web-software-development",
      group: "Technology",
      name: "Web & software development",
      icon: "code",
      seo: {
        title: "Website & Software Development in Lusaka, Zambia",
        description:
          "Website design, web and Android apps, and custom business systems built in Lusaka. Mobile first, set up to be found on Google, with a fixed price agreed in writing.",
      },
      summary: "Websites, apps and custom systems, built to a written scope.",
      description:
        "Website design, web and Android apps, and custom business systems built in Lusaka. Mobile first, set up to be found on Google, with a written fixed price before any code is written.\n\nOur own three products started as work like this. A loan management system, a property listing site, a hospitality system or an asset register are all the same kind of job.",
      forWho:
        "Businesses that need a system built around how they actually work, rather than bending the work to fit software bought off a shelf.",
      groups: [
        {
          title: "Websites",
          items: [
            "Business websites, mobile first",
            "Set up to be found on Google, not just to look right",
            "Content you can edit without calling us",
            "Domain, hosting and email set up for you",
          ],
        },
        {
          title: "Applications",
          items: [
            "Web applications",
            "Android applications",
            "Desktop systems that work without internet",
            "Integration with systems you already run",
          ],
        },
        {
          title: "How it runs",
          items: [
            "A written scope and a fixed price agreed before any code is written",
            "Working software shown early and often, not a demo at the end",
            "Deployment, staff training and a handover document",
            "Support afterwards, from the people who built it",
          ],
        },
      ],
    },

    {
      slug: "it-support",
      group: "Technology",
      name: "IT support",
      icon: "support",
      seo: {
        title: "IT Support for Businesses in Lusaka, Zambia",
        description:
          "IT support for Zambian businesses: computers, printers, networks, Windows, email and business software. Hardware repair, backups and data recovery, remote or on site.",
      },
      summary: "Computers, printers, networks and business software, kept working.",
      description:
        "Most IT problems are not the kind people expect. A machine that will not start. A printer that has stopped talking to the network. Email that has quietly stopped syncing. A file that mattered, on a drive that failed.\n\nWe support the whole setup, not only our own software, and not only the parts we sold you.",
      forWho:
        "Businesses without their own IT department, and businesses whose IT person needs a second pair of hands.",
      groups: [
        {
          title: "Computers and hardware",
          items: [
            "Diagnosis and repair, desktops and laptops",
            "Upgrades: memory, storage, replacement parts",
            "Windows installation, reinstallation, activation and updates",
            "New machines set up and handed over ready to work",
          ],
        },
        {
          title: "Printers and peripherals",
          items: [
            "Printer setup, sharing and driver problems",
            "Scanners, card printers and point of sale hardware",
            "Consumables and what actually fits your machine",
          ],
        },
        {
          title: "Networks and email",
          items: [
            "Routers, switches, cabling and wifi coverage",
            "Shared folders and network printing",
            "Business email setup and migration",
            "Slow or dropping connections, diagnosed properly",
          ],
        },
        {
          title: "Data and safety",
          items: [
            "Backups that are actually tested",
            "Data recovery from failing drives",
            "Antivirus and basic security hygiene",
            "Getting a business back up after a failure",
          ],
        },
      ],
    },

    {
      slug: "business-consultancy",
      group: "Business services",
      name: "Business registration & consultancy",
      icon: "clipboard",
      seo: {
        title: "PACRA, ZRA & NAPSA Registration Services in Zambia",
        description:
          "Company registration and statutory compliance in Zambia: PACRA, ZRA and TPIN, NAPSA, NHIMA, Workers' Compensation, ZPPA, NCC, EIZ, ZDA and council licensing.",
      },
      summary:
        "Company registration and the statutory work that follows it, handled in one place.",
      description:
        "Starting and running a compliant business in Zambia means dealing with several offices, each with its own forms, fees and deadlines. We deal with them so you do not have to learn all of it.\n\nRegistration is the beginning. Most of the value is in the filings that follow, month after month.",
      forWho:
        "New companies being set up, and established businesses that have fallen behind on filings.",
      groups: [
        {
          title: "Registration",
          items: [
            "PACRA company and business name registration",
            "TPIN and ZRA registration",
            "NAPSA employer registration",
            "NHIMA employer registration",
            "Workers' Compensation Fund registration",
            "Council business levy and trading licences",
          ],
        },
        {
          title: "Sector registrations",
          items: [
            "ZPPA registration for public procurement",
            "NCC registration for construction",
            "EIZ registration for engineering practice",
            "ZDA registration and incentives",
          ],
        },
        {
          title: "Ongoing compliance",
          items: [
            "Monthly and annual returns",
            "PAYE, NAPSA and NHIMA filings",
            "VAT returns where you are registered",
            "PACRA annual returns and changes of particulars",
            "Reminders before a deadline rather than after it",
          ],
        },
        {
          title: "Documents",
          items: [
            "Business plans",
            "Company profiles for tenders",
            "Contracts and agreements",
            "Board and shareholder resolutions",
          ],
        },
      ],
      bodies: {
        label: "Authorities we deal with",
        note: "These are the authorities we file with and register clients at. The marks are shown to say what we handle. They do not imply accreditation, partnership or endorsement by any of them.",
        items: [
          { src: "/images/bodies/pacra.webp", name: "PACRA" },
          { src: "/images/bodies/zra.webp", name: "Zambia Revenue Authority" },
          { src: "/images/bodies/napsa.webp", name: "NAPSA" },
          { src: "/images/bodies/nhima.webp", name: "NHIMA" },
          { src: "/images/bodies/wcfcb.webp", name: "Workers' Compensation Fund Control Board" },
          { src: "/images/bodies/zppa.webp", name: "ZPPA" },
          { src: "/images/bodies/ncc.webp", name: "National Council for Construction" },
          { src: "/images/bodies/eiz.webp", name: "Engineering Institution of Zambia" },
          { src: "/images/bodies/zda.webp", name: "Zambia Development Agency" },
          { src: "/images/bodies/lusaka-city-council.webp", name: "Lusaka City Council" },
        ],
      },
    },

    {
      slug: "payroll-outsourcing",
      group: "Business services",
      name: "Payroll outsourcing",
      icon: "receipt",
      seo: {
        title: "Payroll Outsourcing Services in Lusaka, Zambia",
        description:
          "Outsourced payroll for Zambian businesses. PAYE, NAPSA and NHIMA calculated and filed, payslips issued, statutory returns submitted on time, every month.",
      },
      summary:
        "We run the payroll each month, so nobody in your office has to.",
      description:
        "The same engine that powers GlamifiedHR, run by us on your behalf. You send us the month's changes, we send back payslips and the statutory returns ready to file.\n\nIt suits businesses too small to justify a payroll officer, and businesses where payroll is currently one person's second job.",
      forWho:
        "Businesses with staff on a payroll but nobody whose actual job is payroll.",
      groups: [
        {
          title: "Each month",
          items: [
            "New starters, leavers and changes processed",
            "PAYE, NAPSA and NHIMA calculated to current rules",
            "Payslips issued to your staff",
            "Statutory returns prepared and filed",
            "A payroll summary for your records",
          ],
        },
        {
          title: "Also handled",
          items: [
            "Leave balances tracked and shown on payslips",
            "Terminal benefits on separation, under the Employment Code Act",
            "Loans, advances and deductions",
            "Bank payment files",
          ],
        },
        {
          title: "What you keep",
          items: [
            "Your data, exportable at any point",
            "The option to move onto GlamifiedHR and run it yourself",
            "One person who knows your payroll, not a call centre",
          ],
        },
      ],
    },

    {
      slug: "graphic-design",
      group: "Business services",
      name: "Graphic design",
      icon: "pen",
      seo: {
        title: "Graphic Design & Branding Services in Lusaka, Zambia",
        description:
          "Logos, branding, company profiles, tender documents, signage and print design for Zambian businesses, produced in Lusaka.",
      },
      summary: "Logos, branding and the documents a business is judged on.",
      description:
        "A company profile that looks thrown together costs tenders. So does a logo that only works on one background.\n\nWe design the things a business is actually judged on, and we hand over the files so you are not locked to us.",
      forWho:
        "New businesses that need an identity, and established ones whose materials no longer match how they work.",
      groups: [
        {
          title: "Identity",
          items: [
            "Logo design, in the formats and sizes you will actually need",
            "Colour, type and how to use them consistently",
            "Letterheads, invoices and email signatures",
            "Business cards",
          ],
        },
        {
          title: "Documents",
          items: [
            "Company profiles",
            "Tender and bid documents",
            "Proposals and reports",
            "Presentations",
          ],
        },
        {
          title: "Print and signage",
          items: [
            "Flyers, brochures and posters",
            "Banners and pull-ups",
            "Vehicle branding",
            "Office and shopfront signage",
          ],
        },
        {
          title: "What you get",
          items: [
            "Source files, not only exports",
            "Formats for print and for screen",
            "A short guide to using the identity consistently",
          ],
        },
      ],
    },
  ],

  proof: {
    /**
     * Heading for the proof section. Needed because `proof` is not listed in
     * the homepage `sections`, so the usual heading lookup finds nothing and
     * the client cards would render unlabelled.
     */
    heading: "Who we work with",
    /**
     * Client logos for the marquee. An empty array omits the section.
     * `name` becomes the alt text, so the strip is not a row of anonymous
     * images to anyone using a screen reader.
     */
    logos: [
      { src: "/images/logos/lacm-enterprises.webp", name: "LACM Enterprises Limited" },
      { src: "/images/logos/aw-import-export.webp", name: "A & W Import and Export Limited" },
      { src: "/images/logos/ak-solar-security.webp", name: "AK Solar Solutions & Security Systems" },
      { src: "/images/logos/amani-prestigious-ventures.webp", name: "Amani Prestigious Ventures" },
      { src: "/images/logos/ampindi-ventures.webp", name: "Ampindi Ventures" },
      { src: "/images/logos/crescent-crest-supplies.webp", name: "Crescent Crest Supplies" },
      { src: "/images/logos/ikan-konsult.webp", name: "IKAN Konsult" },
      {
        src: "/images/logos/rare-events.webp",
        name: "Rare Events",
        // Gold on black: supplies its own ground, so it takes no tile.
        tile: "none",
      },
    ],
    /**
     * Label reads first, value second: "Building since / 2023". Value-first
     * read backwards on the strip.
     */
    stats: [
      { label: "Products in production", value: "3" },
      { label: "Building since", value: "2023" },
      { label: "Based in", value: "Lusaka" },
    ],
    // Factual engagements. What each client uses, which is checkable.
    clients: [],
    testimonials: [
      {
        quote:
          "We were writing quotations in one book and invoices on a separate pad, then reconciling the two at month end. Now a quotation becomes an invoice in one step and the receipt stays linked to it. Chasing payment is the part that changed most for us.",
        organisation: "Crescent Crest Supplies",
        using: "GlamifiedSales",
        logo: "/images/logos/crescent-crest-supplies.webp",
      },
      {
        quote:
          "They handled our PACRA registration and got the TPIN and statutory registrations in order without us having to chase anyone. We always knew what stage it was at.",
        organisation: "Amani Prestigious Ventures",
        using: "Business registration",
        logo: "/images/logos/amani-prestigious-ventures.webp",
      },
      {
        quote:
          "They set up our registrations and then did our branding, so everything matched from the start. Having one company handle both saved us going back and forth between suppliers.",
        organisation: "Ampindi Ventures",
        using: "Registration and design",
        logo: "/images/logos/ampindi-ventures.webp",
      },
      {
        quote:
          "They registered the company for us and have handled the monthly filings ever since. We hear from them before a deadline rather than after it, and that is the part we did not expect to matter as much as it does.",
        organisation: "Rare Events",
        using: "Registration and monthly compliance",
        logo: "/images/logos/rare-events.webp",
        // Gold and white on black, so it carries its own ground and must not
        // sit on the light tile the other marks need.
        logoTile: "none",
      },
    ],
  },

  process: [
    {
      step: "01",
      title: "Understand the business",
      detail:
        "We look at how the work is done now, on paper and in spreadsheets, before proposing anything.",
      icon: "search",
    },
    {
      step: "02",
      title: "Agree the scope",
      detail:
        "A written scope and a price, so both sides know what is being built and what it costs.",
      icon: "clipboard",
    },
    {
      step: "03",
      title: "Build and review",
      detail:
        "You see working software early and often, not a demo at the end.",
      icon: "gear",
    },
    {
      step: "04",
      title: "Deploy and support",
      detail:
        "We install it, train your people on it, and stay available afterwards.",
      icon: "rocket",
    },
  ],

  // The catalogue the engine exists to produce. Stays hidden while empty.
  templates: [],

  faq: {
    heading: "Frequently asked questions",
    standfirst:
      "The things people ask before they commit. If yours isn't here, ask us directly. We would rather answer it now than after you have bought.",
    cta: { label: "Ask on WhatsApp", type: "whatsapp" },
    items: [
      {
        q: "Is this a subscription, or do we buy the software once?",
        a: "You pay once. There is no monthly fee, and no licence that stops working at the end of a term: the version you buy keeps running for as long as you want to use it. Strictly it is a perpetual licence rather than a transfer of the software itself, which is the normal arrangement for packaged software and is set out in the terms.",
      },
      {
        q: "Can we try it before we buy?",
        a: "Yes. GlamifiedHR, GlamifiedSales and GlamifiedFleet all run free for 30 days from the day you install them. Everything works during the trial, so you can test it on your own data rather than on a demo. After 30 days the system needs a licence key to keep running.",
      },
      {
        q: "Do these systems need an internet connection?",
        a: "GlamifiedHR, GlamifiedSales and GlamifiedFleet run as desktop applications on your own computer, and work with no connection at all. Your data stays on your machine. Nothing is lost when the line goes down.",
      },
      {
        q: "Are the statutory calculations kept up to date?",
        a: "PAYE, NAPSA and NHIMA are calculated against current Zambia Revenue Authority rules, and GlamifiedSales supports ZRA Smart Invoice. When the rates change, we issue an update.",
      },
      {
        q: "Can you move our existing records into the system?",
        a: "Yes. Data migration from spreadsheets and existing records is part of a normal deployment, along with installation and training for your staff.",
      },
      {
        q: "What happens after the system is installed?",
        a: "Deployment includes staff training and a handover document, so your people can run the system without us. After that we are available for support, remotely anywhere in Zambia and on site in Lusaka.",
      },
      {
        q: "Our data is on our own machine. What if that computer dies?",
        a: "Every product includes Backup and Restore in its settings. A backup is one file, so it goes on a memory stick or into Google Drive, OneDrive or Dropbox like any other document, and the software shows a warning when a backup is overdue. Restoring onto a replacement machine is the same file going back the other way. Backups keep working even after a licence has expired, so your records are never held hostage by a lapsed key.",
      },
      {
        q: "Do you support software you didn't build?",
        a: "Yes. We support systems from other suppliers as well as our own, along with the computers, printers and networks they run on.",
      },
      {
        q: "Can you register a new company for us?",
        a: "Yes. We handle PACRA registration and the registrations that follow it, including your TPIN with ZRA, NAPSA and NHIMA. You deal with us rather than with each office separately.",
      },
      {
        q: "Which authorities do you deal with?",
        a: "PACRA, ZRA, NAPSA, NHIMA, the Workers' Compensation Fund Control Board, ZPPA, NCC, EIZ, ZDA and the local councils. We also prepare business plans and contracts.",
      },
      {
        q: "Do you build websites as well as desktop systems?",
        a: "Yes. Website design, web applications and Android apps, built mobile first and set up to be found on Google. Custom business systems are quoted the same way, with a written scope and a fixed price before any code is written.",
      },
      {
        q: "Do we own what you build for us?",
        a: "On full payment you own the deliverables produced specifically for you. We keep ownership of our underlying tools, libraries and templates, the things that existed before your project. Where an agreement includes source files, that is stated in the scope in writing.",
      },
      {
        q: "How is a project priced?",
        a: "We agree a written scope and a fixed price before any code is written, so there are no surprises later. If the scope changes, we tell you what that costs before doing the work.",
      },
      {
        q: "Do you work outside Lusaka?",
        a: "Yes. Support is delivered remotely across Zambia, and on site in Lusaka. Deployments elsewhere are arranged case by case.",
      },
    ],
  },

  form: {
    /*
     * Netlify Forms. The build bot finds the form in the deployed HTML and
     * stores submissions itself, so there is no function to write or maintain.
     *
     * `endpoint` is not an API: it is where a visitor with JavaScript off lands
     * after the browser posts the form. With JavaScript on, the script posts in
     * the background and shows the success message inline instead.
     */
    endpoint: "/thank-you",
    // Reused by the checkout fields so the wording stays in one place.
    labels: { name: "Full name", email: "Email", phone: "Phone number" },
    heading: "Tell us about your project",
    standfirst:
      "For anything bigger than a quick question. Prefer WhatsApp for a fast answer.",
    organisationTypes: ["NGO / NFP", "Enterprise", "SME", "Startup", "Other"],
    serviceOptions: [
      "One of the products",
      "Web & software development",
      "IT support",
      "Business registration & consultancy",
      "Payroll outsourcing",
      "Graphic design",
    ],
    /*
     * No longer rendered. Asking for a budget on a first contact is a barrier:
     * people do not know it before the problem is scoped, and a wrong guess
     * either loses the enquiry or anchors it. Kept because the type requires it
     * and a variant selling fixed packages may want it back.
     */
    budgetBands: [
      { label: "Under K1,500", value: "under-1500" },
      { label: "K1,500 – K3,500", value: "1500-3500" },
      { label: "K3,500 – K10,000", value: "3500-10000" },
      { label: "Over K10,000", value: "over-10000" },
      { label: "Not sure yet", value: "unsure" },
    ],
    successMessage:
      "Thank you, we've got your enquiry and will reply within one working day.",
    errorMessage:
      "That didn't send. Please try again, or reach us on WhatsApp.",
  },

  legal: {
    jurisdiction: "Zambia",
    registeredName: "Glamified Systems Limited",
    registeredOffice: "Lusaka, Zambia",
    // CONFIRM: read off a GlamifiedSales invoice screenshot, not given to us.
    // It appears on all three legal pages and the About page. Verify or remove.
    // The statute the privacy policy is written against.
    dataProtectionAct: "the Data Protection Act No. 3 of 2021",
    lastUpdated: "2026-09-06",
  },

  seo: {
    title: "Payroll, Invoicing & Fleet Software in Zambia | Glamified Systems",
    description:
      "Zambian business software built in Lusaka. Payroll with PAYE, NAPSA and NHIMA, invoicing with ZRA Smart Invoice, and fleet cost tracking. Runs offline.",
    ogImage: "/images/brand/og.svg",
    domain: "https://glamifiedsystems.com",
  },
};

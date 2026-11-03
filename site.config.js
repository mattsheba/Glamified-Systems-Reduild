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
 * ──────────────────────────────────────────────────────────────────────────
 * ONE PRODUCT, ON THE HOMEPAGE.
 *
 * This site sold three products and five services. Payroll enquiries had dried
 * up, so it now sells GlamifiedHR and the two things that sit either side of it:
 * running the payroll for you, and building a system you do not have yet.
 * GlamifiedSales and GlamifiedFleet, IT support, business registration and
 * graphic design were removed from the site in November 2026 — they are in the
 * git history if any of them comes back.
 *
 * `productOnHome` below is what makes the homepage the product page. Read its
 * comment before adding a second product.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Product copy is drawn from the product's own documentation and from the
 * application itself — docs/user-guide in the Glamified HR V3 repository. Every
 * capability named here is visible in one of the screenshots under
 * public/images/product/. Do not add a claim the software does not make.
 */

export default {
  brand: {
    /*
     * The PRODUCT, not the company.
     *
     * This is a single-product site, so the name in the header, the browser
     * tab and the footer lockup is GlamifiedHR. The company still owns the
     * site and says so where it matters: `company` below carries it into the
     * structured data, `legal.registeredName` into the copyright line and the
     * legal pages, and the About page is headed "About Glamified Systems".
     */
    name: "GlamifiedHR",
    /** The publisher, for structured data and anywhere the company is meant. */
    company: "Glamified Systems",
    tagline: "Compliant by default. Offline by design.",
    accent: "#006C90",
    logo: "/images/product/glamifiedhr-lockup.webp",
    mark: "/images/brand/glamifiedhr-mark.webp",
    favicon: "/favicon.svg",
    /*
     * What the company is, in one place. Search engines and AI tools read this
     * from the Organization structured data, and the About page says the same
     * thing in its own words. The company is the publisher; GlamifiedHR is the
     * product, and the product is what the site sells.
     */
    description:
      "Glamified Systems is a software company in Lusaka, Zambia. It makes GlamifiedHR, payroll and HR software for Zambian employers: PAYE, NAPSA and NHIMA calculated to current rules, statutory returns ready to file, and terminal benefits worked out under the Employment Code Act. GlamifiedHR runs offline on your own computer. The company also runs payroll on behalf of businesses that would rather outsource it, and builds custom business systems to order.",
  },

  contact: {
    phone: "+260 977 669 883",
    phoneAlt: "+260 770 029 595",
    whatsapp: "260977669883",
    // Used by every WhatsApp button on the site: the floating one, the product
    // and service pages, and the hero's secondary action.
    ctaLabel: "Chat on WhatsApp",
    whatsappMessage:
      "Hello Glamified Systems. I'd like to know more about GlamifiedHR.",
    email: "info.glamifiedsystems@gmail.com",
    city: "Lusaka, Zambia",
    hours: "Mon–Fri, 08:00–17:00 CAT",
  },

  /*
   * Single-product mode.
   *
   * The homepage IS the GlamifiedHR page: the full product block and the
   * walkthrough render on `/`, so a listing page at /products holding one card
   * and a detail page repeating the homepage would split one page's ranking
   * across three URLs. While this is true:
   *
   *   - productHref() returns "/" instead of /products/<slug>
   *   - the sitemap leaves /products and /products/<slug> out
   *   - the product detail route renders noindex
   *   - public/_redirects force-301s /products and /products/* to /
   *
   * The routes still build, because the engine serves variants that really do
   * have several products (see variants/). Set this to false the day a second
   * product goes back on the site, and remove the two redirect lines.
   */
  productOnHome: true,

  // Real pages, not on-page anchors. `childrenFrom` builds the dropdown from
  // products[] / services[] at build time, so adding a service adds a menu
  // entry — there is no second list to keep in step. Products are not in the
  // menu while `productOnHome` is set: the product is the homepage, and the
  // logo already links there.
  nav: [
    { label: "What it does", href: "/features" },
    { label: "Services", href: "/services", childrenFrom: "services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  /*
   * Homepage composition. Order here IS render order; delete an entry to drop
   * the section (FR-7).
   *
   * This is no longer a summary page that sends people elsewhere — it is the
   * product page, so the product block, four screens of the walkthrough and
   * the enquiry form are all on it. The form on the homepage is a deliberate
   * departure from FR-27, which put it on /contact to keep the homepage a
   * summary; that reason no longer applies, and the enquiry form is the one
   * thing on this page that produces a phone call.
   */
  sections: [
    { key: "hero" },
    { key: "proofStrip", mode: "inverse" },
    { key: "product", heading: "Inside GlamifiedHR" },
    { key: "walkthrough", heading: "What it actually does", limit: 4 },
    { key: "logoMarquee", mode: "light", heading: "Trusted by" },
    { key: "proof", heading: "What our clients say" },
    { key: "services", heading: "Or let us run it for you" },
    { key: "process", heading: "How we get you running" },
    { key: "faq", mode: "light" },
    { key: "form", heading: "Ask us about your payroll" },
  ],

  // Per-page copy for the standalone routes.
  pages: {
    /*
     * The listing route. Unreachable while `productOnHome` is set — kept
     * because the engine builds it for multi-product variants, and because the
     * 404 page and the payment-success page read its heading.
     */
    products: {
      heading: "GlamifiedHR",
      seo: {
        title: "Payroll Software for Zambian Businesses | GlamifiedHR",
        description:
          "Payroll and HR software built for Zambia. PAYE, NAPSA and NHIMA calculated to current ZRA rules, with statutory returns ready to file. Runs offline.",
      },
      standfirst:
        "Payroll and HR for Zambian employers, running on your own computer.",
    },

    /*
     * The walkthrough route: every screen in the application, in the order you
     * meet them. This is the page that answers "what does it actually do",
     * which is the question that loses a payroll sale when a site leaves it to
     * a feature list.
     */
    features: {
      heading: "Every screen in GlamifiedHR",
      seo: {
        title: "GlamifiedHR Features & Screenshots | Zambian Payroll Software",
        description:
          "A screen-by-screen tour of GlamifiedHR: staff records, leave, attendance, payroll runs, PAYE, NAPSA and NHIMA returns, terminal benefits, reports and settings.",
      },
      standfirst:
        "From the dashboard to the last setting, this is the whole application — the same screens you get when you install it, in the order you meet them.",
      // The link from the homepage, where only the first few screens show.
      moreLabel: "See every screen",
      // The band that closes the tour, above the download button.
      endHeading: "See it on your own payroll",
    },

    services: {
      heading: "Services",
      seo: {
        title: "Payroll Outsourcing & Custom Software in Lusaka, Zambia",
        description:
          "Two services from Glamified Systems in Lusaka: outsourced payroll run by us each month, and custom business systems built to a written scope and a fixed price.",
      },
      standfirst:
        "Not every business wants to run its own payroll, and not every problem has a product. These two services sit either side of GlamifiedHR.",
      forWhoLabel: "Who this is for",
      otherServicesLabel: "Other services",
    },

    about: {
      heading: "About Glamified Systems",
      seo: {
        title: "About Glamified Systems | Payroll Software Company, Lusaka",
        description:
          "Glamified Systems is a Lusaka software company. It builds GlamifiedHR, payroll and HR software for Zambian employers, and runs payroll on behalf of businesses.",
      },
      standfirst:
        "A Lusaka software company, building payroll software around the way Zambian employers actually work.",
      body: [
        "Glamified Systems is a Zambian software company based in Lusaka. We build **GlamifiedHR**, payroll and HR software for Zambian employers, and we support the businesses that run it.",
        "Our approach is simple: **understand the business first, then build the technology around it.**",
        "Payroll in Zambia is not a generic problem. PAYE bands change, the NAPSA ceiling changes each year, NHIMA takes a percentage of basic pay, the portals want files in their own formats, and the Employment Code Act decides what someone is owed when they leave. Software written elsewhere treats all of that as a configuration exercise. We treat it as the job.",
        "Around the product we run payroll on behalf of businesses that would rather outsource it, and we build custom business systems where no product fits. Both are done by the same people who write the software.",
      ],
      sections: [
        {
          title: "Built for Zambia, not adapted to it",
          body: [
            "**PAYE** is calculated against the bands in force for the month being run, so re-running an old period uses the rates that applied then rather than today's.",
            "**NAPSA** is assessed at 5% from the employee and 5% from the employer, up to the monthly earnings ceiling, which is editable because it changes every year.",
            "**NHIMA** is 1% from each side of basic pay, and both the NAPSA and NHIMA returns come out as the CSV files the iCare and eNHIMA portals expect.",
            "**Terminal benefits** are worked out under the Employment Code Act from the reason someone is leaving — resignation, dismissal, redundancy, end of contract or retirement — rather than from a single fixed rate.",
          ],
        },
        {
          title: "Why it runs offline",
          // Renders in the right column, filling the space under facts and values.
          aside: true,
          body: [
            "GlamifiedHR is a desktop application. It installs on a computer in your office and works with no internet connection at all.",
            "That is a deliberate decision rather than a limitation. Payroll has a deadline, and a system that stops when the line goes down is not a system. Your payroll data also stays in the building, which is what most finance managers ask about first.",
            "Backup and restore is built in: a backup is a single file, so it goes on a memory stick or into Google Drive like any other document, and it keeps working even after a licence has expired.",
            "**We build the software, we install it, we train your people on it, and we answer the phone afterwards.**",
          ],
        },
      ],
      values: [
        {
          title: "Offline first",
          detail:
            "GlamifiedHR runs without internet. Nothing is lost when the line goes down.",
          icon: "offline",
        },
        {
          title: "Built for Zambian rules",
          detail:
            "PAYE, NAPSA, NHIMA, the Employment Code Act, NRC validation, ZMW. Compliance is not an add-on module.",
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
   * What the licence fee buys, shown beside the price.
   *
   * Every line here is something the site already commits to elsewhere: the
   * migration and training come from the FAQ, the guide from the download
   * block. Nothing has been added to make the offer look fuller than it is.
   * CONFIRM before adding anything to this list.
   */
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

  // Captions the screenshots on the product and features pages. The dashboards
  // are filled with demonstration companies and figures, and at full width
  // those read clearly enough that a visitor could take them for a real
  // customer's records (FR-38).
  screenshotNote:
    "Screenshots show demonstration data. The companies, staff and figures in them are not real customer records.",

  downloads: {
    baseUrl: "https://downloads.glamifiedsystems.com",
    label: "Download for Windows",
    note: "Windows 10 and 11",
    trial: "Runs free for 30 days, for up to 50 employees. After that it needs a licence key.",
    guideLabel: "User guide (PDF)",
  },

  hero: {
    /*
     * The product lockup, above everything else on the page.
     *
     * A pain-led headline earns the click from search, but on arrival a
     * visitor still has to learn what the thing is called — the name is what
     * they type into Google next, and what they say on the phone. It sits on
     * its own tile because the mark is dark ink on white and the hero band
     * inverts in dark mode.
     */
    lockup: "/images/product/glamifiedhr-lockup.webp",
    headline: "Payroll that follows Zambian law, not a spreadsheet",
    /*
     * The statutory line. Set as its own field rather than folded into the
     * standfirst because it reads as a list, not a sentence, and it is styled
     * as one. It is also the fastest way for a visitor to find themselves on
     * the page: most people are scanning for their own word.
     */
    capabilities: [
      "PAYE",
      "NAPSA",
      "NHIMA",
      "Payslips",
      "Leave",
      "Attendance",
      "Terminal benefits",
    ],
    standfirst:
      "GlamifiedHR runs the whole payroll on a computer in your office: staff records, leave and attendance, monthly pay runs with PAYE, NAPSA and NHIMA worked out to current rules, and the return files the ZRA, NAPSA and NHIMA portals expect. No internet required.",
    primaryCta: { label: "Download the free trial", type: "download" },
    secondaryCta: { label: "Chat on WhatsApp", type: "whatsapp" },
    /*
     * Versioned filename, deliberately.
     *
     * Files under public/ are copied out under the name they are given, so they
     * carry no content hash, and the CDN caches them for 30 days. Replacing one
     * in place leaves the previous version served from the edge long after the
     * deploy, and no browser refresh reaches past that. A new name is a new
     * cache key, which is what actually busts it.
     *
     * To replace this photo: write it to a new filename (-v3, and so on) and
     * point this at it. Leave the previous file in the folder for a few days
     * rather than deleting it — HTML is served must-revalidate, but a browser
     * that already has the page open still holds markup naming the old file,
     * and deleting it turns that into a 404 and a visibly broken hero.
     */
    image: "/images/brand/hero-desk-v2.webp",
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
      image: "/images/product/dashboard.webp",
      logo: "/images/product/glamifiedhr-lockup.webp",
      download: {
        // Must match the object key in the R2 bucket exactly, including the
        // extension. The bucket holds the .zip, not the bare .exe.
        file: "GlamifiedHR-Setup-1.2.0.zip",
        version: "1.2.0",
        size: "119 MB",
        platform: "Windows 10 and 11",
      },
      guide: { file: "GlamifiedHR-User-Guide-1.2.0.pdf" },
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
            "Overtime priced at your own weekday and rest-day multipliers",
            "Public holidays and working patterns",
          ],
        },
        {
          title: "Payroll",
          items: [
            "Monthly payroll runs with a full audit trail",
            "PAYE calculated against the tax bands in force for the month being run",
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
            "Outstanding loans and advances recovered from the final payment",
            "Final payslip and certificate of service",
          ],
        },
        {
          title: "Statutory returns",
          items: [
            "PAYE return figures for the ZRA filing",
            "NAPSA upload file in the format the iCare portal expects",
            "NHIMA upload file in the format the eNHIMA portal expects",
            "Monthly summaries by department and by employee",
          ],
        },
        {
          title: "Running it",
          items: [
            "Desktop application, works with no internet connection",
            "User accounts with roles, so payroll is not open to everyone",
            "Every approval written to an audit log",
            "Data stored on your own machine",
            "Backup and restore, to this machine, an external drive or a cloud drive",
            "Full export to Excel, so nothing is locked in",
          ],
        },
      ],

      /*
       * The walkthrough: one entry per screen, in the order you meet them.
       *
       * Rendered in full on /features and the first `limit` of them on the
       * homepage. Every image is a capture of the running application, and
       * every caption describes something visible in that capture. If a
       * sentence here cannot be pointed at in the image above it, it does not
       * belong — this is the part of the site a buyer checks against the trial.
       *
       * Captures live in public/images/product/ and are prepared at 1200px
       * wide. Replace one by writing a new capture over the same filename and
       * re-running the conversion script (see the website rebuild notes).
       */
      walkthrough: [
        {
          image: "/images/product/dashboard.webp",
          title: "The dashboard",
          caption:
            "Headcount, this month's payroll total, leave waiting for approval and anything statutory still outstanding — on one screen, the moment you sign in. The chart tracks gross pay across the last six months and the ring shows where your people sit by department.",
        },
        {
          image: "/images/product/employees.webp",
          title: "Staff records",
          caption:
            "Every employee with their number, department, position, basic salary, pension status and whether they are active or terminated. A new company does not type it all in: Import from Excel loads the whole payroll in one go — 300 records at once in this capture — and the user guide lists the columns it recognises.",
        },
        {
          image: "/images/product/departments.webp",
          title: "Departments",
          caption:
            "Each department carries a code and a description, and the card shows live headcount. Payroll, leave and the reports all group by department, so you can see what a section costs without exporting anything.",
        },
        {
          image: "/images/product/leave.webp",
          title: "Leave balances",
          caption:
            "Annual leave accrues monthly at the rate you set — two days a month here — and the screen shows accrued, used and remaining for whichever employee you pick, with length of service counted from their start date. Compassionate, emergency and the other leave types each carry their own yearly allowance and do not come off annual leave.",
        },
        {
          image: "/images/product/attendance.webp",
          title: "Attendance and overtime",
          caption:
            "Enter absent days and overtime hours for the month and GlamifiedHR prices them: a missed day is basic ÷ 22, an overtime hour is basic ÷ 208 at 1.5× on a weekday and 2× on a rest day or public holiday. Both carry straight into the next payroll run.",
        },
        {
          image: "/images/product/deductions.webp",
          title: "Loans, advances and deductions",
          caption:
            "A staff loan, salary advance or other deduction is registered once with a monthly instalment, then recovered from net pay every payroll run until the balance clears. The register shows what is still outstanding and what comes off next month.",
        },
        {
          image: "/images/product/payroll-runs.webp",
          title: "Payroll runs",
          caption:
            "One row per month with gross, NAPSA, PAYE, NHIMA and net, and a status that says whether a run is still a draft or has been approved. An approved run stays exactly as it was approved.",
        },
        {
          image: "/images/product/payroll-run.webp",
          title: "Inside a payroll run",
          caption:
            "Creating a run calculates a payslip for every employee in the company — 332 of them here — showing gross, NAPSA, NHIMA, PAYE, other deductions and net pay per person, with the statutory totals across the top. Nothing is final until you approve it, and approving it is written to the audit log.",
        },
        {
          image: "/images/product/terminal-benefits.webp",
          title: "Terminal benefits",
          caption:
            "Resignation, dismissal, redundancy, end of contract or retirement: the calculator works the entitlement out under the Employment Code Act from the reason for leaving rather than a fixed rate, pays accrued leave days, recovers any outstanding loan, and shows gross, deductions and the net amount payable before you save it.",
        },
        {
          image: "/images/product/napsa-return.webp",
          title: "The NAPSA return",
          caption:
            "Pensionable earnings, the 5% from the employee, the 5% from the employer and the grand total for the month, employee by employee — and a CSV in the layout the NAPSA iCare portal accepts. Mark it as filed and the month stops showing as outstanding.",
        },
        {
          image: "/images/product/paye-return.webp",
          title: "The PAYE return",
          caption:
            "Gross pay, NAPSA and NHIMA deducted, taxable income and PAYE for every employee, totalled for the ZRA filing, for whichever month you select.",
        },
        {
          image: "/images/product/nhima-return.webp",
          title: "The NHIMA return",
          caption:
            "Basic pay with the 1% from the employee and the 1% from the employer, per person and in total, with a CSV for the eNHIMA portal.",
        },
        {
          image: "/images/product/reports-payroll.webp",
          title: "Payroll reports",
          caption:
            "A payroll summary, every payslip for the month as a single PDF, a bank payment schedule for the transfer, and a payroll journal for your accountant — each one as PDF or Excel.",
        },
        {
          image: "/images/product/reports-statutory.webp",
          title: "Statutory reports",
          caption:
            "NAPSA, PAYE and NHIMA contribution reports for any approved run, as PDF or Excel, with the portal-ready CSVs beside them and a combined statutory summary.",
        },
        {
          image: "/images/product/data-export.webp",
          title: "Your data, exportable",
          caption:
            "One Excel workbook holding every employee, department, payroll run, payslip and leave request. Nothing is locked in: use it for an audit, an offsite backup, or to take your records somewhere else.",
        },
        {
          image: "/images/product/settings-company.webp",
          title: "Company details",
          caption:
            "Your company name and logo, PACRA registration number, TPIN, NAPSA and NHIMA numbers. These print on the payslips and fill the account fields in the statutory files, so they are entered once.",
        },
        {
          image: "/images/product/settings-paye-bands.webp",
          title: "Statutory rates",
          caption:
            "The NAPSA monthly earnings ceiling is editable because it changes every year, and the screen shows what the maximum contribution works out to at the figure you set. The PAYE bands are stored against the date they took effect, so re-running an old month uses the rates that applied then rather than today's.",
        },
        {
          image: "/images/product/settings-overtime.webp",
          title: "Overtime and a second pension",
          caption:
            "Set your own overtime multipliers and hours per month, with the law's minimums noted beside them. If you run a group pension with an insurance company on top of NAPSA, switch it on and choose who is enrolled.",
        },
        {
          image: "/images/product/settings-holidays.webp",
          title: "Zambian public holidays",
          caption:
            "The year's public holidays are filled in for you, and a holiday falling inside someone's leave is not deducted from their balance. Add a one-off and it applies from then on.",
        },
        {
          image: "/images/product/sign-in.webp",
          title: "Accounts and roles",
          caption:
            "Everyone signs in with their own account. An administrator has full access; an HR officer runs HR and payroll but cannot change settings, accounts or the audit log; a supervisor looks up staff and records attendance with no pay figures at all.",
        },
      ],
    },
  ],

  services: [
    {
      slug: "payroll-outsourcing",
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
      slug: "web-software-development",
      name: "Custom systems",
      icon: "code",
      seo: {
        title: "Custom Business Software Development in Lusaka, Zambia",
        description:
          "Custom business systems, web applications and Android apps built in Lusaka, to a written scope and a fixed price agreed before any code is written.",
      },
      summary: "Business systems built to a written scope, where no product fits.",
      description:
        "GlamifiedHR started as work like this: a business with a problem no product solved properly, and a system built around how the work is actually done.\n\nA loan management system, a property register, a hospitality system, an asset register or a procurement and approvals workflow are all the same kind of job. So are the web and Android applications that sit alongside them.",
      forWho:
        "Businesses that need a system built around how they actually work, rather than bending the work to fit software bought off a shelf.",
      groups: [
        {
          title: "What we build",
          items: [
            "Desktop systems that work without internet, like GlamifiedHR",
            "Web applications",
            "Android applications",
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
      { label: "Runs", value: "Offline" },
      { label: "Free trial", value: "30 days" },
      { label: "Building since", value: "2023" },
      { label: "Based in", value: "Lusaka" },
    ],
    // Factual engagements. What each client uses, which is checkable.
    clients: [],
    /*
     * Drafted from what each client actually uses and published with their
     * name and mark — see content/testimonial-drafts.md.
     *
     * NONE OF THESE IS A GLAMIFIEDHR QUOTE. They are compliance and
     * registration engagements, which is why they are framed as evidence that
     * the statutory side is handled rather than as product testimonials. The
     * first payroll client who agrees to be quoted replaces one of them.
     */
    testimonials: [
      {
        quote:
          "They handled our PACRA registration and got the TPIN and statutory registrations in order without us having to chase anyone. We always knew what stage it was at.",
        organisation: "Amani Prestigious Ventures",
        using: "Registration and statutory setup",
        logo: "/images/logos/amani-prestigious-ventures.webp",
      },
      {
        quote:
          "They registered the company for us and have handled the monthly filings ever since. We hear from them before a deadline rather than after it, and that is the part we did not expect to matter as much as it does.",
        organisation: "Rare Events",
        using: "Monthly statutory compliance",
        logo: "/images/logos/rare-events.webp",
        // Gold and white on black, so it carries its own ground and must not
        // sit on the light tile the other marks need.
        logoTile: "none",
      },
      {
        quote:
          "They set up our registrations and then did our branding, so everything matched from the start. Having one company handle both saved us going back and forth between suppliers.",
        organisation: "Ampindi Ventures",
        using: "Registration and design",
        logo: "/images/logos/ampindi-ventures.webp",
      },
    ],
  },

  process: [
    {
      step: "01",
      title: "Try it on your own payroll",
      detail:
        "Download it and run it free for 30 days, for up to 50 employees. Everything works during the trial, so you test it on your own figures rather than on a demo.",
      icon: "search",
    },
    {
      step: "02",
      title: "We move your records in",
      detail:
        "Your existing staff records come across from spreadsheets, departments and leave rules are set up, and your company details go in once.",
      icon: "clipboard",
    },
    {
      step: "03",
      title: "We run the first payroll with you",
      detail:
        "The first month is run side by side with whatever you use now, so you can see the figures agree before you rely on it.",
      icon: "gear",
    },
    {
      step: "04",
      title: "Training, then support",
      detail:
        "Your people are trained on it and get a handover document. After that we are available for support, remotely across Zambia and on site in Lusaka.",
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
        q: "Does GlamifiedHR calculate PAYE, NAPSA and NHIMA?",
        a: "Yes, all three, on every payroll run. PAYE is calculated against the tax bands in force for the month being run. NAPSA is 5% from the employee and 5% from the employer up to the monthly earnings ceiling, which you can edit when it changes. NHIMA is 1% from each side of basic pay. The employer portions are calculated as well as the employee ones.",
      },
      {
        q: "Will it produce the NAPSA and NHIMA files the portals want?",
        a: "Yes. The Compliance screen produces a NAPSA return with a CSV in the layout the iCare portal accepts, an NHIMA return with a CSV for the eNHIMA portal, and the PAYE figures for the ZRA filing. Each month can be marked as filed so you can see at a glance what is still outstanding.",
      },
      {
        q: "What happens when the PAYE bands or the NAPSA ceiling change?",
        a: "We issue an update when the rates change. The PAYE bands are stored against the date they took effect, so re-running an old month uses the rates that applied then rather than the new ones, and the NAPSA ceiling is a setting you can change yourself.",
      },
      {
        q: "Can we try it before we buy?",
        a: "Yes. GlamifiedHR runs free for 30 days from the day you install it, for up to 50 employees, and every feature works during the trial — so you can test it on your own payroll rather than on a demo. After 30 days it needs a licence key to keep running.",
      },
      {
        q: "Does it need an internet connection?",
        a: "No. GlamifiedHR is a desktop application that runs on your own computer and works with no connection at all. Your payroll data stays on your machine, and a bad line does not stop you paying people on time.",
      },
      {
        q: "Is this a subscription?",
        a: "No. You pay once for the licence rather than a monthly fee, and the price covers installation, migration of your existing records, training and the user guide. Ask us for the current licence terms in writing before you buy.",
      },
      {
        q: "Can you move our existing records into the system?",
        a: "Yes. Staff records import from a spreadsheet — the user guide lists the columns it recognises — and migrating your existing records is part of a normal deployment, along with installation and training for your staff.",
      },
      {
        q: "How many employees can it handle?",
        a: "The screenshots on this site are from a company of 332 staff, and a payroll run of that size calculates in one go. The trial covers up to 50 employees; above that it is a question of which licence you take, so tell us your headcount and we will tell you what you need.",
      },
      {
        q: "Does it work out terminal benefits when someone leaves?",
        a: "Yes. The separations screen handles resignation, dismissal, redundancy, end of contract and retirement, and works the entitlement out under the Employment Code Act from the reason for leaving rather than from a single fixed rate. Accrued leave is paid out, outstanding loans are recovered, and it produces the final payslip and a certificate of service.",
      },
      {
        q: "Our data is on our own machine. What if that computer dies?",
        a: "GlamifiedHR includes Backup and Restore in its settings. A backup is one file, so it goes on a memory stick or into Google Drive, OneDrive or Dropbox like any other document, and the software shows a warning when a backup is overdue. Restoring onto a replacement machine is the same file going back the other way. Backups keep working even after a licence has expired, so your records are never held hostage by a lapsed key.",
      },
      {
        q: "Can everyone in the office see what people are paid?",
        a: "No, unless you want them to. Everyone signs in with their own account and the role decides what they reach: an administrator has full access, an HR officer runs HR and payroll but cannot change settings or accounts, and a supervisor can look up staff and record attendance with no pay figures at all. Approvals are written to an audit log.",
      },
      {
        q: "Can we get our data out again?",
        a: "Yes, at any time. A full export writes every employee, department, payroll run, payslip and leave request into a single Excel workbook. There is no lock-in: the records are yours and they live on your machine.",
      },
      {
        q: "What happens after the system is installed?",
        a: "Deployment includes staff training and a handover document, so your people can run the payroll without us. After that we are available for support, remotely anywhere in Zambia and on site in Lusaka.",
      },
      {
        q: "Would you rather just run our payroll for us?",
        a: "That is the payroll outsourcing service. You send us the month's changes and we send back payslips and the statutory returns ready to file, using the same engine that powers GlamifiedHR. Businesses often start there and move onto the software later.",
      },
      {
        q: "Do you work outside Lusaka?",
        a: "Yes. Support is delivered remotely across Zambia, and on site in Lusaka. Installations elsewhere are arranged case by case.",
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
    heading: "Tell us about your payroll",
    standfirst:
      "How many staff you have and how payroll is handled now is enough to start. Prefer WhatsApp for a fast answer.",
    organisationTypes: ["NGO / NFP", "Enterprise", "SME", "Startup", "Other"],
    serviceOptions: [
      "GlamifiedHR licence",
      "A demonstration first",
      "Payroll outsourcing",
      "A custom system",
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
    // The statute the privacy policy is written against.
    dataProtectionAct: "the Data Protection Act No. 3 of 2021",
    lastUpdated: "2026-11-03",
  },

  seo: {
    title: "Zambian Payroll Software — PAYE, NAPSA, NHIMA | GlamifiedHR",
    description:
      "Payroll software for Zambian employers. PAYE, NAPSA and NHIMA calculated to current rules, statutory returns ready to file, and it runs offline. 30-day free trial.",
    /*
     * Built by scripts/make-og.mjs from the lockup and the dashboard capture.
     * This replaced a literal PLACEHOLDER card, which is what every WhatsApp
     * share of the site had been showing — on a site whose primary call to
     * action is WhatsApp. PNG, because that is what the scrapers render most
     * reliably.
     */
    ogImage: "/images/brand/og-glamifiedhr.png",
    domain: "https://glamifiedsystems.com",
  },
};

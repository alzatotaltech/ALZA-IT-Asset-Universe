import { Control, DomainBlueprint, Risk } from '../types';

const F = {
  CIS: 'CIS Controls v8.1',
  NIST: 'NIST CSF 2.0',
  ISO: 'ISO/IEC 27001',
  ITAM: 'ISO/IEC 19770-1 / ITAM',
  MOBILE: 'NIST SP 800-124 Rev.2',
  SANITIZE: 'NIST SP 800-88 Rev.2',
  SSDF: 'NIST SSDF SP 800-218',
  AI: 'NIST AI RMF / GenAI Profile',
  UAE: 'UAE PDPL / applicable UAE requirements'
};

const d = (id: string, name: string, family: string, risk: Risk, topics: string[], weight = 1, frameworks = [F.CIS, F.NIST, F.ISO], tags: string[] = [], applicability: string[] = ['core']): DomainBlueprint =>
  ({ id, name, family, risk, weight, topics, frameworks, tags, applicability });

export const DOMAIN_BLUEPRINTS: DomainBlueprint[] = [
  d('gov-strategy','IT Governance & Strategy','governance','high',['IT strategy and business alignment','IT governance forums and decision rights','technology roadmap and architecture principles']),
  d('gov-org','IT Organisation, Roles & Staffing','governance','medium',['IT organisation structure and role descriptions','segregation of duties and key-person dependency','skills, training, succession and outsourced staffing']),
  d('gov-policy','IT Policies & Standards','governance','high',['policy framework ownership and approval','policy communication and acknowledgement','standards, procedures and exception management']),
  d('gov-risk','IT & Cyber Risk Management','governance','high',['IT risk register and risk ownership','risk assessment methodology and treatment plans','risk acceptance, escalation and board reporting']),
  d('gov-metrics','IT KPI, KRI & Management Reporting','governance','medium',['service and security KPIs','risk and control KRIs','management dashboards and action tracking']),
  d('financial-budget','IT Budget & Cost Governance','commercial','medium',['annual IT budget and forecast','capex and opex classification','budget variance, accrual and cost-centre ownership']),
  d('procurement','IT Procurement & Purchasing','commercial','high',['purchase request and approval workflow','approved suppliers, quotations and purchase orders','receipt, invoice matching and asset registration']),
  d('vendor','IT Vendor & Third-Party Management','commercial','high',['vendor inventory and service ownership','due diligence, security and privacy assessment','performance, SLA, access and exit management']),
  d('contracts','IT Contracts, Renewal & Termination','commercial','high',['contract register, expiry and notice periods','auto-renewal, termination and early-exit obligations','commercial terms, SLAs, liabilities and ownership']),
  d('insurance','IT Asset & Cyber Insurance','commercial','medium',['insured IT asset schedule and declared values','cyber insurance control representations','claims, exclusions, renewals and incident notification']),

  d('asset-governance','IT Asset Management Governance','asset','high',['asset policy, ownership and custodianship','asset taxonomy, tagging and status model','asset verification frequency and exception handling'],1,[F.ITAM,F.CIS,F.ISO]),
  d('asset-physical','Physical IT Asset Inventory','asset','high',['company-owned hardware','leased, rented and vendor-owned equipment','client, landlord, loan and temporary equipment'],1,[F.ITAM,F.CIS,F.ISO]),
  d('asset-laptops','Laptops, Desktops & Workstations','asset','high',['laptops and notebooks','desktops, workstations and thin clients','spare, loaner and shared computers']),
  d('asset-mobile','Corporate Mobile Devices & Tablets','asset','high',['smartphones and tablets','rugged handheld mobile devices','shared, kiosk and dedicated mobile devices'],1,[F.ITAM,F.MOBILE,F.CIS]),
  d('asset-byod','BYOD / CYOD / COPE / COBO','security','high',['personal devices accessing corporate data','corporate-owned personally enabled devices','device-choice, reimbursement and consent models'],1,[F.MOBILE,F.CIS,F.ISO]),
  d('asset-peripherals','Peripheral Devices & Accessories','asset','medium',['monitors, docks, keyboards, mice and headsets','chargers, adapters, cables and power banks','webcams, card readers, signature pads and specialist peripherals']),
  d('asset-removable','Removable Media & Portable Storage','security','high',['USB flash drives and external storage','removable media authorization and encryption','media issue, return, loss and destruction']),
  d('asset-av','Meeting Room, AV & Collaboration Equipment','asset','medium',['Teams/Zoom room systems and controllers','conference cameras, microphones and speakers','projectors, interactive displays and digital signage']),
  d('asset-warehouse','Warehouse, Barcode, RFID & Field Devices','asset','medium',['barcode scanners and mobile terminals','RFID readers, label printers and handhelds','field devices, scanners and operational tablets']),
  d('asset-pos','POS & Payment Endpoint Assets','asset','high',['POS terminals and receipt printers','payment terminals and pin pads','kiosks and retail transaction devices']),

  d('telecom-sim','SIM, eSIM & Mobile Number Inventory','telecom','high',['physical SIMs and ICCIDs','eSIMs, EIDs and device associations','mobile numbers, spare SIMs and M2M/IoT SIMs']),
  d('telecom-plan','Carrier Plans, Usage & Billing','telecom','high',['voice, data and roaming plans','monthly usage, overage and spend limits','unused, dormant and duplicate mobile subscriptions']),
  d('telecom-finance','Carrier-Financed Devices & Installments','telecom','high',['device installment contracts','remaining installment and early termination liability','device return, transfer and continued billing']),
  d('telecom-fixed','Fixed Voice, DID, SIP & PBX','telecom','medium',['fixed lines, DIDs and toll-free numbers','SIP trunks and voice gateways','cloud/on-premises PBX and extensions']),
  d('telecom-internet','Internet, WAN, MPLS & SD-WAN Services','telecom','high',['internet circuits and carrier identifiers','MPLS, leased lines and SD-WAN services','backup LTE/5G and redundant connectivity']),
  d('telecom-iot','IoT / M2M Connectivity','telecom','high',['data-only and embedded SIM services','device-to-SIM and site mapping','carrier APN, roaming and data usage controls']),

  d('printer-commercial','Printers, MFPs & Managed Print Commercials','asset','medium',['owned, leased and rented printers/MFPs','managed print contracts and cost-per-page','meter readings, consumables, SLA and billing']),
  d('printer-security','Printer / MFP Security','security','high',['printer firmware, admin accounts and network exposure','secure print, scan-to-email and stored jobs','MFP hard disks, address books and data sanitization']),
  d('printer-return','Printer Lease Return & Sanitisation','resilience','high',['final meter and vendor return evidence','credential, address-book and stored-data removal','storage sanitization and billing cessation'],1,[F.SANITIZE,F.ISO,F.ITAM]),

  d('physical-server-room','Server / Network Room Physical Security','physical','high',['room access control and visitor management','rack locking, labelling and cable management','housekeeping, storage and unauthorized equipment']),
  d('physical-environment','Environmental & Facility Controls','physical','high',['temperature, humidity and environmental monitoring','water leak, flood and physical hazard protection','fire detection, suppression and emergency response']),
  d('physical-power','UPS, Generator & Power Resilience','physical','high',['UPS capacity, battery condition and testing','generator, ATS and fuel readiness','PDU, surge protection and graceful shutdown']),
  d('physical-cctv','CCTV & Video Surveillance','security','high',['camera inventory, coverage and retention','NVR/DVR access, firmware and network segmentation','privacy, evidence access and exported footage']),
  d('physical-access','Physical Access Control & Biometrics','security','high',['badges, cards and biometric readers','access groups, privileged areas and review','joiner/leaver revocation and access logs']),
  d('physical-visitors','Visitor, Contractor & Delivery Controls','physical','medium',['visitor registration and escort','contractor access and temporary badges','delivery access to sensitive IT areas']),

  d('server','Servers & Operating Systems','asset','high',['physical and virtual servers','server operating systems and support lifecycle','server roles, ownership and criticality']),
  d('storage','Storage, NAS, SAN & File Services','asset','high',['NAS, SAN and storage appliances','file shares, quotas and permissions','storage capacity, resilience and firmware']),
  d('virtualization','Virtualisation & Hypervisors','security','high',['VMware, Hyper-V and other hypervisors','management consoles, privileged access and patching','VM inventory, snapshots, templates and sprawl']),
  d('network-core','Network Infrastructure','security','high',['routers, switches and network controllers','VLANs, routing and segmentation','management interfaces, configuration and firmware']),
  d('network-wifi','Wireless / Wi-Fi Security','security','high',['corporate and guest SSIDs','WPA configuration, authentication and shared keys','wireless controllers, AP firmware and rogue APs']),
  d('network-firewall','Firewalls, IDS/IPS & Perimeter Security','security','critical',['firewall inventory, HA and firmware','rulebase, NAT, exposed services and temporary rules','IDS/IPS, web filtering and administrator access']),
  d('network-remote','Remote Access, VPN & ZTNA','security','critical',['remote access technologies and approved tools','MFA, device posture and privileged remote access','vendor remote access, logging and termination']),
  d('network-dns','DNS, DHCP, NTP & Core Network Services','security','high',['DNS services, zones and forwarders','DHCP scopes and unauthorized services','NTP/time synchronization and resilient core services']),
  d('network-architecture','Network Architecture & Documentation','governance','high',['current network diagrams and data flows','site, cloud and third-party connectivity','single points of failure and segmentation design']),

  d('cloud-governance','Cloud Governance & Account Structure','governance','high',['Azure/AWS/GCP account and subscription inventory','landing zones, policies, tagging and ownership','cloud security responsibilities and guardrails']),
  d('cloud-iam','Cloud IAM & Privileged Access','security','critical',['cloud administrator and root accounts','MFA, conditional access and role assignment','service principals, managed identities and access review']),
  d('cloud-config','Cloud Configuration & Exposure','security','critical',['public storage and Internet-exposed resources','security groups, network ACLs and firewalls','security baseline, posture management and drift']),
  d('cloud-logging','Cloud Logging, Monitoring & Alerts','security','high',['activity/audit logs and retention','security alerts and centralized monitoring','log gaps, disabled monitoring and incident escalation']),
  d('cloud-finops','Cloud FinOps & Cost Optimisation','commercial','medium',['idle compute, orphan storage and unused IPs','budgets, alerts, reservations and commitments','tagging, chargeback and anomalous cloud spend']),

  d('identity-directory','Identity & Directory Services','security','critical',['Active Directory / Entra ID users and groups','identity lifecycle and authoritative source','directory health, synchronization and legacy authentication']),
  d('identity-accounts','User, Shared & Service Accounts','security','critical',['named user accounts and uniqueness','shared, generic and dormant accounts','service accounts, ownership and credential rotation']),
  d('identity-privileged','Privileged Access Management','security','critical',['Global Admin, Domain Admin, root and equivalent roles','PAM/PIM, elevation and just-in-time access','break-glass accounts, admin workstations and reviews']),
  d('identity-auth','Authentication, Password & MFA','security','critical',['MFA coverage and authentication methods','password, passkey and lockout policy','legacy/basic authentication and risky sign-ins']),
  d('identity-jml','Joiner, Mover & Leaver Controls','operations','critical',['new-user approval and provisioning','role/department changes and access adjustment','termination, account disablement and asset recovery']),
  d('identity-access-review','Access Reviews & Segregation of Duties','security','high',['periodic access certification','role-based access and least privilege','conflicting access and segregation-of-duties exceptions']),

  d('m365-tenant','Microsoft 365 Tenant Governance','security','high',['tenant settings and service ownership','admin roles and security defaults/baselines','licensing, tenant domains and external collaboration']),
  d('m365-exchange','Exchange Online & Email Security','security','critical',['mailbox access, forwarding and delegates','anti-phishing, anti-spam and malware controls','mail flow, transport rules and external forwarding']),
  d('m365-sharepoint','SharePoint, OneDrive & External Sharing','security','high',['sites, owners and sharing settings','external guests, anonymous links and stale access','data lifecycle, retention and sensitive content']),
  d('m365-teams','Teams & Collaboration Security','security','medium',['team ownership and guest access','external federation, meetings and recordings','apps, bots and third-party integrations']),
  d('email-domain','Email Domain Protection','security','high',['SPF records and sender authorization','DKIM signing and key rotation','DMARC policy, reporting and impersonation protection']),

  d('endpoint-security','Endpoint Security & EDR','security','critical',['EDR/antivirus deployment and health','host firewall, tamper protection and isolation','endpoint alerts, exclusions and remediation']),
  d('endpoint-config','Endpoint Configuration & Hardening','security','high',['secure configuration baseline','local administrator rights and device control','screen lock, encryption and security settings']),
  d('endpoint-mdm','MDM / UEM Device Management','security','high',['device enrollment and compliance','configuration profiles, app policies and check-in','remote lock/wipe, lost mode and stale devices'],1,[F.MOBILE,F.CIS,F.ISO]),
  d('patching','Patch & Update Management','security','critical',['operating system patching','third-party application updates','firmware, network and appliance updates']),
  d('vulnerability','Vulnerability Management','security','critical',['authenticated internal scanning','external attack-surface scanning','prioritization, remediation SLA and exceptions']),
  d('pentest','Penetration Testing & Security Validation','security','high',['external and internal penetration testing','application/API testing and retesting','scope, findings, remediation and management acceptance']),
  d('logging','Logging, SIEM & Security Monitoring','security','critical',['centralized security logging','SIEM correlation, alerting and coverage','log retention, time sync and privileged log access']),
  d('soc','SOC / MDR / Managed Security Operations','commercial','high',['SOC/MDR scope and monitored assets','alert triage, escalation and response SLA','provider performance, gaps and evidence']),
  d('ransomware','Ransomware Readiness','resilience','critical',['attack prevention and privileged-access controls','immutable/offline recovery capability','ransomware playbooks, exercises and recovery tests']),

  d('backup','Backup Management','resilience','critical',['backup scope and job success','retention, encryption and offsite/immutable copies','backup administrator separation and monitoring']),
  d('backup-saas','SaaS / M365 Backup','resilience','high',['M365 and SaaS backup coverage','retention, legal/operational recovery needs','restore tests and vendor dependency']),
  d('restore','Restore Testing & Recovery Evidence','resilience','critical',['file, VM and database restore tests','sampled restore success and integrity','failed restores, lessons and corrective action']),
  d('dr','Disaster Recovery','resilience','critical',['RTO/RPO and application recovery priorities','DR architecture, dependencies and runbooks','failover/failback testing and remediation']),
  d('bcp','Business Continuity & Technology Dependencies','resilience','high',['critical business processes and technology dependencies','alternate work methods and communication','BCP exercises, outage scenarios and action plans']),
  d('availability','Availability, Capacity & Resilience','resilience','high',['capacity thresholds and utilization','redundancy, clustering and failover','availability monitoring, outages and trend analysis']),

  d('data-inventory','Data Inventory & Information Assets','data','high',['structured and unstructured data repositories','data owners, business purpose and system mapping','personal, confidential and regulated data locations']),
  d('data-classification','Data Classification & Handling','data','high',['classification scheme and labelling','handling rules by classification','user awareness and exception handling']),
  d('data-access','Data Access & Least Privilege','data','critical',['access to sensitive data repositories','group ownership and permission inheritance','periodic access review and excessive permissions']),
  d('data-retention','Data Retention, Archiving & Deletion','data','high',['retention schedules and legal requirements','automated retention/archiving controls','deletion, defensible disposal and exceptions']),
  d('data-dlp','Data Loss Prevention','data','critical',['endpoint, email and cloud DLP controls','USB, printing, upload and sharing restrictions','DLP incidents, overrides and tuning']),
  d('data-encryption','Encryption & Key Management','data','critical',['encryption at rest and in transit','BitLocker/FileVault/storage/database encryption','key custody, rotation, backup and recovery']),
  d('data-privacy','Privacy & Personal Data Protection','compliance','critical',['personal data processing inventory and lawful purpose','processor/vendor, sharing and cross-border transfers','data subject requests, breach handling and privacy controls'],1,[F.UAE,F.ISO,F.NIST]),
  d('data-records','Records Management & Legal Hold','compliance','high',['records classification and authoritative copies','litigation/legal hold and preservation','archive access, retention and defensible disposal']),

  d('software-inventory','Software Inventory & Authorized Software','application','high',['installed desktop and server software','mobile apps, browser extensions and utilities','authorized, unsupported and prohibited software'],1,[F.CIS,F.ITAM,F.ISO]),
  d('software-license','Software Licensing & Entitlements','commercial','high',['purchased licence entitlements','assigned, installed and actively used licences','under-licensing, excess licensing and true-up exposure'],1,[F.ITAM,F.CIS,F.ISO]),
  d('saas','SaaS Subscription Management','commercial','high',['approved SaaS inventory and owners','subscription plans, seats and active usage','renewal, cancellation and departed-user licences']),
  d('shadow-it','Shadow IT & Unapproved Cloud Services','security','high',['unapproved SaaS and personal cloud services','corporate-card and expense-funded software','browser extensions, file-sharing and unmanaged applications']),
  d('ai','AI / Generative AI / Shadow AI','compliance','high',['approved GenAI tools and account models','corporate data, code and document use with AI','AI agents, meeting bots, extensions, APIs and governance'],1,[F.AI,F.NIST,F.ISO]),

  d('apps-portfolio','Business Application Portfolio','application','high',['business application inventory and ownership','criticality, user population and data processed','support model, lifecycle and end-of-life risks']),
  d('apps-access','Application Access & Administration','application','critical',['application user and admin access','roles, segregation and privileged functions','access reviews, dormant users and shared accounts']),
  d('sdlc','Secure Software Development Lifecycle','application','high',['secure SDLC governance and requirements','code review, testing and security gates','release, deployment and vulnerability remediation'],1,[F.SSDF,F.CIS,F.ISO]),
  d('source-code','Source Code, Git & DevOps Security','application','critical',['repository inventory, ownership and access','branch protection, MFA and privileged developer access','CI/CD secrets, runners and release controls']),
  d('database','Database Security & Administration','application','critical',['database inventory, ownership and versions','DBA access, service accounts and authentication','encryption, logging, backup and privileged activity']),
  d('api','API & Integration Security','application','critical',['API and integration inventory','API authentication, tokens, OAuth apps and secrets','rate limits, logging, exposed endpoints and lifecycle']),
  d('web','Websites, CMS & Hosting','application','high',['website and hosting inventory','CMS/plugins, administrators and patching','WAF, backups, certificates and security monitoring']),
  d('domain-dns','Domains, Registrars & DNS Governance','application','high',['corporate domains and registrars','registrar MFA, ownership and renewal','DNS records, stale subdomains and unauthorized changes']),
  d('certs','Certificates, PKI & TLS','security','high',['public and internal certificate inventory','expiry monitoring and renewal','private-key protection, wildcard use and certificate authorities']),
  d('secrets','Secrets, API Keys & Credentials','security','critical',['secret inventory and approved storage','credentials embedded in code/scripts/configuration','rotation, exposure response and departed-owner secrets']),

  d('change','IT Change Management','operations','high',['normal change request, approval and testing','emergency changes and retrospective approval','rollback, segregation and production evidence']),
  d('config','Configuration Management & Baselines','operations','high',['configuration standards and golden builds','CMDB/configuration item accuracy','configuration drift, unauthorized change and remediation']),
  d('service-desk','Service Desk & Incident Ticketing','operations','medium',['ticket intake, categorization and ownership','SLA response/resolution and escalation','backlog, ageing and user satisfaction']),
  d('problem','Problem Management & Root Cause Analysis','operations','medium',['recurring incident identification','root-cause analysis and known errors','permanent fixes and trend reduction']),
  d('ops-jobs','IT Operations, Scheduled Jobs & Batch Processing','operations','high',['scheduled job inventory and ownership','failed jobs, reruns and operational monitoring','privileged batch accounts and change control']),
  d('monitoring','Infrastructure Monitoring & Alerting','operations','high',['server, network, storage and service monitoring','thresholds, alert routing and on-call coverage','monitoring gaps, stale alerts and false positives']),
  d('documentation','IT Documentation & Knowledge Management','governance','medium',['architecture, configuration and operating documentation','runbooks, recovery procedures and contact lists','document ownership, currency and secure access']),

  d('incident','Cybersecurity Incident Response','resilience','critical',['incident response plan and severity model','roles, communications and regulatory escalation','forensics, evidence, lessons learned and exercises']),
  d('awareness','Security Awareness & Phishing','governance','high',['annual and onboarding security training','phishing simulation and targeted coaching','privileged, developer and role-specific training']),
  d('fraud','IT Fraud, Abuse & Leakage Indicators','compliance','high',['ghost assets, SIMs and subscriptions','unauthorized purchases, conflicts and duplicate billing','privilege abuse, unusual activity and investigation']),
  d('legal-reg','Legal, Regulatory & Contractual IT Compliance','compliance','high',['applicable legal/regulatory requirements','customer and contractual security obligations','evidence, exceptions and compliance attestations']),
  d('audit-followup','Previous Audit Findings & Remediation','governance','high',['open prior findings and ownership','target dates, overdue items and risk acceptance','closure evidence, validation and repeat findings']),

  d('stock','IT Stores, Spares & Inventory Counts','asset','medium',['new and spare equipment in storage','consumables, accessories and quantity-tracked items','physical count, variances and restricted store access']),
  d('repair','Repair, RMA, Warranty & Loan Devices','asset','medium',['assets sent for repair or RMA','temporary replacement and loan devices','vendor custody, ageing and return evidence']),
  d('lost','Lost, Stolen & Damaged Assets','operations','high',['lost/stolen incident reporting','remote lock/wipe, SIM suspension and IMEI action','insurance/police evidence, liability and replacement']),
  d('disposal','Asset Disposal, E-Waste & Media Sanitisation','compliance','critical',['retirement approval and asset-register closure','media wipe/destruction and sanitization evidence','approved recycler, destruction certificate and serial reconciliation'],1,[F.SANITIZE,F.ITAM,F.ISO]),
  d('employee-passport','Employee IT Assignment / IT Passport','asset','high',['device, peripheral and access-card assignments','software, licences, SIMs and subscriptions per employee','transfer, return and termination reconciliation']),
  d('reconciliation','Cross-System IT Reconciliation','operations','critical',['HR versus identity and access','asset/MDM/EDR versus physical inventory','finance/procurement/carrier/SaaS versus IT registers']),
  d('cost-leakage','IT Cost Leakage & Optimisation','commercial','high',['unused licences and subscriptions','inactive SIMs, carrier overage and duplicate services','orphan assets, stale contracts and avoidable recurring spend']),
  d('audit-evidence','Audit Evidence Integrity & Chain of Custody','compliance','high',['evidence timestamp, auditor and site association','original file preservation and hash/integrity','review, sign-off, amendment history and retention'])
];

const PATTERNS: Record<string, (topic: string) => Array<{q:string;o:string;e:string;tags:string[]}>> = {
  asset: (t) => [
    { q:`Is a complete and current inventory maintained for ${t}, including unique identifier, site, custodian, status and last verification?`, o:'Establish completeness and accountability of the asset population.', e:'Asset register extract plus sampled physical/logical evidence.', tags:['inventory','ownership'] },
    { q:`Can sampled ${t} be reconciled between the system record and the actual physical/logical item, with discrepancies investigated?`, o:'Confirm existence, accuracy and location.', e:'Scan/photograph/serial or management-console evidence and reconciliation notes.', tags:['reconciliation','physical-verification'] },
    { q:`Are purchase, lease/rental/finance, warranty/support, supplier and cost details captured and validated for ${t} where applicable?`, o:'Confirm legal ownership and financial obligations.', e:'PO/invoice/contract/warranty or finance evidence.', tags:['commercial','finance'] },
    { q:`Are assignment, transfer, repair, loss, return, retirement and disposal controls defined and evidenced for ${t}?`, o:'Confirm end-to-end lifecycle control.', e:'Assignment/transfer/repair/disposal records and approvals.', tags:['lifecycle'] }
  ],
  telecom: (t) => [
    { q:`Is the complete population of ${t} recorded with carrier/account, assigned employee/device/site, status and unique telecom identifiers?`, o:'Ensure telecom services and devices are attributable.', e:'Carrier inventory/invoice and internal telecom register.', tags:['telecom','inventory'] },
    { q:`Are plan, recurring charge, allowances, contract term, installment/commitment and termination liabilities for ${t} documented and reconciled to billing?`, o:'Validate telecom commercial obligations and billing accuracy.', e:'Carrier contract and recent invoices.', tags:['billing','contract'] },
    { q:`Are dormant, unassigned, duplicate, excessive-use, roaming/IDD and departed-user exceptions for ${t} detected and remediated?`, o:'Prevent cost leakage and unauthorized use.', e:'Usage report, HR comparison and exception log.', tags:['usage','leakage'] },
    { q:`Are security, activation, transfer, suspension, loss, eSIM/SIM reassignment and cancellation controls operating for ${t}?`, o:'Protect telecom identities and linked corporate access.', e:'Carrier/MDM actions, tickets and approvals.', tags:['security','lifecycle'] }
  ],
  commercial: (t) => [
    { q:`Is a complete, owned and approved record maintained for ${t}?`, o:'Ensure commercial completeness and accountability.', e:'Register, owner confirmation and approval evidence.', tags:['commercial','governance'] },
    { q:`Are price, quantity, term, SLA, renewal/notice, payment and termination conditions for ${t} accurately recorded and independently validated?`, o:'Prevent financial and contractual exposure.', e:'Contract/PO/invoice and reconciliation.', tags:['contract','financial'] },
    { q:`Are actual charges and usage for ${t} periodically reconciled to entitlement, active users/assets/services and agreed commercial terms?`, o:'Detect overbilling, underutilization and leakage.', e:'Invoice, usage/assignment export and reconciliation.', tags:['reconciliation','leakage'] },
    { q:`Are exceptions, upcoming renewals, auto-renewals, disputes and avoidable spend relating to ${t} reported and actioned before deadlines?`, o:'Ensure proactive commercial management.', e:'Renewal calendar, exception report and actions.', tags:['renewal','exceptions'] }
  ],
  governance: (t) => [
    { q:`Is ${t} formally defined, approved, assigned to accountable owners and aligned with business/risk requirements?`, o:'Establish governance and accountability.', e:'Approved policy/charter/strategy/RACI.', tags:['governance','ownership'] },
    { q:`Are decisions, approvals, risks and exceptions relating to ${t} documented with appropriate authority and segregation?`, o:'Ensure controlled decision-making.', e:'Minutes, approvals, risk/exception records.', tags:['approval','risk'] },
    { q:`Is implementation of ${t} measured using reliable evidence, KPIs/KRIs or periodic control testing?`, o:'Confirm governance operates in practice.', e:'Dashboards, samples, review records.', tags:['monitoring','evidence'] },
    { q:`Is ${t} periodically reviewed for effectiveness, changes in business/technology/regulation and overdue corrective actions?`, o:'Keep governance current and effective.', e:'Review dates, version history and action tracker.', tags:['review','improvement'] }
  ],
  security: (t) => [
    { q:`Is a documented security baseline and accountable owner established for ${t}?`, o:'Define expected protection and ownership.', e:'Standard/baseline, inventory and owner.', tags:['security','baseline'] },
    { q:`Does sampled evidence confirm ${t} is securely configured and access is limited to authorized users/services with least privilege?`, o:'Validate technical implementation.', e:'Configuration screenshots/exports and access lists.', tags:['configuration','access'] },
    { q:`Are security events, vulnerabilities, unauthorized changes and exceptions affecting ${t} logged, monitored and remediated within defined SLA?`, o:'Ensure detection and remediation.', e:'Logs, alerts, scan results, tickets.', tags:['monitoring','vulnerability'] },
    { q:`Is ${t} periodically reviewed, patched/updated where applicable, and decommissioned or access-revoked securely when no longer required?`, o:'Maintain lifecycle security.', e:'Review/patch/decommission evidence.', tags:['lifecycle','patching'] }
  ],
  application: (t) => [
    { q:`Is ${t} inventoried with business/technical owner, purpose, criticality, users, data classification, dependencies and support lifecycle?`, o:'Maintain accountable application inventory.', e:'Application register/CMDB and owner confirmation.', tags:['application','inventory'] },
    { q:`Are authentication, authorization, privileged access, secure configuration and secrets controls effective for ${t}?`, o:'Protect application access and configuration.', e:'Role/admin exports, config and secret-management evidence.', tags:['access','secrets'] },
    { q:`Are changes, patches, code/config releases, vulnerabilities and third-party dependencies for ${t} tested, approved and remediated?`, o:'Reduce application change and vulnerability risk.', e:'Change/release records, scan/test results.', tags:['change','vulnerability'] },
    { q:`Are logging, monitoring, backup/recovery, availability, data retention and end-of-life controls defined and tested for ${t}?`, o:'Ensure operational resilience and auditability.', e:'Logs, monitoring, backup/restore and lifecycle records.', tags:['logging','resilience'] }
  ],
  operations: (t) => [
    { q:`Is an approved operating process, accountable owner, service target and escalation path defined for ${t}?`, o:'Establish consistent operations.', e:'Procedure/runbook/RACI/SLA.', tags:['operations','process'] },
    { q:`Do sampled records demonstrate ${t} is performed completely, accurately, timely and with required approvals/evidence?`, o:'Validate operating effectiveness.', e:'Tickets, job logs, approvals and samples.', tags:['testing','evidence'] },
    { q:`Are failures, backlog, SLA breaches, recurring issues and control exceptions in ${t} monitored and escalated?`, o:'Detect operational weakness.', e:'Metrics, exception reports and escalations.', tags:['monitoring','exceptions'] },
    { q:`Are trends, root causes, automation opportunities and corrective actions for ${t} periodically reviewed to improve performance?`, o:'Drive continuous improvement.', e:'RCA, trend review and improvement actions.', tags:['improvement','root-cause'] }
  ],
  resilience: (t) => [
    { q:`Is the scope, business criticality, owner, recovery target and dependency mapping defined for ${t}?`, o:'Define resilience requirements.', e:'BIA/RTO/RPO/service inventory.', tags:['resilience','scope'] },
    { q:`Are architecture, redundancy, protection, access and recovery arrangements for ${t} implemented as designed?`, o:'Validate resilience capability.', e:'Architecture/configuration and protection evidence.', tags:['architecture','protection'] },
    { q:`Is ${t} tested through realistic recovery/failover/restore exercises with measurable results and retained evidence?`, o:'Prove recovery works.', e:'Test scripts, timestamps, results and screenshots.', tags:['testing','recovery'] },
    { q:`Are failures, unmet targets, single points of failure and test findings for ${t} tracked to timely remediation and management acceptance?`, o:'Close resilience gaps.', e:'Issue register and remediation evidence.', tags:['remediation','risk'] }
  ],
  data: (t) => [
    { q:`Is ${t} identified with owner, purpose, classification, systems/locations, data subjects and applicable retention/legal requirements?`, o:'Establish visibility and accountability for information.', e:'Data inventory/ROPA/classification records.', tags:['data','inventory'] },
    { q:`Are access control, encryption, transmission, storage and handling protections appropriate for ${t} and its classification?`, o:'Protect confidentiality and integrity.', e:'Access/configuration/encryption evidence.', tags:['protection','access'] },
    { q:`Are sharing, processing, retention, backup, archive, deletion and third-party handling of ${t} controlled and evidenced?`, o:'Control the information lifecycle.', e:'Retention/sharing/vendor/backup evidence.', tags:['lifecycle','sharing'] },
    { q:`Are unauthorized access, leakage, loss, privacy incidents and policy exceptions involving ${t} detected, investigated and remediated?`, o:'Ensure monitoring and response.', e:'DLP/SIEM/incidents/exceptions.', tags:['incident','monitoring'] }
  ],
  compliance: (t) => [
    { q:`Have applicable legal, regulatory, contractual and internal requirements for ${t} been identified, mapped to owners and translated into controls?`, o:'Establish compliance obligations.', e:'Compliance register/control mapping.', tags:['compliance','requirements'] },
    { q:`Does retained evidence demonstrate operating compliance with the requirements applicable to ${t}?`, o:'Verify compliance in practice.', e:'Control evidence, samples and attestations.', tags:['evidence','testing'] },
    { q:`Are deviations, waivers, breaches and non-compliance affecting ${t} documented, risk-assessed, approved and remediated?`, o:'Control compliance exceptions.', e:'Exception/breach records and actions.', tags:['exceptions','remediation'] },
    { q:`Is ${t} periodically reassessed when laws, contracts, technology or processing activities change?`, o:'Keep compliance current.', e:'Periodic review/change assessment.', tags:['review','change'] }
  ],
  physical: (t) => [
    { q:`Is ${t} physically identified, documented, owned and included in the site inspection scope?`, o:'Ensure the physical control population is complete.', e:'Site plan/register plus photographs.', tags:['physical','inventory'] },
    { q:`Does direct inspection confirm ${t} is appropriately secured, labelled, maintained and protected against unauthorized access or environmental hazards?`, o:'Validate physical protection.', e:'Timestamped photographs and auditor observation.', tags:['inspection','security'] },
    { q:`Are inspections, tests, maintenance, alarms and access/activity records for ${t} retained and reviewed at defined intervals?`, o:'Ensure ongoing effectiveness.', e:'Maintenance/test/access logs.', tags:['maintenance','monitoring'] },
    { q:`Are defects, bypasses, failures and exceptions involving ${t} promptly escalated, corrected and evidenced to closure?`, o:'Remediate physical control weaknesses.', e:'Tickets/findings and closure evidence.', tags:['exceptions','remediation'] }
  ]
};

function severityWeight(risk: Risk): number {
  return risk === 'critical' ? 5 : risk === 'high' ? 4 : risk === 'medium' ? 3 : risk === 'low' ? 2 : 1;
}

export function buildMasterControlLibrary(): Control[] {
  const controls: Control[] = [];
  for (const domain of DOMAIN_BLUEPRINTS) {
    const pattern = PATTERNS[domain.family] ?? PATTERNS.governance;
    domain.topics.forEach((topic, topicIndex) => {
      pattern(topic).forEach((p, checkIndex) => {
        controls.push({
          id: `${domain.id}-${String(topicIndex + 1).padStart(2,'0')}-${checkIndex + 1}`,
          domain: domain.name,
          subdomain: topic,
          question: p.q,
          objective: p.o,
          evidenceRequired: p.e,
          defaultRisk: domain.risk,
          weight: domain.weight * severityWeight(domain.risk),
          frameworks: domain.frameworks ?? [F.CIS,F.NIST,F.ISO],
          tags: [...(domain.tags ?? []), ...p.tags, domain.id],
          applicability: domain.applicability ?? ['core']
        });
      });
    });
  }
  return controls;
}

export const MASTER_CONTROLS = buildMasterControlLibrary();
export const MASTER_CONTROL_COUNT = MASTER_CONTROLS.length;
export const DOMAIN_COUNT = DOMAIN_BLUEPRINTS.length;

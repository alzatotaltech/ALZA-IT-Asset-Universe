export type ResponseStatus = 'compliant' | 'mostly_compliant' | 'partial' | 'non_compliant' | 'not_verified' | 'na';
export type Risk = 'critical' | 'high' | 'medium' | 'low' | 'observation';
export type AuditState = 'draft' | 'fieldwork' | 'review' | 'closed';
export type OwnershipModel = 'company_owned' | 'carrier_financed' | 'bank_installment' | 'finance_lease' | 'operating_lease' | 'rental' | 'managed_service' | 'vendor_owned' | 'employee_owned_byod' | 'client_owned' | 'landlord_owned' | 'loan' | 'bundled_service' | 'temporary' | 'shared' | 'unknown';
export type UserRole = 'super_admin' | 'audit_manager' | 'auditor' | 'it_manager' | 'finding_owner' | 'reviewer' | 'read_only';

export interface Control {
  id: string;
  domain: string;
  subdomain: string;
  question: string;
  objective: string;
  evidenceRequired: string;
  defaultRisk: Risk;
  weight: number;
  frameworks: string[];
  tags: string[];
  applicability: string[];
}

export interface AuditResponse {
  id: string;
  orgId: string;
  auditId: string;
  controlId: string;
  status: ResponseStatus;
  notes?: string;
  evidenceCount?: number;
  sampleSize?: number;
  sampleFailed?: number;
  reviewedBy?: string;
  updatedAt: string;
  updatedBy?: string;
  syncState?: 'local' | 'synced' | 'error';
}

export interface AuditScore {
  score: number;
  answered: number;
  totalApplicable: number;
  criticalFailures: number;
  highFailures: number;
  grade: 'Strong' | 'Moderate' | 'Weak' | 'Critical';
}

export interface ReconciliationIssue {
  code: string;
  severity: Risk;
  title: string;
  detail: string;
  entityType: string;
  entityId?: string;
  estimatedMonthlyLeakage?: number;
}

export interface DomainBlueprint {
  id: string;
  name: string;
  family: string;
  risk: Risk;
  weight: number;
  topics: string[];
  frameworks?: string[];
  tags?: string[];
  applicability?: string[];
}

export interface BaseRecord {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  syncState?: 'local' | 'synced' | 'error';
}

export interface Organization extends BaseRecord {
  name: string;
  legalName?: string;
  country: string;
  industry?: string;
  website?: string;
  primaryContact?: string;
  notes?: string;
}

export interface Site extends BaseRecord {
  name: string;
  code: string;
  address?: string;
  city?: string;
  country?: string;
  siteType?: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  employees?: number;
  itContact?: string;
  active: boolean;
  notes?: string;
}

export interface Asset extends BaseRecord {
  siteId?: string;
  assetTag?: string;
  category: string;
  subcategory?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  imei1?: string;
  imei2?: string;
  eid?: string;
  hostname?: string;
  macAddress?: string;
  ipAddress?: string;
  assignedTo?: string;
  department?: string;
  locationDetail?: string;
  ownershipModel: OwnershipModel;
  supplier?: string;
  purchaseDate?: string;
  purchaseAmount?: number;
  currency?: string;
  poNumber?: string;
  invoiceNumber?: string;
  fixedAssetNumber?: string;
  warrantyExpiry?: string;
  contractId?: string;
  financeMonths?: number;
  financeRemainingMonths?: number;
  monthlyInstallment?: number;
  earlyTerminationLiability?: number;
  quantity?: number;
  quantityIssued?: number;
  quantitySpare?: number;
  leaseStart?: string;
  leaseEnd?: string;
  leaseNoticeDays?: number;
  monthlyRental?: number;
  monoCostPerPage?: number;
  colorCostPerPage?: number;
  includedMonoPages?: number;
  includedColorPages?: number;
  monoMeter?: number;
  colorMeter?: number;
  maintenanceProvider?: string;
  maintenanceSla?: string;
  consumablesIncluded?: boolean;
  securePrint?: boolean;
  adminPasswordChanged?: boolean;
  storageEncryption?: boolean;
  returnDueDate?: string;
  dataSanitizedAt?: string;
  status: 'in_use' | 'spare' | 'loan' | 'repair' | 'lost' | 'stolen' | 'retired' | 'disposed' | 'returned' | 'unknown';
  condition?: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  os?: string;
  osVersion?: string;
  encryption?: boolean;
  edr?: string;
  mdm?: string;
  mdmCompliant?: boolean;
  lastVerifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface TelecomRecord extends BaseRecord {
  siteId?: string;
  type: 'sim' | 'esim' | 'mobile_plan' | 'iot_sim' | 'fixed_line' | 'sip' | 'internet' | 'mpls' | 'sdwan' | 'lte_backup';
  carrier: string;
  accountNumber?: string;
  mobileNumber?: string;
  iccid?: string;
  imsi?: string;
  eid?: string;
  assignedTo?: string;
  assetId?: string;
  department?: string;
  planName?: string;
  monthlyCharge?: number;
  currency?: string;
  dataAllowanceGb?: number;
  roamingEnabled?: boolean;
  iddEnabled?: boolean;
  spendLimit?: number;
  contractStart?: string;
  contractEnd?: string;
  commitmentMonths?: number;
  deviceInstallment?: number;
  installmentRemainingMonths?: number;
  earlyTerminationLiability?: number;
  lastUsedAt?: string;
  status: 'active' | 'spare' | 'suspended' | 'disconnected' | 'unknown';
  notes?: string;
}

export interface SoftwareRecord extends BaseRecord {
  name: string;
  publisher?: string;
  category?: string;
  deployment: 'desktop' | 'server' | 'mobile' | 'saas' | 'cloud' | 'custom' | 'open_source' | 'other';
  licenseModel?: string;
  planOrVersion?: string;
  businessOwner?: string;
  technicalOwner?: string;
  purchasedLicenses?: number;
  assignedLicenses?: number;
  activeUsers?: number;
  annualCost?: number;
  currency?: string;
  renewalDate?: string;
  autoRenew?: boolean;
  sso?: boolean;
  mfa?: boolean;
  dataClassification?: string;
  businessCriticality?: 'critical' | 'high' | 'medium' | 'low';
  approved?: boolean;
  supportStatus?: 'supported' | 'extended' | 'unsupported' | 'unknown';
  contractId?: string;
  notes?: string;
}


export interface TechnologyRecord extends BaseRecord {
  siteId?: string;
  type: 'domain' | 'dns_zone' | 'certificate' | 'public_ip' | 'cloud_subscription' | 'cloud_resource' | 'database' | 'api' | 'integration' | 'service_account' | 'privileged_account' | 'access_card' | 'hardware_token' | 'network_circuit' | 'backup_job' | 'storage_repository' | 'website' | 'source_repository' | 'ci_cd' | 'other';
  name: string;
  identifier?: string;
  owner?: string;
  custodian?: string;
  vendor?: string;
  environment?: 'production' | 'dr' | 'test' | 'development' | 'sandbox' | 'other';
  urlOrAddress?: string;
  accountOrTenant?: string;
  dataClassification?: string;
  businessCriticality?: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'inactive' | 'planned' | 'retiring' | 'expired' | 'unknown';
  startDate?: string;
  expiryDate?: string;
  renewalDate?: string;
  monthlyCost?: number;
  annualCost?: number;
  currency?: string;
  mfa?: boolean;
  sso?: boolean;
  encryption?: boolean;
  internetExposed?: boolean;
  backupProtected?: boolean;
  lastReviewedAt?: string;
  customData?: Record<string, string | number | boolean | null>;
  notes?: string;
}

export interface VendorContract extends BaseRecord {
  vendorName: string;
  service: string;
  contractNumber?: string;
  internalOwner?: string;
  startDate?: string;
  endDate?: string;
  noticeDays?: number;
  autoRenew?: boolean;
  monthlyCost?: number;
  annualCost?: number;
  currency?: string;
  sla?: string;
  dataAccess?: boolean;
  privilegedAccess?: boolean;
  personalDataProcessing?: boolean;
  securityReview?: boolean;
  status: 'active' | 'expiring' | 'expired' | 'terminated' | 'draft';
  notes?: string;
}

export interface PersonRecord extends BaseRecord {
  employeeId?: string;
  name: string;
  email?: string;
  department?: string;
  title?: string;
  employmentType?: string;
  manager?: string;
  status: 'active' | 'notice' | 'terminated' | 'contractor' | 'unknown';
  startDate?: string;
  terminationDate?: string;
  locationId?: string;
  notes?: string;
}

export interface AuditScope {
  core: boolean;
  physical: boolean;
  assets: boolean;
  telecom: boolean;
  mobile: boolean;
  byod: boolean;
  printers: boolean;
  software: boolean;
  saas: boolean;
  m365: boolean;
  servers: boolean;
  network: boolean;
  cloud: boolean;
  security: boolean;
  privacy: boolean;
  backupDr: boolean;
  ai: boolean;
  development: boolean;
  otIot: boolean;
  cctvAccess: boolean;
  payment: boolean;
  warehouse: boolean;
  compliance: boolean;
}

export interface Audit extends BaseRecord {
  name: string;
  siteId?: string;
  state: AuditState;
  auditType: string;
  leadAuditor?: string;
  clientContact?: string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  scope: AuditScope;
  notes?: string;
}

export interface Finding extends BaseRecord {
  auditId: string;
  siteId?: string;
  controlId?: string;
  findingNo: string;
  title: string;
  condition: string;
  risk: Risk;
  impact?: string;
  recommendation?: string;
  owner?: string;
  targetDate?: string;
  status: 'open' | 'in_progress' | 'remediated' | 'risk_accepted' | 'closed';
  managementResponse?: string;
  closureNotes?: string;
  estimatedMonthlyLeakage?: number;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface EvidenceRecord extends BaseRecord {
  auditId: string;
  controlId?: string;
  findingId?: string;
  assetId?: string;
  name: string;
  mimeType: string;
  size: number;
  blob?: Blob;
  remotePath?: string;
  sha256?: string;
  capturedAt: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orgId: string;
  active: boolean;
  source: 'local' | 'supabase';
}

export interface LocalUserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orgId: string;
  passwordHash: string;
  passwordSalt: string;
  totpSecret: string;
  mfaVerified: boolean;
  active: boolean;
  createdAt: string;
}

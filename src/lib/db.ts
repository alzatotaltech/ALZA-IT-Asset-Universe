import Dexie, { type EntityTable } from 'dexie';
import type {
  Asset, Audit, AuditResponse, EvidenceRecord, Finding, LocalUserRecord,
  Organization, PersonRecord, Site, SoftwareRecord, TelecomRecord, TechnologyRecord, VendorContract
} from '../types';

export class AlzaDatabase extends Dexie {
  organizations!: EntityTable<Organization, 'id'>;
  sites!: EntityTable<Site, 'id'>;
  people!: EntityTable<PersonRecord, 'id'>;
  assets!: EntityTable<Asset, 'id'>;
  telecom!: EntityTable<TelecomRecord, 'id'>;
  software!: EntityTable<SoftwareRecord, 'id'>;
  vendors!: EntityTable<VendorContract, 'id'>;
  technology!: EntityTable<TechnologyRecord, 'id'>;
  audits!: EntityTable<Audit, 'id'>;
  responses!: EntityTable<AuditResponse, 'id'>;
  findings!: EntityTable<Finding, 'id'>;
  evidence!: EntityTable<EvidenceRecord, 'id'>;
  users!: EntityTable<LocalUserRecord, 'id'>;

  constructor() {
    super('alza-it-audit');
    this.version(1).stores({
      organizations: 'id, name, updatedAt, syncState',
      sites: 'id, orgId, code, name, updatedAt, syncState',
      people: 'id, orgId, email, status, locationId, updatedAt, syncState',
      assets: 'id, orgId, siteId, assetTag, serialNumber, assignedTo, category, status, updatedAt, syncState',
      telecom: 'id, orgId, siteId, mobileNumber, iccid, assignedTo, carrier, status, updatedAt, syncState',
      software: 'id, orgId, name, publisher, deployment, renewalDate, updatedAt, syncState',
      vendors: 'id, orgId, vendorName, endDate, status, updatedAt, syncState',
      audits: 'id, orgId, siteId, state, startDate, dueDate, updatedAt, syncState',
      responses: 'id, orgId, auditId, controlId, [auditId+controlId], updatedAt, syncState',
      findings: 'id, orgId, auditId, siteId, risk, status, targetDate, updatedAt, syncState',
      evidence: 'id, orgId, auditId, controlId, findingId, assetId, capturedAt, updatedAt, syncState',
      users: 'id, &email, orgId, role, active, createdAt'
    });
    this.version(2).stores({
      technology: 'id, orgId, siteId, type, name, status, expiryDate, renewalDate, updatedAt, syncState'
    });
  }
}

export const db = new AlzaDatabase();

export const tableNames = ['organizations','sites','people','assets','telecom','software','vendors','technology','audits','responses','findings','evidence'] as const;
export type SyncTableName = typeof tableNames[number];

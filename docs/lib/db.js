import Dexie from 'dexie';
export class AlzaDatabase extends Dexie {
    organizations;
    sites;
    people;
    assets;
    telecom;
    software;
    vendors;
    audits;
    responses;
    findings;
    evidence;
    users;
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
    }
}
export const db = new AlzaDatabase();
export const tableNames = ['organizations', 'sites', 'people', 'assets', 'telecom', 'software', 'vendors', 'audits', 'responses', 'findings', 'evidence'];

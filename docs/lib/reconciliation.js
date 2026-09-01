export function runReconciliation(input) {
    const issues = [];
    const peopleByName = new Map(input.people.map(p => [p.name.toLowerCase(), p]));
    const add = (x) => issues.push(x);
    for (const a of input.assets) {
        const p = a.assignedTo ? peopleByName.get(a.assignedTo.toLowerCase()) : undefined;
        if (a.assignedTo && !p)
            add({ code: 'ASSET-USER-NOT-HR', severity: 'high', title: 'Asset assigned to person not in HR population', detail: `${a.assetTag || a.serialNumber || a.model} is assigned to ${a.assignedTo}, who was not found in the people register.`, entityType: 'asset', entityId: a.id });
        if (p?.status === 'terminated')
            add({ code: 'ASSET-TERMINATED-USER', severity: 'high', title: 'Asset retained by terminated employee', detail: `${a.assetTag || a.serialNumber || a.model} remains assigned to terminated user ${p.name}.`, entityType: 'asset', entityId: a.id });
        if (!a.lastVerifiedAt)
            add({ code: 'ASSET-NOT-VERIFIED', severity: 'medium', title: 'Asset has not been physically verified', detail: `${a.assetTag || a.serialNumber || a.model} has no physical-verification timestamp.`, entityType: 'asset', entityId: a.id });
        if ((a.financeRemainingMonths || 0) > 0 && ['returned', 'disposed', 'retired', 'lost', 'stolen'].includes(a.status))
            add({ code: 'FINANCE-AFTER-LIFECYCLE', severity: 'high', title: 'Finance obligation remains on inactive asset', detail: `${a.assetTag || a.serialNumber || a.model} is ${a.status} but has ${a.financeRemainingMonths} installments remaining.`, entityType: 'asset', entityId: a.id, estimatedMonthlyLeakage: a.monthlyInstallment });
        if (['Laptop', 'Desktop', 'Mobile', 'Tablet', 'External Storage'].includes(a.category) && a.encryption === false)
            add({ code: 'ENDPOINT-NO-ENCRYPTION', severity: 'high', title: 'Endpoint not encrypted', detail: `${a.assetTag || a.serialNumber || a.model} is recorded without encryption.`, entityType: 'asset', entityId: a.id });
        if (['Mobile', 'Tablet'].includes(a.category) && a.mdmCompliant === false)
            add({ code: 'MOBILE-MDM-NONCOMPLIANT', severity: 'high', title: 'Mobile device is MDM non-compliant', detail: `${a.assetTag || a.serialNumber || a.model} is recorded as MDM non-compliant.`, entityType: 'asset', entityId: a.id });
    }
    for (const t of input.telecom) {
        const p = t.assignedTo ? peopleByName.get(t.assignedTo.toLowerCase()) : undefined;
        if (t.status === 'active' && !t.assignedTo && !t.assetId)
            add({ code: 'TELECOM-UNASSIGNED', severity: 'high', title: 'Active telecom service has no assignee/device', detail: `${t.mobileNumber || t.planName || t.type} with ${t.carrier} is active but is not linked to a person or device.`, entityType: 'telecom', entityId: t.id, estimatedMonthlyLeakage: (t.monthlyCharge || 0) + (t.deviceInstallment || 0) });
        if (p?.status === 'terminated')
            add({ code: 'TELECOM-TERMINATED-USER', severity: 'high', title: 'Active telecom service assigned to terminated employee', detail: `${t.mobileNumber || t.planName} remains assigned to terminated user ${p.name}.`, entityType: 'telecom', entityId: t.id, estimatedMonthlyLeakage: (t.monthlyCharge || 0) + (t.deviceInstallment || 0) });
        if (t.status === 'active' && t.lastUsedAt && Date.now() - new Date(t.lastUsedAt).getTime() > 90 * 86400000)
            add({ code: 'TELECOM-DORMANT', severity: 'medium', title: 'Active telecom service dormant over 90 days', detail: `${t.mobileNumber || t.planName} last used ${t.lastUsedAt}.`, entityType: 'telecom', entityId: t.id, estimatedMonthlyLeakage: (t.monthlyCharge || 0) + (t.deviceInstallment || 0) });
        if (t.status !== 'active' && (t.installmentRemainingMonths || 0) > 0)
            add({ code: 'TELECOM-INSTALLMENT-INACTIVE', severity: 'high', title: 'Device installment remains on inactive telecom record', detail: `${t.mobileNumber || t.planName} is ${t.status} with ${t.installmentRemainingMonths} installments remaining.`, entityType: 'telecom', entityId: t.id, estimatedMonthlyLeakage: t.deviceInstallment });
    }
    for (const s of input.software) {
        if (s.approved === false)
            add({ code: 'SHADOW-IT', severity: 'high', title: 'Unapproved / shadow IT application', detail: `${s.name} is recorded as unapproved. Review data use, owner, MFA/SSO, contract and business need.`, entityType: 'software', entityId: s.id, estimatedMonthlyLeakage: (s.annualCost || 0) / 12 });
        if (s.mfa === false && ['saas', 'cloud', 'custom'].includes(s.deployment))
            add({ code: 'SAAS-NO-MFA', severity: 'high', title: 'Cloud application without MFA', detail: `${s.name} is recorded without MFA.`, entityType: 'software', entityId: s.id });
        const unused = Math.max(0, (s.purchasedLicenses || 0) - (s.activeUsers || 0));
        if (unused > 0) {
            const monthly = (s.annualCost || 0) / 12;
            const unit = s.purchasedLicenses ? monthly / s.purchasedLicenses : 0;
            add({ code: 'SOFTWARE-UNUSED-LICENCES', severity: 'medium', title: 'Potential unused software licences', detail: `${s.name}: ${unused} of ${s.purchasedLicenses} purchased licences appear unused based on active-user count.`, entityType: 'software', entityId: s.id, estimatedMonthlyLeakage: unit * unused });
        }
        if (s.supportStatus === 'unsupported')
            add({ code: 'SOFTWARE-UNSUPPORTED', severity: 'high', title: 'Unsupported software in use', detail: `${s.name} (${s.planOrVersion || 'version not recorded'}) is marked unsupported.`, entityType: 'software', entityId: s.id });
    }
    const now = Date.now();
    for (const v of input.vendors) {
        if (v.status === 'active' && v.endDate) {
            const days = (new Date(v.endDate).getTime() - now) / 86400000;
            if (days < 0)
                add({ code: 'CONTRACT-EXPIRED-ACTIVE', severity: 'high', title: 'Expired contract still marked active', detail: `${v.vendorName} / ${v.service} expired on ${v.endDate}.`, entityType: 'vendor', entityId: v.id, estimatedMonthlyLeakage: v.monthlyCost });
            else if (days <= 90)
                add({ code: 'CONTRACT-RENEWAL-90D', severity: 'medium', title: 'IT contract renewal within 90 days', detail: `${v.vendorName} / ${v.service} ends ${v.endDate}${v.autoRenew ? ' and is auto-renewing' : ''}. Notice period: ${v.noticeDays || 'not recorded'} days.`, entityType: 'vendor', entityId: v.id });
        }
    }
    return issues.sort((a, b) => ({ critical: 5, high: 4, medium: 3, low: 2, observation: 1 }[b.severity] - { critical: 5, high: 4, medium: 3, low: 2, observation: 1 }[a.severity]));
}

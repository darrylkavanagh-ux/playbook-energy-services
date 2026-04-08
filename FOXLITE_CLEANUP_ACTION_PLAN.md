# 🚨 CRITICAL: FOXLITE REFERENCE CLEANUP ACTION PLAN

**Date**: 2026-04-08  
**Priority**: 🔴 CRITICAL (Must complete before platform team inspection)  
**Estimated Effort**: 4-6 hours  
**Risk**: Medium (requires careful testing after cleanup)  

---

## SUMMARY

- **Total References Found**: 76 instances across 16 files
- **Files Requiring Changes**: 16
- **Files to Rename**: 2
- **Routes to Update**: 12 endpoints
- **Database Changes**: 0 (schemas are generic)

---

## PHASE 1: FILE RENAMING (COMPLETED ✅)

### 1.1 Route Files
- [x] `server/src/routes/foxlite.ts` → `server/src/routes/utilityAudit.ts` ✅

### 1.2 Frontend Pages (PENDING)
- [ ] `client/src/pages/Foxlite.tsx` → `client/src/pages/UtilityAudit.tsx`

---

## PHASE 2: ROUTE PATH UPDATES (PENDING)

All API endpoints need URL path changes:

**Before** → **After**:
```
/api/foxlite/audit/upload         → /api/utility-audit/audit/upload
/api/foxlite/audit/analyze        → /api/utility-audit/audit/analyze
/api/foxlite/audit/:projectId     → /api/utility-audit/audit/:projectId
/api/foxlite/audits               → /api/utility-audit/audits
/api/foxlite/reference-code/*     → /api/utility-audit/reference-code/*
/api/foxlite/email-logs           → /api/utility-audit/email-logs
```

**Files to Update**:
1. `server/src/server.ts` - Router mounting
2. `client/src/App.tsx` - Frontend routes
3. Any API client files

---

## PHASE 3: CODE REFERENCE CLEANUP (PENDING)

### 3.1 Server Files Requiring Updates (14 files)

| # | File | References | Priority |
|---|------|------------|----------|
| 1 | `server/src/config/database.ts` | ~8 | 🟡 Comments only |
| 2 | `server/src/config/emailMigration.ts` | ~4 | 🟡 Comments only |
| 3 | `server/src/engines/CCLExemptionChecker.ts` | ~2 | 🟡 Comments only |
| 4 | `server/src/engines/CapacityChargeValidator.ts` | ~3 | 🟡 Comments only |
| 5 | `server/src/middleware/security.ts` | ~2 | 🟡 Comments only |
| 6 | `server/src/integrations/DataExtractionOrchestrator.ts` | ~6 | 🟡 Comments only |
| 7 | `server/src/routes/emailRoutes.ts` | ~5 | 🔴 Code + comments |
| 8 | `server/src/routes/utilityAudit.ts` | ~11 | ✅ COMPLETED |
| 9 | `server/src/routes/veritech.ts` | ~3 | 🟡 Comments only |
| 10 | `server/src/server.ts` | ~8 | 🔴 Route mounting + logs |
| 11 | `server/src/services/EmailBillProcessor.ts` | ~10 | 🔴 Service logic |
| 12 | `server/src/veritech/VeriTech10CertificateGenerator.ts` | ~2 | 🟡 Comments only |
| 13 | `server/src/veritech/VeriTech10HybridCertificateGenerator.ts` | ~3 | 🟡 Comments only |
| 14 | `server/src/neural/NeuralNetworkOrchestrator.ts` | ~4 | 🟡 Comments only |

###  3.2 Client Files Requiring Updates (2 files)

| # | File | References | Priority |
|---|------|------------|----------|
| 1 | `client/src/App.tsx` | ~3 | 🔴 Route paths |
| 2 | `client/src/pages/Foxlite.tsx` | ~2 | 🔴 Rename + content |

---

## PHASE 4: REPLACEMENT MAPPING

### String Replacements:

| Context | Before | After |
|---------|--------|-------|
| **URLs** | `/api/foxlite/` | `/api/utility-audit/` |
| **URLs** | `/foxlite` | `/utility-audit` |
| **Variables** | `foxliteAudit` | `utilityAudit` |
| **Variables** | `foxlite_` | `utility_` |
| **Constants** | `FOXLITE_` | `UTILITY_AUDIT_` |
| **Types** | `Foxlite` | `UtilityAudit` |
| **Comments** | `FOXLITE` | `Utility Audit Client` |
| **Comments** | `Foxlite` | `Client` |
| **Logs** | `Foxlite` | `Utility Audit` |
| **Filenames** | `foxlite-` | `audit-` |

---

## PHASE 5: TESTING REQUIREMENTS

After cleanup, test these critical paths:

### 5.1 Backend API Tests
- [ ] POST `/api/utility-audit/audit/upload` - File upload
- [ ] POST `/api/utility-audit/audit/analyze` - Bill analysis
- [ ] GET `/api/utility-audit/audit/:projectId` - Project fetch
- [ ] GET `/api/utility-audit/audits` - List audits
- [ ] POST `/api/utility-audit/reference-code/generate` - Generate codes
- [ ] GET `/api/utility-audit/reference-codes/:customerId` - List codes
- [ ] POST `/api/utility-audit/reference-code/deactivate` - Deactivate codes
- [ ] GET `/api/utility-audit/email-logs` - Email logs

### 5.2 Frontend Tests
- [ ] Navigate to `/utility-audit` page
- [ ] Upload bills via UI
- [ ] View audit results
- [ ] Generate reference codes
- [ ] View email logs

### 5.3 Integration Tests
- [ ] Email bill processing with reference codes
- [ ] Complete audit workflow end-to-end
- [ ] Database audit_projects table operations
- [ ] File upload and storage

---

## PHASE 6: DEPLOYMENT CHECKLIST

- [ ] Update environment variables (if any `FOXLITE_*` vars exist)
- [ ] Update API documentation
- [ ] Update frontend environment configs
- [ ] Clear browser cache/local storage
- [ ] Restart backend server
- [ ] Restart frontend dev server
- [ ] Smoke test all endpoints
- [ ] Monitor logs for errors

---

## ROLLBACK PLAN

If issues arise:

1. **Git Revert**:
   ```bash
   git revert HEAD~1
   git push origin nocompare-cvk1100-analysis --force
   ```

2. **Manual Rollback**:
   - Restore `foxlite.ts` from git history
   - Revert route path changes in `server.ts`
   - Restore frontend `Foxlite.tsx`

3. **Database**: No schema changes, rollback not required

---

## EXECUTION PLAN

### Step 1: Backup Current State ✅
```bash
git add -A
git commit -m "checkpoint: before foxlite cleanup"
git push origin nocompare-cvk1100-analysis
```

### Step 2: Perform Cleanup (Automated Script)
Run the cleanup script that will:
1. Rename remaining files
2. Update all code references
3. Update route mountings
4. Update frontend paths

### Step 3: Test & Verify
1. Run test suite
2. Manual smoke testing
3. Check logs for errors

### Step 4: Commit & Push
```bash
git add -A
git commit -m "refactor: remove all client-specific references (Foxlite → Utility Audit)"
git push origin nocompare-cvk1100-analysis
```

---

## RECOMMENDATIONS

### Option A: Complete Cleanup Now (4-6 hours)
**Pros**: 
- Clean repository for platform team
- No client-specific references
- Professional appearance

**Cons**:
- Requires thorough testing
- Risk of breaking existing integrations
- Time investment

### Option B: Gradual Cleanup (1-2 weeks)
**Pros**:
- Lower risk of breakage
- Can test incrementally
- Easier to identify issues

**Cons**:
- Repository not CTO-grade immediately
- Platform team may see client references
- Less professional

### Option C: Create Generic Interface Layer (2-3 days)
**Pros**:
- Keep existing code intact
- Add new generic API layer
- Backward compatible

**Cons**:
- Code duplication
- Technical debt
- Maintenance burden

---

## RECOMMENDED APPROACH: **Option A** (Complete Cleanup Now)

**Rationale**:
1. Platform team inspection is imminent
2. Technical debt should be addressed now
3. Repository contains excellent IP that deserves clean presentation
4. Risk is manageable with proper testing
5. Only 76 references across 16 files (not excessive)

**Timeline**:
- Phase 1: File renaming (DONE ✅)
- Phase 2-3: Code cleanup (2-3 hours)
- Phase 4-5: Testing (1-2 hours)
- Phase 6: Deployment verification (1 hour)

**Total**: 4-6 hours to completion

---

## NEXT ACTIONS

1. ✅ Review and approve this cleanup plan
2. ⏳ Execute Phase 2-3 (code reference cleanup)
3. ⏳ Execute Phase 4-5 (comprehensive testing)
4. ⏳ Execute Phase 6 (deployment verification)
5. ⏳ Update audit report with "CLEANED" status

---

**Created By**: GenSpark AI Platform  
**Date**: 2026-04-08  
**Status**: AWAITING APPROVAL  
**Priority**: 🔴 CRITICAL  

---

**⚠️ DO NOT MERGE TO MAIN UNTIL CLEANUP COMPLETE AND TESTED ⚠️**

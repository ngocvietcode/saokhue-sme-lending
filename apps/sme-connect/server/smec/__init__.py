"""SME Connect independent domain package (`smec`).

Lives exclusively inside `apps/sme-connect/server/smec/` so `apps/sme-sales`
and `apps/sme-lending` remain 100% untouched and storage-isolated, while
reusing the deterministic core (`sme_core`) synced via `tools/sync_core.py`.
"""

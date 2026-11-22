import { useAppApi } from '@kirocrew/app-sdk'
import { useEffect, useState } from 'react'
import { ensureStyles } from '@sme-ui/styles'
import DossierList from './DossierList'
import DossierView from './DossierView'
import { API, type Catalog } from './model'

ensureStyles()

export default function SmeSalesPage() {
  const api = useAppApi()
  const [caseId, setCaseId] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  useEffect(() => {
    // The catalog only labels things; the page still works if it fails to load.
    api.get<Catalog>(`${API}/catalog`).then(setCatalog).catch(() => setCatalog(null))
  }, [api])
  return (
    <div className="sme" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      {caseId
        ? <DossierView caseId={caseId} catalog={catalog} onBack={() => setCaseId(null)} />
        : <DossierList onOpen={setCaseId} catalog={catalog} />}
    </div>
  )
}

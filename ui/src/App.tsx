import { useState } from 'react'
import CaseList from './CaseList'
import CaseView from './CaseView'
import { ensureStyles } from './styles'

ensureStyles()

export default function SmeLendingPage() {
  const [caseId, setCaseId] = useState<string | null>(null)
  return (
    <div className="sme" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      {caseId
        ? <CaseView caseId={caseId} onBack={() => setCaseId(null)} />
        : <CaseList onOpen={setCaseId} />}
    </div>
  )
}

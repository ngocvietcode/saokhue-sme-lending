import { ClipboardCheck, FileSearch } from 'lucide-react'
import { useState } from 'react'
import { ensureStyles } from '@sme-ui/styles'
import SmeLendingPage from './LendingPage'
import SmeSalesPage from './sales/App'

ensureStyles()

type Mode = 'sale' | 'assessment'
const MODE_KEY = 'sme-lending:mode'

function readMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === 'assessment' ? 'assessment' : 'sale'
  } catch {
    return 'sale'
  }
}

/** One page, two stages of the same dossier: the Sale completes it, then the assessment runs on it. */
export default function SmeCreditPage() {
  const [mode, setModeState] = useState<Mode>(readMode)
  const setMode = (next: Mode) => {
    setModeState(next)
    try { localStorage.setItem(MODE_KEY, next) } catch { /* the choice is a convenience */ }
  }
  return (
    <div className="sme" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      <div className="sme-tabs sme-modebar" role="tablist" aria-label="Bước hồ sơ">
        <button type="button" role="tab" aria-selected={mode === 'sale'}
          className={`sme-tab ${mode === 'sale' ? 'on' : ''}`} onClick={() => setMode('sale')}>
          <ClipboardCheck size={14} /> Hoàn thiện hồ sơ
        </button>
        <button type="button" role="tab" aria-selected={mode === 'assessment'}
          className={`sme-tab ${mode === 'assessment' ? 'on' : ''}`} onClick={() => setMode('assessment')}>
          <FileSearch size={14} /> Thẩm định
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {mode === 'sale' ? <SmeSalesPage /> : <SmeLendingPage onNewDossier={() => setMode('sale')} />}
      </div>
    </div>
  )
}

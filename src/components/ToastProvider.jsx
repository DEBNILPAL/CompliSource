import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]) // {id, type, msg}

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const show = useCallback((msg, type = 'info', ttl = 3000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, msg }])
    if (ttl > 0) setTimeout(() => remove(id), ttl)
    return id
  }, [remove])

  const value = useMemo(() => ({ show, remove }), [show, remove])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id}
            style={{
              minWidth: 260,
              maxWidth: 360,
              padding: '10px 12px',
              borderRadius: 8,
              color: t.type === 'error' ? '#7f1d1d' : (t.type === 'success' ? '#064e3b' : '#0a2540'),
              background: t.type === 'error' ? '#fee2e2' : (t.type === 'success' ? '#d1fae5' : '#e5f6ff'),
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              {t.type === 'error' ? 'Error' : t.type === 'success' ? 'Success' : 'Notice'}
            </div>
            <div>{t.msg}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

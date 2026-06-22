import { useState } from 'react'
import { isLoggedIn, getUsername, clearSession } from './auth'
import LoginPage from './components/LoginPage'
import PromotionForm from './components/PromotionForm'
import JobForm from './components/JobForm'
import PreviewModal from './components/PreviewModal'

const TYPES = [
  { id: 'promotie', label: 'Promoție', desc: 'Produs la reducere', icon: '🏷️' },
  { id: 'angajare', label: 'Angajare', desc: 'Postare recrutare', icon: '👥' },
]

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())
  const [currentUser, setCurrentUser] = useState(getUsername())
  const [postType, setPostType] = useState(null)
  const [generatedData, setGeneratedData] = useState(null)
  const [success, setSuccess] = useState(false)

  function handleLogin(username) {
    setLoggedIn(true)
    setCurrentUser(username)
  }

  function handleLogout() {
    clearSession()
    setLoggedIn(false)
    setCurrentUser(null)
    setPostType(null)
    setGeneratedData(null)
  }

  function handleSuccess() {
    setGeneratedData(null)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setPostType(null)
    }, 3000)
  }

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {postType && (
              <button
                onClick={() => { setPostType(null); setGeneratedData(null) }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">Postări Automate</h1>
              <p className="text-xs text-gray-400">Publicare directă pe Facebook</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{currentUser}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
            >
              Ieși
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {success ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Postat cu succes!</h2>
            <p className="text-sm text-gray-500">Postarea a fost publicată pe pagina de Facebook.</p>
          </div>
        ) : !postType ? (
          <div>
            <p className="text-gray-500 text-sm mb-6 text-center">Alege tipul de postare:</p>
            <div className="grid grid-cols-2 gap-4">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setPostType(t.id)}
                  className="bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-md rounded-2xl p-6 text-center transition-all group"
                >
                  <div className="text-4xl mb-3">{t.icon}</div>
                  <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{t.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{TYPES.find((t) => t.id === postType)?.icon}</span>
              <h2 className="font-semibold text-gray-800">
                Postare {TYPES.find((t) => t.id === postType)?.label}
              </h2>
            </div>
            {postType === 'promotie' ? (
              <PromotionForm onGenerated={setGeneratedData} />
            ) : (
              <JobForm onGenerated={setGeneratedData} />
            )}
          </div>
        )}
      </main>

      {generatedData && (
        <PreviewModal
          data={generatedData}
          onClose={() => setGeneratedData(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

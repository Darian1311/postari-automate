import { useState } from 'react'
import StoreSelector from './StoreSelector'
import { generateAngajare } from '../api'

export default function JobForm({ onGenerated }) {
  const [post, setPost] = useState('')
  const [magazine, setMagazine] = useState([])
  const [cerinte, setCerinte] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function isValid() {
    return post && magazine.length > 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid()) return
    setLoading(true)
    setError('')
    try {
      const data = await generateAngajare({ post, magazine, cerinte: cerinte || null })
      onGenerated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Post vacant <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="ex: Casier, Vânzător, Manager de magazin"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          required
        />
      </div>

      <StoreSelector selected={magazine} onChange={setMagazine} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cerințe sau detalii suplimentare
        </label>
        <textarea
          value={cerinte}
          onChange={(e) => setCerinte(e.target.value)}
          placeholder="ex: experiență preferabilă, program flexibil, salariu atractiv..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
        Imaginea va fi generată automat cu AI pentru postarea de angajare.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid() || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Se generează text + imagine...
          </span>
        ) : (
          'Generează Preview'
        )}
      </button>
    </form>
  )
}

import { useState, useRef } from 'react'
import StoreSelector from './StoreSelector'
import { generatePromotie } from '../api'

export default function PromotionForm({ onGenerated }) {
  const [produs, setProdus] = useState('')
  const [pret, setPret] = useState('')
  const [discount, setDiscount] = useState('')
  const [magazine, setMagazine] = useState([])
  const [perioada, setPerioda] = useState('')
  const [imagine, setImagine] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setImagine(file)
    setPreview(URL.createObjectURL(file))
  }

  function isValid() {
    return produs && pret && discount && magazine.length > 0 && imagine
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid()) return
    setLoading(true)
    setError('')
    try {
      const data = await generatePromotie({ produs, pret: parseFloat(pret), discount: parseInt(discount), magazine, perioada: perioada || null, imagine })
      onGenerated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pretNou = pret && discount ? (parseFloat(pret) * (1 - parseInt(discount) / 100)).toFixed(2) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produs <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={produs}
            onChange={(e) => setProdus(e.target.value)}
            placeholder="ex: Pepsi 0.33L doză"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preț original (lei) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={pret}
            onChange={(e) => setPret(e.target.value)}
            placeholder="ex: 5.50"
            step="0.01"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reducere (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="ex: 20"
            min="1"
            max="99"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
          {pretNou && (
            <p className="text-xs text-green-600 mt-1 font-medium">Preț nou: {pretNou} lei</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Perioadă ofertă
          </label>
          <input
            type="text"
            value={perioada}
            onChange={(e) => setPerioda(e.target.value)}
            placeholder="ex: 22-25 iunie 2026"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <StoreSelector selected={magazine} onChange={setMagazine} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagine produs <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors text-center ${preview ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
        >
          {preview ? (
            <div className="flex items-center gap-3">
              <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{imagine?.name}</p>
                <p className="text-xs text-gray-400">Click pentru a schimba</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-sm text-gray-500">Click pentru a încărca imaginea</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
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
            Se generează...
          </span>
        ) : (
          'Generează Preview'
        )}
      </button>
    </form>
  )
}

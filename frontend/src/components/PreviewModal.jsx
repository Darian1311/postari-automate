import { useState } from 'react'
import { publishPost } from '../api'

export default function PreviewModal({ data, onClose, onSuccess }) {
  const [text, setText] = useState(data.text)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const imgSrc = `data:${data.image_mime};base64,${data.image_base64}`

  async function handlePublish() {
    setLoading(true)
    setError('')
    try {
      await publishPost({ text, image_base64: data.image_base64 })
      onSuccess()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-lg">Preview postare</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Imagine</p>
            <img
              src={imgSrc}
              alt="Post preview"
              className="w-full aspect-square object-cover rounded-xl border border-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
              Text postare <span className="normal-case text-gray-400 font-normal">(editabil)</span>
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-2 text-right">{text.length} caractere</p>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Anulează
          </button>
          <button
            onClick={handlePublish}
            disabled={loading || !text.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Se publică...
              </span>
            ) : (
              'Publică pe Facebook'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

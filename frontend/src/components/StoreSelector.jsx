const STORES = [
  'Aiud-Micro 1',
  'Aiud-Micro 2',
  'Aiud-Spital',
  'Uioara de Sus',
  'Ocna Mureș 1',
  'Ocna Mureș 2',
  'Ocna Mureș 3',
  'Micoslaca',
]

export default function StoreSelector({ selected, onChange }) {
  const allSelected = selected.length === STORES.length

  function toggleAll() {
    onChange(allSelected ? [] : [...STORES])
  }

  function toggleStore(store) {
    if (selected.includes(store)) {
      onChange(selected.filter((s) => s !== store))
    } else {
      onChange([...selected, store])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Magazine <span className="text-red-500">*</span>
      </label>
      <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="font-semibold text-blue-700 text-sm">Toate magazinele</span>
        </label>
        <div className="border-t border-gray-200 pt-2 grid grid-cols-2 gap-1">
          {STORES.map((store) => (
            <label key={store} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(store)}
                onChange={() => toggleStore(store)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{store}</span>
            </label>
          ))}
        </div>
      </div>
      {selected.length === 0 && (
        <p className="text-red-500 text-xs mt-1">Selectează cel puțin un magazin.</p>
      )}
    </div>
  )
}

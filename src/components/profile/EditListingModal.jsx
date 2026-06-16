import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'

export default function EditListingModal({ listing, onClose, onSave, loading }) {
  const [foodName, setFoodName] = useState('')
  const [description, setDescription] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [category, setCategory] = useState('')
  const [dietaryPreferences, setDietaryPreferences] = useState([])
  const [otherDietaryPreference, setOtherDietaryPreference] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [availabilityStartTime, setAvailabilityStartTime] = useState('')
  const [availabilityEndTime, setAvailabilityEndTime] = useState('')
  const [previewImage, setPreviewImage] = useState(listing?.imageUrl || '')
  const dietaryOptions = ['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Other']
  const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: 'baked', label: 'Baked Goods' },
    { value: 'cooked', label: 'Cooked Meals' },
    { value: 'fruits', label: 'Fruits & Vegetables' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    if (!listing) return
    setFoodName(listing.foodName || '')
    setDescription(listing.description || '')
    setPickupLocation(listing.pickupLocation || '')
    setCategory(listing.category || '')
    setDietaryPreferences(listing.dietaryPreferences || [])
    setOtherDietaryPreference(
      Array.isArray(listing.dietaryPreferences) && listing.dietaryPreferences.find((d) => !dietaryOptions.includes(d))
        ? listing.dietaryPreferences.find((d) => !dietaryOptions.includes(d))
        : ''
    )
    setExpiryDate(listing.expiryDate || '')
    setPickupDate(listing.pickupDate || '')
    setAvailabilityStartTime(listing.availabilityStartTime || '')
    setAvailabilityEndTime(listing.availabilityEndTime || '')
    setPreviewImage(listing.imageUrl || '')
  }, [listing])

  if (!listing) return null

  const handleDietaryToggle = (option) => {
    if (option === 'Other') {
      if (dietaryPreferences.includes('Other')) {
        setDietaryPreferences((prev) => prev.filter((p) => p !== 'Other'))
        setOtherDietaryPreference('')
      } else {
        setDietaryPreferences((prev) => [...prev, 'Other'])
      }
      return
    }
    setDietaryPreferences((prev) => (prev.includes(option) ? prev.filter((p) => p !== option) : [...prev, option]))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreviewImage(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setPreviewImage('')
  }

  const handleSave = () => {
    const dietary = dietaryPreferences.includes('Other')
      ? [...dietaryPreferences.filter((p) => p !== 'Other'), otherDietaryPreference].filter(Boolean)
      : dietaryPreferences
    onSave({
      foodName,
      description,
      pickupLocation,
      category,
      dietaryPreferences: dietary,
      expiryDate,
      pickupDate,
      availabilityStartTime,
      availabilityEndTime,
      imageUrl: previewImage
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full overflow-auto max-h-[90vh]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Edit Listing</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Food Name</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location</label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select a district</option>
                {Array.from({ length: 22 }, (_, i) => (
                  <option key={i + 1} value={`District ${i + 1}`}>
                    District {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Dietary Preferences</label>
              <div className="flex flex-wrap gap-3">
                {dietaryOptions.map((opt) => (
                  <label key={opt} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.includes(opt) || (opt === 'Other' && !!otherDietaryPreference)}
                      onChange={() => handleDietaryToggle(opt)}
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
                {dietaryPreferences.includes('Other') && (
                  <input
                    type="text"
                    value={otherDietaryPreference}
                    onChange={(e) => setOtherDietaryPreference(e.target.value)}
                    placeholder="Specify other"
                    className="px-3 py-1 border border-gray-300 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Best Before</label>
              <input
                type="date"
                value={expiryDate || ''}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pickup Date</label>
              <input
                type="date"
                value={pickupDate || ''}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Available From</label>
              <input
                type="time"
                value={availabilityStartTime || ''}
                onChange={(e) => setAvailabilityStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Available Until</label>
              <input
                type="time"
                value={availabilityEndTime || ''}
                onChange={(e) => setAvailabilityEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Photo</label>
              <div className="border-dashed border-2 border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <div className="w-28 h-20 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${previewImage || 'https://via.placeholder.com/320x200'})` }} />
                <div className="flex-1">
                  <input id="edit-image" type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => document.getElementById('edit-image')?.click()} className="px-3 py-1 bg-gray-100 rounded-md">Choose Image</button>
                    <button type="button" onClick={removeImage} className="px-3 py-1 border rounded-md">Remove</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Image is for preview only; upload handling is performed by the parent save logic.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mt-6 gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
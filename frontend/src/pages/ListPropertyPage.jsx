
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  createProperty,
  uploadPropertyImages,
} from '../services/propertyService'
import './ListPropertyPage.css'

const initialForm = {
  title: '',
  description: '',
  purpose: 'sale',
  category: 'house',
  price: '',
  currency: 'NGN',
  priceNegotiable: false,
  bedrooms: '',
  bathrooms: '',
  toilets: '',
  area: '',
  areaUnit: 'sqm',
  landSize: '',
  landSizeUnit: 'sqm',
  address: '',
  neighborhood: '',
  city: '',
  state: '',
  country: 'Nigeria',
  furnished: '',
  amenities: '',
}

function ListPropertyPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file))
    setPreviews(urls)

    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [images])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImages = (event) => {
    const selected = Array.from(event.target.files || [])
    setError('')

    const combined = [...images, ...selected]

    if (combined.length > 10) {
      setError('You can upload a maximum of 10 images.')
      event.target.value = ''
      return
    }

    const invalidFile = selected.find((file) =>
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    )

    if (invalidFile) {
      setError('Only JPEG, PNG and WebP images are allowed.')
      event.target.value = ''
      return
    }

    const oversizedFile = selected.find((file) => file.size > 5 * 1024 * 1024)

    if (oversizedFile) {
      setError('Each image must be 5MB or smaller.')
      event.target.value = ''
      return
    }

    setImages(combined)
    event.target.value = ''
  }

  const removeImage = (index) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
  }

  const optionalNumber = (value) => (
    value === '' ? null : Number(value)
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      navigate('/login')
      return
    }

    if (images.length === 0) {
      setError('Please upload at least one property image.')
      return
    }

    setLoading(true)

    try {
      const propertyData = {
        ...form,
        price: Number(form.price),
        bedrooms: optionalNumber(form.bedrooms),
        bathrooms: optionalNumber(form.bathrooms),
        toilets: optionalNumber(form.toilets),
        area: optionalNumber(form.area),
        landSize: optionalNumber(form.landSize),
        furnished: form.furnished === ''
          ? null
          : form.furnished === 'true',
        amenities: form.amenities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }

      const property = await createProperty(propertyData, token)

      await uploadPropertyImages(property.id, images, token)

      setSuccess(
        'Your property and photos have been submitted successfully for admin approval.'
      )

      setForm(initialForm)
      setImages([])

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="listing-page">
      <header className="listing-header">
        <div className="listing-header-inner">
          <Link to="/" className="listing-brand">
            OCEAN PYRAMID <span>PROPERTIES</span>
          </Link>

          <div className="listing-user">
            <span>
              {user?.firstName} {user?.lastName}
            </span>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="listing-container">
        <Link to="/" className="listing-back">
          <ArrowLeft size={15} /> Back to homepage
        </Link>

        <div className="listing-heading">
          <span className="eyebrow">PROPERTY SUBMISSION</span>
          <h1>List your <em>property.</em></h1>
          <p>
            Share your property details and let us connect you with the right buyers and tenants.
          </p>
        </div>

        {success && <div className="listing-success">{success}</div>}
        {error && <div className="listing-error">{error}</div>}

        <form className="listing-form" onSubmit={handleSubmit}>
          <section className="listing-section">
            <h2>01. Property information</h2>

            <div className="listing-fields">
              <label className="field-full">
                Property title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury 4-bedroom detached duplex"
                  required
                />
              </label>

              <label>
                Listing purpose *
                <select name="purpose" value={form.purpose} onChange={handleChange}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="short_let">Short Let</option>
                </select>
              </label>

              <label>
                Property category *
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="duplex">Duplex</option>
                  <option value="terrace">Terraced House</option>
                  <option value="bungalow">Bungalow</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="industrial">Industrial</option>
                </select>
              </label>

              <label className="field-full">
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the property, its features and surroundings..."
                  required
                />
              </label>
            </div>
          </section>

          <section className="listing-section">
            <h2>02. Price and features</h2>

            <div className="listing-fields">
              <label>
                Price *
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </label>

              <label>
                Currency
                <select name="currency" value={form.currency} onChange={handleChange}>
                  <option value="NGN">NGN - Naira</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - Pound Sterling</option>
                </select>
              </label>

              <label className="listing-checkbox field-full">
                <input
                  type="checkbox"
                  name="priceNegotiable"
                  checked={form.priceNegotiable}
                  onChange={handleChange}
                />
                Price is negotiable
              </label>

              <label>
                Bedrooms
                <input type="number" name="bedrooms" min="0" value={form.bedrooms} onChange={handleChange} />
              </label>

              <label>
                Bathrooms
                <input type="number" name="bathrooms" min="0" value={form.bathrooms} onChange={handleChange} />
              </label>

              <label>
                Toilets
                <input type="number" name="toilets" min="0" value={form.toilets} onChange={handleChange} />
              </label>

              <label>
                Property area
                <input type="number" name="area" min="0" value={form.area} onChange={handleChange} />
              </label>

              <label>
                Area unit
                <select name="areaUnit" value={form.areaUnit} onChange={handleChange}>
                  <option value="sqm">Square metres</option>
                  <option value="sqft">Square feet</option>
                </select>
              </label>

              <label>
                Land size
                <input type="number" name="landSize" min="0" value={form.landSize} onChange={handleChange} />
              </label>

              <label>
                Land size unit
                <select name="landSizeUnit" value={form.landSizeUnit} onChange={handleChange}>
                  <option value="sqm">Square metres</option>
                  <option value="plots">Plots</option>
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </label>

              <label>
                Furnished
                <select name="furnished" value={form.furnished} onChange={handleChange}>
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>

              <label className="field-full">
                Amenities
                <input
                  name="amenities"
                  value={form.amenities}
                  onChange={handleChange}
                  placeholder="Swimming pool, security, parking, garden"
                />
                <small>Separate amenities with commas.</small>
              </label>
            </div>
          </section>

          <section className="listing-section">
            <h2>03. Property location</h2>

            <div className="listing-fields">
              <label className="field-full">
                Street address *
                <input name="address" value={form.address} onChange={handleChange} required />
              </label>

              <label>
                Neighbourhood
                <input name="neighborhood" value={form.neighborhood} onChange={handleChange} />
              </label>

              <label>
                City *
                <input name="city" value={form.city} onChange={handleChange} required />
              </label>

              <label>
                State *
                <input name="state" value={form.state} onChange={handleChange} required />
              </label>

              <label>
                Country
                <input name="country" value={form.country} onChange={handleChange} required />
              </label>
            </div>
          </section>

          <section className="listing-section">
            <h2>04. Property photographs</h2>
            <p className="listing-help">
              Upload up to 10 clear property photographs. JPEG, PNG and WebP formats are accepted. Maximum 5MB per image.
            </p>

            <label className="image-upload-area">
              <ImagePlus size={30} />
              <strong>Select property photographs</strong>
              <span>{images.length} of 10 images selected</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImages}
              />
            </label>

            {previews.length > 0 && (
              <div className="image-preview-grid">
                {previews.map((preview, index) => (
                  <div className="image-preview" key={`${preview}-${index}`}>
                    <img src={preview} alt={`Property preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      <X size={15} />
                    </button>
                    {index === 0 && <span>Primary photo</span>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="listing-submit">
            <p>
              Your property will be reviewed by our team before it appears publicly on Ocean Pyramid Properties.
            </p>

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting property...' : 'Submit Property'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default ListPropertyPage

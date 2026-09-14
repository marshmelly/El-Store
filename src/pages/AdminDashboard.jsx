import { useEffect, useState } from 'react'

import { useAuth } from '../context/AuthContext.jsx'

import {
  getAllProducts,
  createProduct,
  updateProduct,
  setProductActive,
  archiveProduct,
} from '../services/productService.js'

const EMPTY_FORM = {
  id: '',
  title: '',
  type: '2D',
  category: '',
  price: '0',
  thumbnailUrl: '',
  imageUrl: '',
  active: true,
}


export default function AdminDashboard() {
  const { user } = useAuth()

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [form, setForm] = useState(EMPTY_FORM)

  const [editingId, setEditingId] = useState(null)


  /*
   * LOAD PRODUCTS
   *
   * This runs when the admin dashboard opens.
   */
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const result = await getAllProducts()

      setProducts(result)
    } catch (error) {
      console.error(
        'Failed to load admin products:',
        error
      )

      setError(
        'Unable to load products. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadProducts()
  }, [])


  /*
   * HANDLE FORM INPUT
   */
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox'
        ? checked
        : value,
    }))
  }


  /*
   * RESET FORM
   */
  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }


  /*
   * CREATE / UPDATE PRODUCT
   */
  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')
    setSaving(true)

    try {
      /*
       * Basic validation.
       */
      if (!form.id.trim()) {
        throw new Error('Product ID is required.')
      }

      if (!form.title.trim()) {
        throw new Error('Product title is required.')
      }

      if (!form.category.trim()) {
        throw new Error('Product category is required.')
      }

      if (Number(form.price) < 0) {
        throw new Error(
          'Product price cannot be negative.'
        )
      }


      if (editingId) {
        /*
         * Updating an existing product.
         *
         * We don't update the document ID.
         */
        await updateProduct(editingId, {
          title: form.title.trim(),
          type: form.type,
          category: form.category.trim(),
          price: Number(form.price),
          thumbnailUrl: form.thumbnailUrl.trim(),
          imageUrl: form.imageUrl.trim(),
          active: form.active,
        })

        setMessage('Product updated successfully.')
      } else {
        /*
         * Creating a new product.
         */
        await createProduct({
          ...form,
          id: form.id.trim(),
          title: form.title.trim(),
          category: form.category.trim(),
          price: Number(form.price),
          thumbnailUrl: form.thumbnailUrl.trim(),
          imageUrl: form.imageUrl.trim(),
        })

        setMessage('Product created successfully.')
      }

      resetForm()

      await loadProducts()
    } catch (error) {
      console.error(
        'Failed to save product:',
        error
      )

      setError(
        error.message ||
        'Unable to save product.'
      )
    } finally {
      setSaving(false)
    }
  }


  /*
   * LOAD PRODUCT INTO EDIT FORM
   */
  const handleEdit = (product) => {
    setEditingId(product.id)

    setForm({
      id: product.id,
      title: product.title || '',
      type: product.type || '2D',
      category: product.category || '',
      price: String(product.price ?? 0),
      thumbnailUrl: product.thumbnailUrl || '',
      imageUrl: product.imageUrl || '',
      active: product.active === true,
    })

    setError('')
    setMessage('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  /*
   * ACTIVATE / DEACTIVATE PRODUCT
   */
 /*
 * ACTIVATE / DEACTIVATE PRODUCT
 *
 * Archived products cannot be reactivated from here.
 *
 * This prevents an administrator from accidentally
 * bringing an intentionally archived product back into
 * the public store.
 */
const handleToggleActive = async (product) => {

  if (product.archived === true) {
    setError(
      'Archived products cannot be activated.'
    )

    return
  }

  try {

    setError('')
    setMessage('')

    await setProductActive(
      product.id,
      !product.active
    )

    setMessage(
      product.active
        ? 'Product deactivated.'
        : 'Product activated.'
    )

    await loadProducts()

  } catch (error) {

    console.error(
      'Failed to change product status:',
      error
    )

    setError(
      'Unable to change product status.'
    )
  }
}

  /*
 * ARCHIVE PRODUCT
 *
 * We deliberately archive instead of permanently deleting.
 *
 * This keeps the product record available for future
 * order / purchase / download history.
 */
const handleArchive = async (product) => {
  const confirmed = window.confirm(
    `Archive "${product.title}"? This will remove it from the public store.`
  )

  if (!confirmed) {
    return
  }

  try {
    setError('')
    setMessage('')

    await archiveProduct(product.id)

    setMessage(
      `"${product.title}" has been archived.`
    )

    await loadProducts()
  } catch (error) {
    console.error(
      'Failed to archive product:',
      error
    )

    setError(
      'Unable to archive product.'
    )
  }
}

  return (
    <main className="min-h-screen bg-paper px-6 py-12">
      <div className="mx-auto max-w-page">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
            El-Store Admin
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Product Management
          </h1>

          <p className="mt-4 text-sm text-ink/60">
            Welcome, {user?.displayName || user?.email}.
          </p>
        </div>


        {/* =========================
            SUCCESS MESSAGE
        ========================== */}

        {message && (
          <div className="mb-6 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}


        {/* =========================
            ERROR MESSAGE
        ========================== */}

        {error && (
          <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* =========================
            PRODUCT FORM
        ========================== */}

        <section className="mb-12 rounded-sm border border-mist-100 bg-white p-6 md:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-ink">
              {editingId
                ? 'Edit Product'
                : 'Add Product'}
            </h2>

            <p className="mt-2 text-sm text-ink/55">
              {editingId
                ? 'Update the product information below.'
                : 'Add a new digital product to El-Store.'}
            </p>
          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            {/* Product ID */}
            <div>
              <label
                htmlFor="id"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Product ID
              </label>

              <input
                id="id"
                name="id"
                value={form.id}
                onChange={handleChange}
                disabled={Boolean(editingId)}
                placeholder="3D-002"
                required
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-ink/45">
                Example: 2D-002 or 3D-002
              </p>
            </div>


            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Product title
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Character Model"
                required
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>


            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Product type
              </label>

              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
              >
                <option value="2D">
                  2D Artwork
                </option>

                <option value="3D">
                  3D Asset
                </option>
              </select>
            </div>


            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Rasters, Vectors, Models..."
                required
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>


            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
              />

              <p className="mt-2 text-xs text-ink/45">
                Enter 0 for a free product.
              </p>
            </div>


            {/* Thumbnail URL */}
            <div>
              <label
                htmlFor="thumbnailUrl"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Thumbnail URL
              </label>

              <input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                value={form.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>


            {/* Main image URL */}
            <div className="md:col-span-2">
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Main image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>


            {/* Active */}
            <label className="flex items-center gap-3 text-sm text-ink md:col-span-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 accent-black"
              />

              Product is active and visible in the store
            </label>


            {/* Buttons */}
            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="rounded-sm bg-ink px-6 py-3 text-sm font-bold text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'SAVING...'
                  : editingId
                    ? 'UPDATE PRODUCT'
                    : 'ADD PRODUCT'}
              </button>


              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-sm border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist-100"
                >
                  CANCEL
                </button>
              )}

            </div>

          </form>
        </section>


        {/* =========================
            PRODUCT LIST
        ========================== */}

        <section>

          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">
                Products
              </h2>

              <p className="mt-1 text-sm text-ink/55">
                {products.length} product
                {products.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>


          {loading ? (
            <div className="rounded-sm border border-mist-100 bg-white p-8 text-center">
              <p className="text-sm text-ink/60">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-sm border border-mist-100 bg-white p-8 text-center">
              <p className="text-sm text-ink/60">
                No products have been added yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-sm border border-mist-100 bg-white">

              <table className="w-full min-w-[850px] text-left">

                <thead className="border-b border-mist-100">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink/45">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink/45">
                      Type
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink/45">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink/45">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink/45">
                      Actions
                    </th>
                  </tr>
                </thead>


                <tbody>

                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-mist-100 last:border-0"
                    >

                      <td className="px-5 py-4">
                        <p className="font-medium text-ink">
                          {product.title}
                        </p>

                        <p className="mt-1 text-xs text-ink/45">
                          {product.id}
                        </p>
                      </td>


                      <td className="px-5 py-4 text-sm text-ink/70">
                        {product.type === '3D'
                          ? '3D Asset'
                          : '2D Artwork'}
                      </td>


                      <td className="px-5 py-4 text-sm text-ink">
                        {Number(product.price) === 0
                          ? 'FREE'
                          : `$${Number(product.price).toFixed(2)}`}
                      </td>


                      <td className="px-5 py-4">
                        <span
                          className={
                            product.active
                              ? 'text-xs font-semibold text-green-600'
                              : 'text-xs font-semibold text-ink/40'
                          }
                        >
                          {product.active
                            ? 'ACTIVE'
                            : 'INACTIVE'}
                        </span>
                      </td>


                      <td className="px-5 py-4">

                        <div className="flex flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(product)
                            }
                            className="rounded-sm border border-ink/15 px-3 py-2 text-xs font-semibold text-ink hover:bg-mist-100"
                          >
                            EDIT
                          </button>


                          <button
                              type="button"
                               onClick={() =>
                                        handleToggleActive(product)
                                       }
                                disabled={product.archived === true}
                                 className="rounded-sm border border-ink/15 px-3 py-2 text-xs font-semibold text-ink hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {product.archived
                                      ? 'ARCHIVED'
                                      : product.active
                                      ? 'DEACTIVATE'
                                        : 'ACTIVATE'}
                         </button>

                         <button
                              type="button"
                              onClick={() =>
                                      handleArchive(product)
                                       }
                               disabled={product.archived === true}
                               className="rounded-sm border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                           >
                             {product.archived
                                   ? 'ARCHIVED'
                                   : 'ARCHIVE'}
                          </button>
                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  )
}
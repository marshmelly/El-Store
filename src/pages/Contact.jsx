import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    // TODO: this form doesn't send anywhere yet. Wire it up to a real
    // endpoint — e.g. an email service like Formspree/EmailJS, or a
    // backend route that emails elart@info.store — before launch.
    setStatus('sending')
    setTimeout(() => {
      console.log('Contact form submitted:', form)
      setStatus('sent')
    }, 600)
  }

  const inputClasses =
    'w-full bg-[#1a1a1a] border border-mist-700 text-paper px-3 py-2.5 text-[0.95rem] font-body rounded-sm ' +
    'focus:border-paper focus:outline-none'

  return (
    <main className="bg-ink text-paper px-8 pt-12 pb-20">
      <h1 className="text-center text-4xl font-medium">Let's Work Together</h1>
      <p className="text-center text-mist-300 mt-4 mb-12 leading-relaxed">
        {/* TODO: confirm these with the client — pulled directly from the PDF */}
        Email: elart@info.store
        <br />
        Phone: +254 708 072630
      </p>

      <div className="max-w-page mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <form className="flex flex-col gap-5.5" onSubmit={handleSubmit}>
          <p className="text-mist-300 leading-relaxed">
            I work remotely.
            <br />
            Commissions are accepted.
          </p>

          <fieldset className="border-none p-0 m-0 flex flex-col gap-2">
            <legend className="p-0 mb-1 text-base">
              Name <span className="text-mist-500 font-normal text-sm">(required)</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-mist-300 mb-1.5">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={update('firstName')}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm text-mist-300 mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={update('lastName')}
                  required
                  className={inputClasses}
                />
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="block text-sm text-mist-300 mb-1.5">
              Email <span className="text-mist-500 font-normal text-sm">(required)</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="block text-sm text-mist-300 mb-1.5">
              Message <span className="text-mist-500 font-normal text-sm">(required)</span>
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={update('message')}
              required
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            className="btn-outline self-start mt-2 disabled:opacity-60 disabled:cursor-default"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>

          {status === 'sent' && (
            <p className="text-sm text-mist-300" role="status">
              Thanks — this is a placeholder confirmation. Hook up a real
              email service to actually deliver messages.
            </p>
          )}
        </form>

        {/* TODO: replace with the client's real image (or drop it in
            favor of a map / calendar embed) */}
        <img
          className="w-full bg-paper order-first md:order-none"
          src="https://picsum.photos/seed/el-contact-graphic/900/900"
          alt=""
        />
      </div>
    </main>
  )
}

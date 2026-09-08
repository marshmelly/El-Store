// Bio copy taken directly from the PDF (typo "Suppoty" in the button is
// fixed to "Support" below — flag this with the client to confirm the
// intended wording).
const BIO_TEXT = `As a versatile artist, I have cultivated a diverse skill set that spans traditional art, digital art, 3D design, and animation. My services encompass a wide range of creative offerings, including comic art, illustrations for publications, 3D modeling, 3D texturing, 3D character rigging, and animation. With this skill set, I'm equipped to bring your artistic visions to life in various forms, from static illustrations to dynamic animated stories.`

export default function About() {
  return (
    <main className="bg-ink text-paper">
      <section className="max-w-page mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-[0.9fr_1.4fr] gap-12 items-center">
        <p className="order-2 md:order-1 text-base leading-relaxed text-mist-300">{BIO_TEXT}</p>

        {/* TODO: replace with the client's real photo of them working */}
        <img
          className="order-1 md:order-2 w-full aspect-[16/10] object-cover"
          src="https://picsum.photos/seed/el-artist-working/900/700"
          alt="The artist sketching on a drawing tablet"
        />
      </section>

      <section className="max-w-page mx-auto px-8 pt-6 pb-16 grid grid-cols-1 md:grid-cols-[0.9fr_1.4fr] gap-12 items-center">
        {/* TODO: swap for the client's real Patreon artwork/illustration */}
        <img
          className="w-full object-cover"
          src="https://picsum.photos/seed/el-patreon-art/700/900"
          alt="Colorful illustration of the artist at work"
        />

        <div className="flex flex-col items-start gap-4">
          {/* PAYMENT / EXTERNAL LINK NOTE: this "Support me on Patreon"
              button is the only monetization CTA in the client's design —
              there's no on-site checkout on this page. Point href at the
              client's real Patreon URL. */}
          <a
            className="inline-flex items-center gap-2.5 bg-patreon text-paper px-6 py-3.5 font-bold tracking-wide rounded-sm"
            href="https://www.patreon.com/"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <circle cx="15" cy="8.5" r="5.5" />
              <rect x="3" y="2" width="3" height="20" />
            </svg>
            PATREON
          </a>

          <h2 className="text-3xl font-semibold">Support me on Patreon.</h2>
          <p className="text-mist-300 leading-relaxed max-w-[46ch]">
            I'm creating fan art on Patreon, where you can get access to some
            great exclusive content such as high-quality art, original
            Photoshop files, 3D assets, tutorials and more.
          </p>

          <a
            className="btn-outline mt-2"
            href="https://www.patreon.com/"
            target="_blank"
            rel="noreferrer"
          >
            Support my Patreon
          </a>
        </div>
      </section>
    </main>
  )
}

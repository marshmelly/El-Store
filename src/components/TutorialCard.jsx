/**
 * Tutorial tile — thumbnail + caption underneath, on a black background,
 * matching the Tutorials screen in the PDF.
 *
 * TODO: wire `href` to the real tutorial/video URL (YouTube, Patreon post,
 * blog article, etc.) once the client provides links.
 */
export default function TutorialCard({ image, title, href = '#' }) {
  return (
    <a className="group block text-paper" href={href} target="_blank" rel="noreferrer">
      <div className="w-full aspect-video overflow-hidden bg-mist-700">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-3 ml-0.5 text-[0.95rem] font-medium">{title}</p>
    </a>
  )
}

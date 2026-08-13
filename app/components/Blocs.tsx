import type { Bloc } from '@/content/articles'

/** Renders an article body. Shared by the French and English article routes. */
export function Blocs({ blocs }: { blocs: Bloc[] }) {
  return (
    <div className="prose-editorial text-text/85">
      {blocs.map((bloc, i) => {
        if (bloc.type === 'h2') {
          return (
            <h2
              key={i}
              className="font-heading mb-6 mt-16 text-3xl uppercase leading-tight sm:text-4xl"
            >
              {bloc.text}
            </h2>
          )
        }
        if (bloc.type === 'quote') {
          return (
            <blockquote
              key={i}
              className="my-14 border-l-4 border-accent-primary pl-6"
            >
              <p className="chapeau text-text">{bloc.text}</p>
            </blockquote>
          )
        }
        if (bloc.type === 'image') {
          return (
            <figure key={i} className="my-14 w-full">
              <img
                src={bloc.src}
                alt={bloc.alt}
                width={bloc.width}
                height={bloc.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full border-2 border-text"
              />
              {bloc.caption ? (
                <figcaption className="mt-3 text-sm leading-relaxed text-text/55">
                  {bloc.caption}
                </figcaption>
              ) : null}
            </figure>
          )
        }
        if (bloc.type === 'tableau') {
          return (
            <figure key={i} className="my-12">
              {/* Wide tables scroll inside their own box, never the page. */}
              <div className="overflow-x-auto border-2 border-text">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b-2 border-text bg-text text-bg">
                      {bloc.colonnes.map((col, c) => (
                        <th
                          key={col}
                          scope="col"
                          className={`label px-4 py-3 font-medium ${
                            c === bloc.accent ? 'text-warm' : ''
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bloc.lignes.map((ligne) => (
                      <tr
                        key={ligne[0]}
                        className="border-b border-text/20 last:border-b-0"
                      >
                        {ligne.map((cell, c) => (
                          <td
                            key={c}
                            className={`px-4 py-3 text-base ${
                              c === 0 ? 'text-text/70' : 'text-text'
                            } ${
                              c === bloc.accent
                                ? 'font-medium text-accent-primary'
                                : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {bloc.note ? (
                <figcaption className="label mt-3 text-text/50">
                  {bloc.note}
                </figcaption>
              ) : null}
            </figure>
          )
        }
        if (bloc.type === 'liste') {
          return (
            <ul key={i} className="my-8 space-y-3">
              {bloc.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{bloc.text}</p>
      })}
    </div>
  )
}

import { countryCentroid, projectLonLat } from '../utils/geo'

interface CountryPoint {
  code: string
  name: string
  sessions: number
}

interface CountryMapProps {
  countries: CountryPoint[]
}

export function CountryMap({ countries }: CountryMapProps) {
  const width = 800
  const height = 360
  const max = Math.max(...countries.map((country) => country.sessions), 1)

  const points = countries
    .map((country) => {
      const centroid = countryCentroid(country.code)
      if (!centroid) return null
      const [lon, lat] = centroid
      const { x, y } = projectLonLat(lon, lat, width, height)
      const radius = 5 + (country.sessions / max) * 16
      return { ...country, x, y, radius }
    })
    .filter((point): point is NonNullable<typeof point> => point !== null)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/60 p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Anonymous visitor countries on a schematic world map"
      >
        <rect width={width} height={height} fill="#0b1220" />
        {/* Simple graticule / ocean framing — not a precise cartography product */}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={(width / 12) * i}
            y1={0}
            x2={(width / 12) * i}
            y2={height}
            stroke="#1a2438"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={(height / 6) * i}
            x2={width}
            y2={(height / 6) * i}
            stroke="#1a2438"
            strokeWidth="1"
          />
        ))}
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width * 0.42}
          ry={height * 0.42}
          fill="none"
          stroke="#243149"
          strokeWidth="2"
        />
        {points.map((point) => (
          <g key={point.code}>
            <circle
              cx={point.x}
              cy={point.y}
              r={point.radius}
              fill="rgb(50 108 229 / 0.55)"
              stroke="#5b8def"
              strokeWidth="1.5"
            >
              <title>
                {point.name}: {point.sessions} sessions
              </title>
            </circle>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-xs text-ink-muted">
        Country-level only (CDN edge). Circles mark country centroids — not city
        or IP precision. Unknown/unsupported codes are omitted from the map and
        still counted in the list.
      </p>
    </div>
  )
}

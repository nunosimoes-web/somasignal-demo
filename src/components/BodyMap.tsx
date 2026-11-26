import { regions, type Region, type RegionId } from '../data/regions'

const left = regions.filter((region) => region.side === 'left')
const right = regions.filter((region) => region.side === 'right')
const ROW = 52

function labelY(index: number) {
  return index * ROW + ROW / 2
}

function Labels({
  items,
  side,
  active,
  onSelect,
}: {
  items: Region[]
  side: 'left' | 'right'
  active: RegionId | null
  onSelect: (id: RegionId) => void
}) {
  return (
    <div className={`zone-column is-${side}`}>
      {items.map((region) => (
        <button
          aria-pressed={active === region.id}
          className="zone"
          key={region.id}
          onClick={() => onSelect(region.id)}
          type="button"
        >
          {region.label}
        </button>
      ))}
    </div>
  )
}

export function BodyMap({ active, onSelect }: { active: RegionId | null; onSelect: (id: RegionId) => void }) {
  const leaders = [
    ...left.map((region, index) => ({ region, x: 0, y: labelY(index) })),
    ...right.map((region, index) => ({ region, x: 160, y: labelY(index) })),
  ]

  return (
    <div className="body-map" role="group" aria-label="Zonas do corpo">
      <Labels items={left} side="left" active={active} onSelect={onSelect} />
      {/* O desenho é um atalho para rato e toque; os botões ao lado fazem o mesmo com teclado e leitor de ecrã. */}
      <svg className="body-figure" viewBox="0 0 160 416" aria-hidden="true" focusable="false">
        <g className="body-shape">
          <ellipse cx="80" cy="36" rx="22" ry="27" />
          <path d="M71 56h18v24H71z" />
          <path d="M50 86q15-3 21-10h18q6 7 21 10 12 4 13 20l-9 44q-4 30 1 58l3 20-38 10-38-10 3-20q5-28 1-58l-9-44q1-16 13-20z" />
          <path className="limb" d="M46 102 31 166 21 226M114 102l15 64 10 60" />
          <circle cx="20" cy="234" r="10" />
          <circle cx="140" cy="234" r="10" />
          <path d="M44 222q36 14 72 0l-8 86q0 44-7 84H87q0-50-7-142-7 92-7 142H59q-7-40-7-84z" />
          <ellipse cx="66" cy="398" rx="14" ry="8" />
          <ellipse cx="94" cy="398" rx="14" ry="8" />
        </g>
        {leaders.map(({ region, x, y }) => (
          <g
            className={`leader ${active === region.id ? 'is-active' : ''}`}
            key={region.id}
            onClick={() => onSelect(region.id)}
          >
            <line x1={x} y1={y} x2={region.dot[0]} y2={region.dot[1]} />
            <circle className="dot-hit" cx={region.dot[0]} cy={region.dot[1]} r="12" />
            <circle className="dot" cx={region.dot[0]} cy={region.dot[1]} r={active === region.id ? 7 : 4.5} />
          </g>
        ))}
      </svg>
      <Labels items={right} side="right" active={active} onSelect={onSelect} />
    </div>
  )
}

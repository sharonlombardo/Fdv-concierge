import type { DiaryData } from './DiaryData';

interface MobileIndexProps {
  data: DiaryData;
  onDayTap?: (dayNumber: number) => void;
}

export function MobileIndex({ data, onDayTap }: MobileIndexProps) {
  return (
    <div className="diary mob-card mob-index">
      <header className="mob-idx-mast">
        <span className="brand-mark" style={{ fontSize: 8 }}>
          FIL DE VIE · {data.destination.toUpperCase()} {data.year}
        </span>
        <hr className="gold-rule" style={{ margin: '10px auto 0' }} />
      </header>

      <div className="mob-idx-titleblock">
        <p className="label--muted" style={{ fontSize: 8 }}>
          EIGHT DAYS · FOUR FAVORITES
        </p>
        <h2
          className="serif-italic"
          style={{ fontSize: 28, marginTop: 6, lineHeight: 1.05 }}
        >
          Marrakech &amp;<br />
          the Atlas
        </h2>
      </div>

      <div className="mob-idx-grid">
        {data.days.map((d) => {
          const handleClick = onDayTap ? () => onDayTap(d.n) : undefined;
          return (
            <div
              key={d.n}
              className="mob-idx-tile"
              onClick={handleClick}
              role={handleClick ? 'button' : undefined}
              tabIndex={handleClick ? 0 : undefined}
              onKeyDown={
                handleClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                      }
                    }
                  : undefined
              }
              style={handleClick ? { cursor: 'pointer' } : undefined}
            >
              <div className="photo-frame mob-idx-thumb">
                {d.hero ? (
                  <img className="photo" src={d.hero} alt="" />
                ) : (
                  <div className="photo-placeholder" style={{ fontSize: 7 }}>
                    {d.location}
                    <br />
                    {d.sub_location}
                  </div>
                )}
                <span className="mob-idx-badge">0{d.n}</span>
              </div>
              <div className="mob-idx-text">
                <div className="serif-italic" style={{ fontSize: 11, lineHeight: 1.2 }}>
                  {d.location}
                </div>
                <div
                  className="sub-location"
                  style={{ fontStyle: 'italic', fontSize: 9, marginTop: 2 }}
                >
                  / {d.sub_location}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mob-idx-foot">
        <span className="tagline" style={{ fontSize: 9 }}>{data.tagline}</span>
      </footer>
    </div>
  );
}

export default MobileIndex;

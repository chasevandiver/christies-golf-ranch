import { formatOccurrence, type Occurrence } from "@/lib/events";

export default function EventsList({ events }: { events: Occurrence[] }) {
  if (events.length === 0) {
    return <p className="events-empty">Nothing on the calendar right now — check back soon, or give us a call.</p>;
  }

  return (
    <div className="events-list reveal">
      {events.map((e, i) => {
        const d = formatOccurrence(e.date);
        const time = [e.start_time, e.end_time].filter(Boolean).join("–");
        return (
          <div className="evt" key={`${e.id}-${i}`}>
            <div className="date">
              <div className="dow">{d.weekday}</div>
              <div className="day">{d.day}</div>
              <div className="mon">{d.month}</div>
            </div>
            <div className="body">
              <h4>{e.title}</h4>
              {e.description ? <p>{e.description}</p> : null}
              <div className="meta">
                {time ? <span>{time}</span> : null}
                {e.price ? <span>{e.price}</span> : null}
                {e.location ? <span>{e.location}</span> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

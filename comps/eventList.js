import Link from 'next/link'

const EventList = ({events}) => <ul className='mainBodyUl'>
  <style jsx>{`
    .mainBodyUl {
      display: flex;
      height: 100%;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
    }
    .mainBodyLi {
      margin: 3%;
    }
    .aLink {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 30px;
      border: 0;
      background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.75) 0%,
        rgba(255, 255, 255, 0.6) 10%,
        rgba(255, 255, 255, 0.5) 90%,
        rgba(221, 221, 221, 0.65) 100%
      );
      box-shadow: 0 0 10px #768a8f;
      color: #ebf5fc;
      font-size: 15px;
      display: block;
      text-decoration: none;
      text-align: center;
      line-height: 120px;
      outline: none;
    }
  `}</style>
  {events && events.length > 0 && events.map(raceEvent =>
    <li className='mainBodyLi' key={'event-' + raceEvent.id}>
      <Link as={`/event/${raceEvent.uniqueName}`} href={`/event?uniqueName=${raceEvent.uniqueName}`}>
        <a className='aLink'>{raceEvent.nameCht}</a>
      </Link>
    </li>
  )}
</ul>

export default EventList

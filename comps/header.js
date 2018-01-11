import Link from 'next/link'

const Header = ({name, uniqueName, navs}) => <div className='mainHeader'>
  <style jsx>{`
    .mainHeader {
      height: 45px;
      position: relative;
      z-index: 20;
    }
    .heading {
      position: relative;
      display: inline-block;
    }
    h1 {
      position: relative;
      display: inline-block;
      font-size: 14.5px;
      height: 45px;
      line-height: 45px;
      font-size: 17px;
      letter-spacing: 0.4px;
      color: #fff;
    }
    h1 span {
      padding: 0 0 0 5px;
    }
    .eventNameA {
      display: block;
      width: 100%;
      height: 100%;
    }
    .navContainer {
      position: relative;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      vertical-align: top;
    }
    .navLi {
      position: relative;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      vertical-align: top;
    }
    .navA {
      display: block;
      width: 100%;
      height: 100%;
      color: #fff;
      padding: 0 12px;
      text-decoration: none;
      font-size: 15px;
      text-align: center;
    }
    .navA:first-child {
      padding: 0 12px 0 6px;
    }
  `}</style>
  {uniqueName === undefined
    ? <div className='heading'>
      <h1>
        <span>Beardude</span>
        <span>Event</span>
      </h1>
    </div>
    : <div className='heading'>
      <h1 className='eventName'>
        <Link as={`/event/${uniqueName}`} href={`/event?uniqueName=${uniqueName}`}><a className='navA'>{name}</a></Link>
      </h1>
      <ul className='navContainer'>
        {navs.map(nav => <li className='navLi' key={'nav-' + nav.key}>
          <Link as={`/event/${uniqueName}/${nav.key}`} href={`/event?uniqueName=${uniqueName}&nav=${nav.key}`}>
            <a className='navA'>{nav.name}</a>
          </Link></li>)}
      </ul>
    </div>}
</div>

export default Header

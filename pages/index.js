import conf from '../lib/conf'
import fetch from 'isomorphic-unfetch'
import EventList from '../comps/eventList'
import Head from 'next/head'
import Header from '../comps/header'

const Index = (props) => (
  <div className='wrap'>
    <style jsx>{`
      .wrap {
        width: 100%;
        height: 100%;
      }
      .mainBody {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow: auto;
        font-size: 15px;
      }
    `}
    </style>
    <Head>
      <title>Beardude Event</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link href='/static/css/index.css' rel='stylesheet' />
    </Head>
    <Header />
    <div className='mainBody'>
      <EventList events={props.events} />
    </div>
  </div>
)

Index.getInitialProps = async function ({ pathname, query }) {
  const host = conf.getHost()
  const queryParam = (query.showall === '1') ? '/all' : ''
  const response = await fetch(`${host}/api/event/getEvents${queryParam}`, {mode: 'no-cors', credentials: 'include'})
  let out = {}
  if (response.status === 200) {
    const res = await response.json()
    out.events = res.events
  }
  return out
}

export default Index

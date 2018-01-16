import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Header from '../comps/header'
import io from 'socket.io-client'
import LeaderBoard from '../comps/leaderBoard'
import processData from '../lib/processData'
import React from 'react'
import Register from '../comps/register'
import Router from 'next/router'
import YouTubePlayer from 'youtube-player'

const youtubeParams = '?rel=0&controls=0&modestbranding=1&enablejsapi=1&autoplay=1&hd=1&autohide=1&showinfo=0&playsinline=1'
let host
export default class Event extends React.Component {
  _bind (...methods) { methods.forEach((method) => { if (this[method]) { this[method] = this[method].bind(this) } }) }
  constructor (props) {
    super(props)
    host = props.url.query.host
    this.isMobile = false
    this.socketio = io(host)
    this.streamVideo = undefined
    this.streamVideoIframe = undefined
    this.state = {
      broadcastStatus: undefined,
      races: [],
      raceSelected: 0,
      streamHeight: 315,
      width: 0
    }
    this._bind('socketIoEvents', 'handleSelect', 'setIframeHeight', 'updateBroadcastStatus')
  }
  setIframeHeight () {
    this.setState({streamHeight: Math.floor(Math.min(window.innerWidth, 1137) / 16 * 9)})
  }
  socketIoEvents () {
    const that = this
    this.socketio.on('connect', () => fetch(`${host}/api/socket/info?sid=${this.socketio.id}`, {credentials: 'include'}))
    this.socketio.on('eventlatencyupdate', (data) => that.setState({ system: data.system }))
    this.socketio.on('raceupdate', (data) => that.setState({ races: processData.updateRaces(that.state.races, data.races), system: data.system }))
  }
  componentDidMount () {
    const that = this
    const getEvent = async (successCallback) => {
      const response = await fetch(`${host}/api/event/info/${that.props.url.query.uniqueName}`, {credentials: 'include'})
      if (response.status === 200) {
        const res = await response.json()
        return that.setState({
          event: res.event,
          groups: res.groups,
          registrations: res.registrations,
          nameTables: {
            group: processData.returnIdNameMap(res.groups),
            race: processData.returnIdNameMap(res.races),
            reg: processData.returnRegMap(res.registrations)
          },
          info: `${res.event.name} - ${res.event.location} ${processData.returnDate(res.event.startTime)} ${processData.returnTime(res.event.startTime)}`,
          broadcastStatus: processData.returnBroadcastStatus(res.event),
          races: res.races,
          raceSelected: processData.returnSelectedRace(res.races, res.system.ongoingRace),
          system: res.system
        }, () => successCallback(res))
      }
      Router.push('/')
    }
    const onSuccess = (res) => {
      that.socketIoEvents()
      that.setIframeHeight()
      that.setState({ raceSelected: processData.returnSelectedRace(that.state.races, res.system.ongoingRace) })
      if (that.streamVideo) {
        that.streamVideoIframe = YouTubePlayer('streamVideo')
      }
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
        that.isMobile = true
        // On mobile Youtube video is paused initially. start the video
        if (that.state.broadcastStatus === 'live' && that.streamVideoIframe) { that.streamVideoIframe.playVideo() }
      }
    }
    this.socketio = io(window.location.origin)
    window.addEventListener('resize', this.setIframeHeight)
    getEvent(onSuccess)
  }
  componentWillReceiveProps () {
    TPDirect.setupSDK(11454, 'app_KNKgl08QjHL9ZyLYdu1F5uHHFlnnd7OGKwZ98S1lnPikxy67XEsO6OweBVji', 'sandbox')
  }
  componentWillUnmount () {
    this.socketio.close()
    window.removeEventListener('resize', this.setIframeHeight)
  }
  handleSelect (index) {
    return (e) => { this.setState({ raceSelected: index }) }
  }
  render () {
    const { event, groups, info, nameTables, races, raceSelected, streamHeight } = this.state
    const navs = [{key: 'register', name: '報名'}, {key: 'rules', name: '規則'}]
    let nav = this.props.url.query.nav
    const broadcastStatus = 'init'
    let toShowStream = (broadcastStatus === 'live' || (!nav && broadcastStatus !== 'init'))
    // 沒有活動資料時顯示Loading
    if (!event) { return <div className='wrap'><div className='loading'>Loading</div></div> }
    if (nav && (nav !== 'rules' && nav !== 'register')) { Router.push(`/event/${event.uniqueName}`) }
    /*
      時間 / tab. 該時間點所有的tab內容都會render, 透過css控制顯示/隱藏, 如此切換tab的時候Youtube的影片不會中斷
                home             rules           register
      init:     txt              rules           reg
      started:  stream+txt+board rules           reg
      live:     stream+board     stream+rules    stream+reg
      ended:    stream+board     rules           reg
    */

    return <div className='wrap'>
      <style jsx>{`
        .mainBody, .mainBody>div, .herowrap {
          position: relative;
        }
        .wrap {
          width: 100%;
          height: 100%;
        }
        .mainBody {
          max-width: 1920px;
          width: 100%;
          height: 100%;
          overflow: auto;
          font-size: 15px;
        }
        .loading,
        .noData {
          font-size: 24px;
          font-weight: 100;
          letter-spacing: 2px;
          color: #fff;
          margin: 200px auto;
          text-align: center;
        }
        .eventTitle {
          font-weight: 400;
          color: #eee;
          font-size: 16px;
          padding: 0 16px;
          line-height: 26px;
          opacity: 0.9;
          text-align: left;
        }
        .streamVideo {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          text-align: center;
        }
        .stream {
          margin: 0 auto;
          display: inline-block;
        }
        .announcement {
          background: #AA0905;
          font-size: 16px;
          padding: 10px 30px;
          text-align: center;
        }
        .overlayText {
          width: 100%;
          font-size: 24px;
          text-align: center;
          z-index: 100;
        }
        .herowrap {
          min-height: 200px;
        }
        .content {
          position: relative;
          z-index: 5;
          padding: 20px 30px;
          line-height: 32px;
        }
        .footer {
          padding: 30px 0;
          color: #fff;
          font-size: 11px;
          text-align :center;
        }
      `}
      </style>
      <Head>
        <title>{event.nameCht}</title>
        <meta name='og:title' content={event.nameCht} />
        <meta name='description' content={info} />
        <meta name='og:description' content={info} />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link href='/static/css/index.css' rel='stylesheet' />
        <script src="https://js.tappaysdk.com/tpdirect/v3" />
      </Head>
      <Header event={event} />
      <div className='mainBody'>
        <div className='herowrap'>
          {event.announcement && event.announcement !== '' && <div className='announcement'>[公告] {event.announcement}</div>}
          {!nav && <div className='overlayText'>
            {broadcastStatus === 'init' && <span>決賽轉播 {processData.returnTime(event.streamingStart)} 開始</span>}
            {broadcastStatus === 'started' && <span>比賽進行中，預計 {processData.returnTime(event.streamingStart)} 開始轉播</span>}
          </div>}
          {toShowStream && <div className='streamVideo'>
            <iframe id='streamVideo' ref={c => (this.streamVideo = c)} className='stream' width='100%' height={streamHeight} src={`${event.streamingIframe}${youtubeParams}`} frameBorder='0' allowFullScreen />
          </div>}
        </div>
        <div className='content'>
          {nav === 'register' && <Register />}
          {nav === 'rules' && processData.returnLineBreakText(event.rules)}
          {!nav && LeaderBoard({nameTables, groups, races, raceSelected, handleSelect: this.handleSelect})}
        </div>
        <div className='footer'>
          <span>Powered by Beardude Event <span>&copy;</span> <span>{new Date().getFullYear()}</span></span>
        </div>
      </div>
    </div>
  }
}

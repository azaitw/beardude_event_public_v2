const Conf = {
  getHost: () => (process.env.EC_APP_ENV === 'production') ? 'https://azai.synology.me:8888' : 'http://localhost:1337'
}

export default Conf

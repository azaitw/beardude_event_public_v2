const Conf = {
  getHost: () => {
    switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://crit.tw'
    case 'stage':
      return 'http://192.168.0.196:40000'
    default:
      return 'http://localhost:1337'
    }
  }
}

export default Conf

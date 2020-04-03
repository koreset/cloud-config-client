const axios = require('axios')
const Config = require('./lib/config')

function loadConfig(url, application, env, label) {
  // function loadConfig(testNumber) {
  return new Promise((resolve, reject) => {
    axios
      .get(getPath(url, application, [env], label))
      .then(response => {
        const config = new Config(response.data, null)
        resolve(config)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * Build spring config endpoint path
 *
 * @param {string} path - host base path
 * @param {string} name - application name
 * @param {(string|string[])} [profiles] - list of profiles, if none specified will use 'default'
 * @param {string} [label] - environment id
 * @returns {string} spring config endpoint
 */
function getPath(path, name, profiles, label) {
  const profilesStr = buildProfilesString(profiles)
  return (
    (path.endsWith('/') ? path : path + '/') +
    encodeURIComponent(name) +
    '/' +
    encodeURIComponent(profilesStr) +
    (label ? '/' + encodeURIComponent(label) : '')
  )
}

/**
 * Build profile string from options value
 *
 * @param {(string|string[])} [profiles] - list of profiles, if none specified will use 'default'
 */
function buildProfilesString(profiles) {
  if (!profiles) {
    return 'default'
  }
  if (Array.isArray(profiles)) {
    return profiles.join(',')
  }
  return profiles
}

module.exports = loadConfig

import axios from 'axios'

const actions = {
  getRankInfo: ({ commit, rootState }, info) => {
    return new Promise(function(resolve) {
      axios({
        url: info.url,
        // data: info.params
        params: info.params
      }).then(function(response) {
        resolve(response)
      }).catch(function(error) {
        console.log('================', error)
      })
    })
  }
}
export default {
  namespaced: true,
  actions
}

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    athletes: [
      {
        id: '118081982',
        name: 'Калмыков Константин Константинович'
      },
      {
        id: '122127054',
        name: 'Постоев Юрий Николаевич'
      },
      {
        id: '126509124',
        name: 'Федосов Владимир Алексеевич'
      }
    ],
    type: 'matrix',
    nodes: {
      laps: [
        [
          { videoLink: null, score: '2-2', time: '01:23', opponent: 2 },
          { videoLink: null, score: '2--2', time: '01:23', opponent: 1 },
          { videoLink: null, score: '0-0', time: '00:00', opponent: null }
        ],
        [
          { videoLink: null, score: '0-0', time: '00:00', opponent: 3 },
          { videoLink: null, score: '0-0', time: '00:00', opponent: null },
          { videoLink: null, score: '0-0', time: '00:00', opponent: 1 }
        ],
        [
          { videoLink: null, score: '0-0', time: '00:00', opponent: null },
          { videoLink: null, score: '0-0', time: '00:00', opponent: 3 },
          { videoLink: null, score: '0-0', time: '00:00', opponent: 2 }
        ]
      ]
    }
  },
  mutations: {
    update(state, { lap, athlete, opponent, score, time }) {
      state.nodes.laps[lap][athlete].score = score
      state.nodes.laps[lap][athlete].time = time
      if (opponent) {
        state.nodes.laps[lap][opponent - 1].score = score
        state.nodes.laps[lap][opponent - 1].time = time
      }
    }
  },
  plugins: [createPersistedState()]
})

<template>
  <div style="position: relative; max-width: 500px; padding: 20px;">
    <table
      ref="table"
      class="table table-striped table-bordered category-matrix"
    >
      <thead>
        <tr>
          <th v-for="(lap, lapIndex) in nodes.laps" :key="lapIndex">
            Круг
            {{ lapIndex + 1 }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(info, infoIndex) in athletes" :key="infoIndex">
          <td
            v-for="(lap, lapIndex) in nodes.laps"
            :key="lapIndex"
            class="lap-cell"
            :class="{ 'point-on-hover': lap[infoIndex].opponent }"
            @click="
              lap[infoIndex].opponent
                ? handleCellClick(infoIndex, lapIndex)
                : null
            "
          >
            <div v-if="lap[infoIndex].opponent">
              <div class="opponent-number">{{ lap[infoIndex].opponent }}</div>
              <div class="score">{{ formatScore(lap[infoIndex].score) }}</div>
              <div class="time">{{ formatTime(lap[infoIndex].time) }}</div>
            </div>
            <div v-else class="free-cell"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <canvas width="460" height="230" ref="canvas"></canvas>
    <transition name="modal" v-if="showModal" @close="showModal = false">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <slot name="body">
                <video
                  :src="videoLink"
                  width="400"
                  height="300"
                  controls="controls"
                />
                <form @submit="checkForm" class="form" id="itemform">
                  <div class="row-container">
                    <div class="row-title">Видео:</div>
                    <input
                      @change="videoSelect"
                      type="file"
                      accept="video/mp4,video/webm,application/ogg,audio/ogg,video/ogg"
                    />
                  </div>

                  <div class="row-container">
                    <div class="row-title">Счёт:</div>
                    <input
                      v-model="score"
                      pattern="[0-9]{1,2}[^0-9]+[0-9]{1,2}"
                      type="text"
                      size="10"
                      required
                    />
                  </div>
                  <span class="form-error"> Укажите результат!</span>

                  <div class="row-container">
                    <div class="row-title">Время:</div>
                    <input
                      v-model="time"
                      placeholder="00:00"
                      type="time"
                      required
                    />
                  </div>
                  <span class="form-error"> Укажите время!</span>
                </form>
              </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button
                  type="submit"
                  class="modal-default-button"
                  form="itemform"
                >
                  Сохранить
                </button>
                <button class="modal-default-button" @click="showModal = false">
                  Закрыть
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ContestTableMatrix',
  data() {
    return {
      showModal: false,
      currentItem: null,
      score: null,
      time: null,
      videoLink: null
    }
  },
  mounted() {
    this.drawCanvas()
  },
  computed: mapState(['nodes', 'type', 'athletes']),
  methods: {
    handleCellClick(cellIndex, lapIndex) {
      this.currentItem = [cellIndex, lapIndex]
      this.showModal = true
    },
    formatScore(score) {
      let firstScore = parseInt(score)
      let lastScore = parseInt(score.match(/\d+$/)[0])
      return `${firstScore}-${lastScore}`
    },
    formatTime(time) {
      let firstTime =
        parseInt(time) < 10 ? '0' + parseInt(time) : parseInt(time)
      let lastTime =
        parseInt(time.match(/\d+$/)[0]) < 10
          ? '0' + parseInt(time.match(/\d+$/)[0])
          : parseInt(time.match(/\d+$/)[0])
      return `${firstTime}:${lastTime}`
    },

    checkForm: function(e) {
      e.preventDefault()

      this.update({
        lap: this.currentItem[1],
        athlete: this.currentItem[0],
        score: this.score,
        time: this.time,
        videoLink: this.videoLink
      })

      this.showModal = false

      setTimeout(() => this.drawCanvas(), 1000)
    },
    videoSelect: function(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      var file = files[0]
      this.videoLink = URL.createObjectURL(file)
      console.log(this.videoLink)
    },
    drawCanvas: function() {
      var canvas = this.$refs.canvas
      var ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      var data = `
      <svg xmlns='http://www.w3.org/2000/svg' width='460' height='230'>
        <foreignObject width='100%' height='100%'>
          <div xmlns='http://www.w3.org/1999/xhtml'>
            ${this.$refs.table.outerHTML}
          </div>
        </foreignObject>
      </svg>`

      var DOMURL = self.URL || self.webkitURL || self
      var img = new Image()
      var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
      var url = DOMURL.createObjectURL(svg)
      img.onload = function() {
        ctx.drawImage(img, 0, 0)
        DOMURL.revokeObjectURL(url)
      }
      img.src = url
    },
    ...mapMutations(['update'])
  },
  watch: {
    currentItem: function(val) {
      if (val) {
        this.score = this.nodes.laps[val[1]][val[0]].score
        this.time = this.nodes.laps[val[1]][val[0]].time
        this.videoLink = this.nodes.laps[val[1]][val[0]].videoLink
      }
    },
    nodes: function(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>
td.lap-cell {
  position: relative;
  min-width: 65px;
  width: 65px;
  height: 60px;
  color: black;
}

td.lap-cell:hover {
  background: rgba(42, 63, 84, 0.25);
}

th.info-cell:hover {
  background: rgba(42, 63, 84, 0.25);
}

td .opponent-number {
  position: absolute;
  left: 2px;
  top: 10px;
  font-size: 30px;
}

td .free-cell {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #8080809e;
}

td .time {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 10px;
}

td .score {
  position: absolute;
  right: 5px;
  bottom: 5px;
  font-size: 10px;
}

th.current-lap,
td.current-lap {
  background: rgba(38, 185, 154, 0.5);
  color: black;
}

th.next-lap,
td.next-lap {
  background: rgba(217, 83, 79, 0.5);
  color: black;
}

th.header-error {
  color: red;
  border: 1px solid red;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 90%;
  max-width: 480px;
  margin: 0px auto;
  padding: 20px 20px 0px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.row-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.row-title {
  font-weight: bold;
  width: 70px;
  text-align: left;
  margin: 10px;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.form {
  display: inline-block;
  width: 100%;
}

.form-error {
  color: red;
  text-align: left;
  font-size: 12px;
  display: block;
  margin-top: 3px;
  display: none;
}

.form input {
  border-radius: 2px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  max-width: 300px;
}

.form button {
  width: 100%;
  padding: 10px;
  border-radius: 2px;
  border: 0;
  background-color: #ccc;
  color: #fff;
}

input:valid:not(:placeholder-shown) {
  border-color: green;
}

input:invalid:not(:placeholder-shown) {
  border-color: red;
}
input:invalid:not(:placeholder-shown) + .form-error {
  display: block;
}
</style>

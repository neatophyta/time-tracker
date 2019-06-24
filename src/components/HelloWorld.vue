<template>
  <div class="wrapper">
    <div class="list-wrapper">
      <div class="type square" 
            v-for="type in types"
            v-on:click="trackType(type)"
            v-bind:style="{ 'background-color': type.color }">
            {{type.name}}
            <div v-bind:id="'time-'+type.name" v-if="currentlyTracking === type.name" class="time">{{ currentTime }}</div>
      </div>
      <div class="add-button square" v-bind:class="{ adding: adding }">
        <span v-if="adding" class="adding">
            <input type="text" id="add-name" v-model="name">
            <div class="color"
                  v-for="color in colors" 
                  v-bind:class="{ selected: color === selectedColor }" 
                  v-bind:style="{ 'background-color': color }" 
                  v-on:click="selectColor(color)">
            </div>
            <div class="save-button" v-on:click="handleAddType">Save</div>
        </span>
        <span v-else v-on:click="addType">+</span>
      </div>
    </div>
    <div class="charts">
      <div class="chart">
        <canvas id="myChart" width="200" height="200"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data: function () {
      return {
        types: [],
        adding: false,
        name: 'New tracker',
        colors: ['#3498DB', '#48C9B0', '#9B59B6', '#E74C3C', '#2ECC71', '#F4D03F', '#F39C12', '#5D6D7E'],
        selectedColor: '#3498DB',
        currentlyTracking: null,
        currentTime: null,
        trackingInterval: null,
        timeData: null,
        today: this.$moment().format('L')
      }
  },
  methods: {
    addType: function () {
        this.adding = true;
    },
    selectColor: function (color) {
        this.selectedColor = color;
    },
    handleAddType: function () {
        let newType = {
          name: this.name,
          color: this.selectedColor,
          start: null
        }

        this.types = [...this.types, newType];
        localStorage.setItem('timeTypes', JSON.stringify(this.types));

        //reset defaults
        this.name = 'New tracker';
        this.selectedColor = '#3498DB';
        this.adding = false;
    },
    trackType: function(type) {
        if(this.currentlyTracking === null) {
          this.startTime(type);
        }else if(this.currentlyTracking !== type.name) {
          //find last tracked and stop it
          let lastTracked = this.types.find(type => {
            return type.name === this.currentlyTracking;
          });
          this.storeTime(lastTracked);

          //start new tracker
          this.startTime(type);
        } else {
          this.storeTime(type);
        }        
    },
    displayTimer: function(start) {
      let startT = this.$moment(start);
      let now = this.$moment();

      let duration = this.$moment.duration(now.diff(startT));

      let h = duration.hours();
      let m = duration.minutes();
      let s = duration.seconds();

      // let h = Math.floor(duration.as('hours'));
      // let m = Math.floor(duration.as('minutes'));
      // let s = Math.floor(duration.as('seconds'));

      this.currentTime = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    },
    startTime: function(type) {
      //start tracking time
      this.currentlyTracking = type.name;
      type.start = this.$moment().valueOf();

      //update display time
      this.trackingInterval = window.setInterval(function() {this.displayTimer(type.start)}.bind(this), 1000);
    },
    storeTime: function(type) {
      this.currentlyTracking = null;
      let times = {
        type: type.name,
        start: type.start,
        end: this.$moment().valueOf()
      }

      //store times in timedata
      this.timeData[this.today] = [...this.timeData[this.today], times];
      localStorage.setItem('timeData', JSON.stringify(this.timeData));

      //clear start
      type.start = null;
      this.currentTime = null;
      clearInterval(this.trackingInterval);
      this.updateReport();
    },
    updateReport: function() {
      //get data for today by type
      let data = this.timeData[this.today];
      let processed = {};
      let labelArr = [];
      let colorArr = [];
      let timeArr = [];


      data.forEach(set => {
        if(typeof processed[set.type] === 'undefined') {
          processed[set.type] = 0;
        }

        let start = this.$moment(set.start);
        let end = this.$moment(set.end);
        let duration = this.$moment.duration(end.diff(start));
        processed[set.type] += duration;
      })

      this.types.forEach(type => {
        labelArr.push(type.color);
        colorArr.push(type.color);
        timeArr.push(processed[type.name]);
      });

      let chartData = {
        labels: labelArr,
        colors: colorArr,
        dataset: timeArr
      };

      this.showChart(chartData);
    },
    showChart: function(chartData) {
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                backgroundColor: chartData.colors,
                data: chartData.dataset
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Today'
            },
            legend: {
              display: false
            }
          }
      });
    }
  },
  mounted() {
    //get types list
    if (localStorage.getItem('timeTypes')) this.types = JSON.parse(localStorage.getItem('timeTypes'));

    //get timeData
    if (localStorage.getItem('timeData')) this.timeData = JSON.parse(localStorage.getItem('timeData'));

    if(!this.timeData) {
      this.timeData = {}
      localStorage.setItem('timeData', JSON.stringify(this.timeData));
    }

    if(typeof this.timeData[this.today] === 'undefined') {
      this.timeData[this.today] = [];
      localStorage.setItem('timeData', JSON.stringify(this.timeData));
    }

    //show initial chart
    this.updateReport();
  }
}
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .wrapper {
    width: 100%;
    height: 100%;
  }

  .list-wrapper {
    width: 100%;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
  }

  .square {
    width: 150px;
    height: 150px;
    border-radius: 3px;
    box-shadow: 3px 3px 5px 0px rgba(144,148,151,1);
    cursor: pointer;
    line-height: 150px;
    display: inline-block;
    margin: 7px;
  }

  .type.square {
    color: #ffffff;
    font-weight: bold;
        line-height: 50px;
  }
  
  .add-button {
    font-size: 40px;
    background-color: #D7DBDD;
  }

  .adding {
    font-size: 12px;
    line-height: inherit;
    background-color: #F2F3F4;
    padding: 10px 0;
    box-sizing: border-box;
    cursor: inherit;
  }

  .adding input {
    margin-bottom: 5px;
  }

  .color {
    width: 25px;
    height: 25px;
    display: inline-block;
    margin: 5px;
    cursor: pointer;
    border-radius: 3px;
  }

  .color.selected {
    border: 2px solid #283747;
  }

  .save-button {
      text-decoration: none;
      color: #b4b4b4;
      padding: 4px;
      border: 2px solid #b4b4b4;
      background-color: #fff;
      text-transform: uppercase;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;
  }

  .charts {
    padding: 30px;
  }

  .chart {
    height: 200px;
    width: 200px;
  }

</style>

import Vue from 'vue'
import App from './App.vue'
import Moment from 'vue-moment'

import VueCharts from 'vue-chartjs'
import { Donut } from 'vue-chartjs'

Vue.use(Moment);
Vue.use(VueCharts);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

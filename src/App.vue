<template>
  <div id="app">
    <div class="header">
      <span class="header-time">Time</span>Tracker
    </div>
    <div class="content">
        <HelloWorld msg="test"/>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>

 html, body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
  }

  #app {
      background-color: #f7f7f7;
      color: #616A6B;
      font-family: 'Roboto', sans-serif;
      height: 100%; 
      margin: 0;
      text-align: center;
  }

  .header {
      background-color: #eeeeee;
      font-size: 2.5em;
      height: 125px;
      padding: 30px 30px 30px 50px;
      position: relative;
      font-family: 'Righteous', cursive;
      text-align: left;
  }

  .header .header-time {
    color: #3498DB;
  }

  .link-button {
      text-decoration: none;
      color: #b4b4b4;
      padding: 10px;
      border: 2px solid #b4b4b4;
      background-color: #fff;
      text-transform: uppercase;
      border-radius: 3px;
      display: inline-block;
  }

  .link-button.blue {
      color: #26C6DA;
      border-color: #26C6DA;
  }

  .content {
      align-items: center;
      background-color: #ffffff;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      position: relative;
      top: -5em;
      width: 90%;  
  }

  .hide {
      display: none;
  }
</style>

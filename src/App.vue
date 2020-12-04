<template>
  <div class="content-wrapper">
    <h1 class="app-header">
      Who Wants to Be a Bitcoinaire?
    </h1>

    <router-view/>
  </div>
</template>

<style lang="scss">
html {
  height: 100%;
}

body {
  margin: 0;
  min-height: 100%;

  background-color: #eee;
}

button {
  padding: 0.4rem 1.2rem;
  background: #eee;
  border: 1px solid #bbb;
  border-radius: 4px;

  &:active {
    background: #bbb;
  }
}

#app {
  padding-top: 5rem;
  padding-bottom: 5rem;
  color: #2c3e50;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.content-wrapper {
  box-sizing: border-box;
  width: 80%;
  max-width: 40rem;
  margin: auto;
  padding: 2rem;

  border: 1px solid #bbb;
  border-radius: 4px;

  background-color: #fff;
  box-shadow: 0px 0px 25px 2px rgba(0,0,0,0.41);
}

.app-header {
  margin-top: 0;
  margin-bottom: 2rem;
}
</style>

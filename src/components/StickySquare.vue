<template>
  <div class="sticky-square"></div>
</template>

<style scoped>
.sticky-square {
  width: 100px;
  height: 100px;
  background-color: red;
  position: sticky;
  top: 1em;
  float: right;
  margin-right: -150px;
  /* Ensure the square stays above content */
  z-index: 10;
}
</style> 
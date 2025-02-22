<template>
  <div class="sticky-square"></div>
</template>

<style scoped>
.sticky-square {
  width: 200px;
  height: 200px;
  background-color: red;
  position: sticky;
  top: 1em;
  float: right;
  margin-right: -250px;
  /* Ensure the square stays above content */
  z-index: 10;
}
</style> 
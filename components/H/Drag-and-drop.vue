<script setup>
const event = reactive({ drag: false, hover: false });
const props = defineProps({
  disabled: Boolean,
});

const dragover = (e) => {
  if (!props.disabled) {
    e.preventDefault();
    event.drag = true;
  }
};
const dragleave = (e) => {
  if (!props.disabled) {
    e.preventDefault();
    event.drag = false;
  }
};
const mouseover = (e) => {
  if (!props.disabled) {
    e.preventDefault();
    event.hover = true;
  }
};
const mouseleave = (e) => {
  if (!props.disabled) {
    e.preventDefault();
    event.hover = false;
  }
};
const drop = (e) => {
  event.drag = false;
};
</script>
<template>
  <div
    class="d-flex row"
    @dragover="dragover"
    @dragleave="dragleave"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
    @drop="drop"
  >
    <slot v-bind="event"></slot>
  </div>
</template>
a

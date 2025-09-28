<script setup>
const items = ref([]);
const addMore = () => {
  items.value.push({ name: "", url: "" });
};

const remove = (index) => {
  items.value.splice(index, 1);
};
</script>

<template>
  <div>
    <div class="w-full flex flex-col gap-y-5">
      <div v-for="(item, index) in items" :key="index">
        <div class="flex justify-start items-center flex-wrap mt-4 gap-x-5">
          <div class="flex-1">
            <HTextfield
              :name="`Button ${index}`"
              v-model="items[index].name"
              class="focus:border-primary"
              placeholder="Name"
              rules="required"
            >
              <template #label>
                <h1 class="mb-2">Button Name</h1>
              </template>
            </HTextfield>
          </div>

          <div class="flex-1">
            <HTextfield
              :name="`Url ${index}`"
              v-model="items[index].url"
              class="focus:border-primary"
              placeholder="Url"
              rules="required"
            >
              <template #label>
                <h1 class="mb-2">Button Url</h1>
              </template>
            </HTextfield>
          </div>

          <Icon
            name="gg:trash"
            class="text-5xl text-red-600 hover:bg-red-300/20 hover:rounded-full p-2 active:bg-red-400/10 cursor-pointer"
            @click="remove(index)"
            v-if="items.length > 0"
          />
        </div>
      </div>
      <button
        class="flex justify-start self-start px-5 py-2 items-center gap-x-1 rounded-lg ring-primary ring-1 hover:bg-primaryLite"
        @click="addMore()"
      >
        <Icon name="majesticons:plus-line" class="text-2xl text-primary" />
        <span class="">Add Button</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['width', 'placeholder']);
const emit = defineEmits(['searchEntered'])

const searchInput = ref('');
const searchHandler = () => {
    emit('searchEntered', searchInput.value.trim())
    searchInput.value = ''
};

</script>

<template>
    <div :class="width">
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchInput" @keyup.enter.prevent="searchHandler" class="block w-full p-2 pl-10 text-xs font-semibold placeholder:font-medium placeholder:text-[11px] text-gray-900 border-[1.75px] border-[#d3d6d7] rounded-3xl dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" :placeholder="placeholder">
        </div>
    </div>
</template>

<style scoped>
    textarea:focus, input:focus{
        outline: none;
    }
</style>
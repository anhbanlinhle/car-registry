<script setup>
defineProps(['placeholder', 'type', 'modelValue']);
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="flex items-end py-1 space-x-3 border-b border-[#1d1d1d] border-opacity-30 border-solid">
        <slot></slot>
        <input 
            :placeholder="placeholder" 
            :type="type"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="placeholder:text-xs focus:bg-transparent bg-transparent font-semibold text-[#1d1d1d] w-full"
        />
    </div>
</template>

<style scoped>
    textarea:focus, input:focus{
        outline: none;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        transition: background-color 5000s ease-in-out 0s;
        -webkit-text-fill-color: #1d1d1d !important;
    }
</style>
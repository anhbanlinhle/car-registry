<script setup>
const props = defineProps(['description', 'detail']);
</script>

<template>
    <div class="flex w-4/5 max-md:w-full">
        <div class="w-1/5 flex items-center justify-center mb-[2px]">
            <slot name="i">

            </slot>
        </div>
        <div class="w-4/5 flex flex-col justify-center items-start">
            <div class="text-[9px] font-bold"> {{ description }} </div>
            <div class="text-[13px] font-medium"> {{ detail }} </div>
        </div>
    </div>
</template>
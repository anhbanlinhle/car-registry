<script setup>
const props = defineProps(['isRootRow', 'type', 'licensePlate', 'name', 'center', 'registDate', 'expiredDate', 'duration']);

</script>

<template>
    <div class="min-w-[800px] flex rounded-sm p-2 slide-fade" :class="isRootRow ? 'rounded-t-lg bg-[#2acc97]/10' : 'bg-white'">
        <div :class="isRootRow ? 'text-sm font-semibold' : 'text-xs font-semibold'" class="w-[15%] flex items-center justify-center text-center text-[#1d1d1d]">
            {{ licensePlate }}
        </div>
        <div :class="isRootRow ? 'text-sm font-semibold' : 'text-xs font-semibold'" class="w-1/4 flex items-center justify-start pl-2 text-center text-[#1d1d1d]">
            {{ name }}
        </div>
        <div v-if="isRootRow" class="w-3/5 flex">
            <div class="w-1/3 flex items-center justify-center text-sm font-semibold text-center text-[#1d1d1d]">
                {{ type == 1 ? 'Registry date' : 'Duration' }}
            </div>
            <div class="w-1/3 flex items-center justify-center text-sm font-semibold text-center text-[#1d1d1d]">
                Expired date
            </div>
            <div class="w-1/3 flex items-center justify-end text-sm font-semibold text-right text-[#1d1d1d]">
                Center
            </div>
        </div>
        <div v-else class="w-3/5 flex">
            <div class="w-1/3 flex items-center justify-center text-xs font-semibold text-center text-[#1d1d1d]">
                {{ type == 1 ? registDate : duration }}
            </div>
            <div class="w-1/3 flex items-center justify-center text-xs font-semibold text-center text-[#1d1d1d]">
                {{ expiredDate }}
            </div>
            <div class="w-1/3 flex items-center justify-end text-xs font-semibold text-right text-[#1d1d1d]">
                {{ center }}
            </div>
        </div>
    </div>
</template>

<style scoped>
    .slide-fade {
        animation: slide-fade 0.5s;
    }

    @keyframes slide-fade {
        from {
            opacity: 0;
            transform: translateX(1rem);
        }
        to {
            opacity: 1;
            transform: translateX(0rem);
        }
    }
</style>
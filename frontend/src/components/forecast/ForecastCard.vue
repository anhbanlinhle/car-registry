<script setup>
import { ref } from 'vue';

const isAdmin = ref(localStorage.getItem('userType') == 1)

defineProps({
    isRootRow: Boolean,
    info: Object,
    status: String,
});

const emit = defineEmits(['openInfo', 'regist']);

const openInfo = (license) => {
    emit('openInfo', license)
};

const regist = (license) => {
    emit('regist', license)
};

</script>

<template>
    <div class="w-full rounded-[3px] p-2 flex items-center min-w-[800px] min-h-[50px]" :class="isRootRow ? '' : 'bg-white group relative'">
        <svg v-if="!isRootRow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-[#2acc97] absolute transition-transform duration-200 -translate-x-7 group-hover:translate-x-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <p class="text-center font-medium text-[#1d1d1d] w-1/5" :class="isRootRow ? 'text-[14px]' : 'text-[12px]'">
            {{ isRootRow ? 'License ID' : info.licenseId }}
        </p>
        <p class="text-left font-medium text-[#1d1d1d] w-1/5" :class="isRootRow ? 'text-[14px]' : 'text-[12px]'">
            {{ isRootRow ? 'Car' : `${info.brand} ${info.model} ${info.version}` }}
        </p>
        <p class="text-center font-medium w-1/5" :class="isRootRow ? 'text-[14px]' : 'text-[12px]', status === 'new' ? 'text-red-500' : 'text-[#1d1d1d]'">
            {{ isRootRow ? 'Expired date' : (info.expire === undefined ? 'None' : info.expire) }}
        </p>
        <p class="text-center font-medium text-[#1d1d1d] w-[15%]" :class="isRootRow ? 'text-[14px]' : 'text-[12px]', status === 'new' ? 'text-[#2acc97]' : 'text-[#1d1d1d]'">
            {{ isRootRow ? 'Status' : (info.expire === undefined ? 'New' : 'Re-regist') }}
        </p>
        <div v-if="!isRootRow" class="w-1/4 flex justify-evenly">
            <button class="flex items-center justify-center gap-1 rounded-full text-[11px] bg-[#f5f7fb] px-3 py-1 mt-[2px] cursor-pointer duration-200 hover:bg-[#2acc97] text-[#293241] hover:text-white" @click="openInfo(info.licenseId)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div class="font-semibold">Detail</div>
            </button>
            <button v-if="!isAdmin" class="flex items-center justify-center gap-1 rounded-full text-[11px] bg-[#f5f7fb] px-3 py-1 mt-[2px] cursor-pointer duration-200 hover:bg-[#2acc97] text-[#293241] hover:text-white" @click="regist(info.licenseId)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-registered w-4 h-4" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                    <path d="M10 15v-6h2a2 2 0 1 1 0 4h-2"></path>
                    <path d="M14 15l-2 -2"></path>
                </svg>
                <div class="font-semibold">Regist</div>
            </button>
        </div>
    </div>
</template>
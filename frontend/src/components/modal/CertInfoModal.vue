<script setup>
import CertInfoModalCard from './CertInfoModalCard.vue';
import { useAccountStore } from '../../stores/AccountStore';
import { onMounted, ref } from 'vue';

const accountStore = useAccountStore()

const props = defineProps(['certId']);
const emit = defineEmits(['exitModal'])

//SECTION - data fetch
const loading = ref(false)
const certContent = ref({})
const fetchCertData = async () => {
    loading.value = true
    const res = await fetch(`http://localhost:1111/regist/detail`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${accountStore.getToken}`
        },
        body: JSON.stringify({id: props.certId}),
    })
    if(res.error) {
        console.log(res.error);
    }
    const dataFetched = JSON.parse(await res.text())
    certContent.value = {...dataFetched.data}
    loading.value = false
}

//SECTION - modal handler
const exitModal = () => {
    emit('exitModal')
};

onMounted(() => {
    fetchCertData()
});

</script>

<template>
    <div class="w-full h-screen fixed z-50 flex items-center justify-center top-0">
        <div class="bg-black/40 backdrop-blur-[2px] top-0 left-0 w-full h-screen blur-xl fixed z-50 backdrop-animation" @click="exitModal"></div>
        <div class="fade bg-[#f5f7fb] rounded-[8px] p-4 fixed w-3/5 max-lg:w-4/5 max-md:w-full max-2xl:max-w-3xl 2xl:max-w-4xl z-[60] flex flex-col modal-animation overflow-hidden h-fit">
            <div class="w-full flex justify-end relative max-md:mb-4">
                <svg @click="exitModal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 absolute text-red-500 p-1 rounded-[50%] cursor-pointer duration-150 ease-in-out hover:bg-red-500/10 active:bg-red-500/20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div class="w-full flex items-center mb-2 max-sm:flex-col-reverse">
                <div class="flex flex-col items-center justify-center gap-2 w-1/2 max-md:w-full">
                    <p class="text-center text-white font-semibold text-2xl px-3 py-2 rounded-[8px] bg-[#2acc97]">{{ certContent.licenseId }}</p>
                    <p class="text-center font-semibold text-xs text-[#1d1d1d]">{{ certContent.brand }} {{ certContent.model }} {{ certContent.version }}</p>
                </div>
                <div class="w-1/2 max-md:w-full flex flex-col max-sm:flex-row max-sm:justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-24 h-24 text-[#2acc97]">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p class="text-lg font-semibold text-center max-md:text-left">{{ certContent.ownerName }}</p>
                </div>
            </div>
            <div class="w-full flex flex-col gap-1">
                <CertInfoModalCard title="Cert ID" :content="certContent.id"/>
                <CertInfoModalCard title="Regist date" :content="certContent.date"/>
                <CertInfoModalCard title="Expired date" :content="certContent.expire"/>
                <CertInfoModalCard title="Center" :content="certContent.name"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

.fade {
    animation: fade 0.5s ease-in-out;
}

@keyframes fade {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0px);
    }
}
</style>
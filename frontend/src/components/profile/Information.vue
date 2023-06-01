<script setup>
import { useRoute } from 'vue-router';
import CenterStatisticCard from './CenterStatisticCard.vue';
import InformationDetailedCard from './InformationDetailedCard.vue';
import { onMounted, ref } from 'vue';

const route = useRoute()
const props = defineProps(['center']);

const cardDetail = ref({
    totalRegist: {},
    year: {},
    month: {},
})

const fetchTotalRegistCardData = async () => {
    const res = await fetch('http://localhost:1111/admin/centre/rank', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ centreId: route.params.id })
    })
    if(res.error) {
        console.log(res.error);
    }
    const data = JSON.parse(await res.text())
    cardDetail.value.totalRegist = {...data.data}
};

const fetchProductiveYearData = async () => {
    const res = await fetch('http://localhost:1111/admin/centre/productive-year', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ centreId: route.params.id })
    })
    if(res.error) {
        console.log(res.error);
    }
    const data = JSON.parse(await res.text())
    cardDetail.value.year = {...data.data}
}

const fetchBurstyMonthData = async () => {
    const res = await fetch('http://localhost:1111/admin/centre/bursty-month', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ centreId: route.params.id })
    })
    if(res.error) {
        console.log(res.error);
    }
    const data = JSON.parse(await res.text())
    cardDetail.value.month = {...data.data}
}

onMounted(() => {
    fetchTotalRegistCardData()
    fetchProductiveYearData()
    fetchBurstyMonthData()
});
</script>

<template>
    <div class="w-full flex items-start max-lg:flex-col max-lg:items-center">
        <div class="bg-white w-full h-[550px] max-[1480px]:h-[702px] max-[1180px]:h-[896px] max-lg:h-[550px] duration-200 rounded-md flex flex-col items-center text-[#1d1d1d] px-4 py-6 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-28 h-28 text-[#2acc97] pb-4 border-b-4 border-dashed border-[#2acc97]" viewBox="0 0 384 512">
                <path fill="currentColor" d="M48 0C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h96v-80c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zm16 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-32zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16z"/>
            </svg>
            <div class="flex flex-col items-center justify-center gap-1">
                <h1 class="text-2xl font-semibold mt-2 text-center flex items-center justify-center">{{ center.name }}</h1>
                <h4 class="text-[#2acc97] bg-[#cdfcec]/40 text-xs font-medium rounded-xl p-1 px-4 flex items-center justify-center">Id: {{ center.id }}</h4>
            </div>
            <div class="flex flex-col mt-2 w-4/5 gap-2">
                <InformationDetailedCard description="Name" :detail="center.name"/>
                <InformationDetailedCard description="Activation date" :detail="center.activation"/>
                <InformationDetailedCard description="City" :detail="center.city"/>
                <InformationDetailedCard description="District" :detail="center.district"/>
            </div>
        </div>
        <div class="flex flex-col min-h-[550px] justify-between max-lg:mt-6">
            <div class="lg:pl-6 w-full">
                <div class="flex items-center gap-2 mb-2">
                    <p class="text-[#2acc97] text-3xl font-semibold">Highlight</p>
                    <hr class="w-full border border-solid border-gray-300">
                </div>
                <div class="grid grid-cols-3 gap-6 max-[1480px]:grid-cols-2 max-[1180px]:grid-cols-1">
                    <CenterStatisticCard
                        title="Total regist"
                        :content="cardDetail.totalRegist.count"
                        content-color="text-[#2acc97]"
                    >
                        <template #headerIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7 p-[6px] rounded-[50%] text-[#2acc97] bg-[#2acc97]/20">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </template>
                        <template #detail>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-300">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                            </svg>
                            <p><span class="text-yellow-300">{{ cardDetail.totalRegist.rank }} place</span> in all centers</p>
                        </template>
                    </CenterStatisticCard>
                    <CenterStatisticCard
                        title="Most productive year"
                        :content="cardDetail.year.year"
                        content-color="text-[#93a3e6]"
                    >
                        <template #headerIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 p-[6px] rounded-[50%] text-[#93a3e6] bg-[#93a3e6]/20">
                                <path fill-rule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                                <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                            </svg>
                        </template>
                        <template #detail>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-orange-400">
                                <path fill-rule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clip-rule="evenodd" />
                                <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
                            </svg>
                            <p><span class="text-orange-400">{{ cardDetail.year.cnt }}</span> registries made</p>
                        </template>
                    </CenterStatisticCard>
                    <CenterStatisticCard
                        title="Bursty month"
                        :content="`${cardDetail.month.month} ${cardDetail.month.year}`"
                        content-color="text-red-500"
                    >
                        <template #headerIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 p-[6px] rounded-[50%] text-red-500 bg-red-500/20">
                                <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clip-rule="evenodd" />
                            </svg>
                        </template>
                        <template #detail>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-[#2acc97]">
                                <path fill-rule="evenodd" d="M15.22 6.268a.75.75 0 01.968-.432l5.942 2.28a.75.75 0 01.431.97l-2.28 5.941a.75.75 0 11-1.4-.537l1.63-4.251-1.086.483a11.2 11.2 0 00-5.45 5.174.75.75 0 01-1.199.19L9 12.31l-6.22 6.22a.75.75 0 11-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l3.606 3.605a12.694 12.694 0 015.68-4.973l1.086-.484-4.251-1.631a.75.75 0 01-.432-.97z" clip-rule="evenodd" />
                            </svg>
                            <p><span class="text-[#2acc97]">{{ cardDetail.month.cnt }}</span> registries made</p>
                        </template>
                    </CenterStatisticCard>
                </div>
            </div>
            <div class="lg:pl-6 w-full flex flex-col justify-between gap-2 max-lg:mt-6">
                <div class="flex items-center gap-2">
                    <p class="text-[#2acc97] text-3xl font-semibold">About</p>
                    <hr class="w-full border border-solid border-gray-300">
                </div>
                <div id="table" class="bg-white rounded-md h-[250px] overflow-y-scroll pl-3 pr-1 py-2 shadow-md">
                    <p class="text-justify text-base font-medium text-gray-600">
                        Gray, oily hair neatly coiffured to reveal a strong, frowning face. Heavy amber eyes, set a-symmetrically within their sockets, watch slowly over the tribe they've defended for so long.
                        Dark stubble gorgeously compliments his cheeks and leaves a satisfying memory of his reckless luck.

                        This is the face of Brodie Shepley, a true victor among vampires. He stands gracefully among others, despite his bulky frame.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #table::-webkit-scrollbar {
        width: 6px;
    }
    
    #table::-webkit-scrollbar-track {
        border-radius: 12px;
    }
    
    #table::-webkit-scrollbar-thumb {
        background-color: #2acc97;
        outline: none;
        border-radius: 12px;
    }
    #table::-webkit-scrollbar-thumb:hover {
        background-color: #0ce29b;
    }
</style>
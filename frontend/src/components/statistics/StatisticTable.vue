<script setup>
import StatisticTableCard from './StatisticTableCard.vue';
import SearchBar from '../UI/SearchBar.vue';
import { useAccountStore } from '../../stores/AccountStore';
import { useAdminSelectionStore } from '../../stores/AdminSelectionStore';
import { ref, watch } from 'vue';

const emit = defineEmits(['selectedTimeClicked', 'openCertInfoModal'])
const props = defineProps(['time'])

const adminSelectionStore = useAdminSelectionStore()
const isAdmin = localStorage.getItem('userType') == 1

//SECTION - modal handler
const openModal = (license) => {
    emit('openCertInfoModal', license)
}

//SECTION - page number handler
const totalPage = ref();
const pageNumber = ref(1);
const pageHandler = (direction) => {
    if(direction === 'left') {
        if (pageNumber.value > 1) {
            pageNumber.value -= +1;
        }
    } else {
        if (pageNumber.value < totalPage.value) {
            pageNumber.value += +1;
        }
    }
};

const pageEnteredHandler = (number) => {
    if(1 <= number && number <= 100) {
        pageNumber.value = +number;
    }
};

//SECTION - time handler
const yearList = ['All', '2021', '2022', '2023']
const quarterList = [
    {content: 'All', value: 'All'},
    {content: 'Q1', value: '1'},
    {content: 'Q2', value: '2'},
    {content: 'Q3', value: '3'},
    {content: 'Q4', value: '4'},
]
const monthList = [
    {content: 'All', value: 'All'}, 
    {content: 'January', value: '1'},
    {content: 'Febuary', value: '2'}, 
    {content: 'March', value: '3'}, 
    {content: 'April', value: '4'}, 
    {content: 'May', value: '5'}, 
    {content: 'June', value: '6'}, 
    {content: 'July', value: '7'}, 
    {content: 'August', value: '8'}, 
    {content: 'September', value: '9'}, 
    {content: 'October', value: '10'}, 
    {content: 'November', value: '11'}, 
    {content: 'December', value: '12'}, 
];

// logic - time ref and watcher

const timeClicked = (value, type) => {
    if(type === 'year') {
        props.time.month = 'All'
        props.time.quarter = 'All'
        props.time.year = value;
        document.documentElement.scrollTop = screen.height/5
    } else if (type === 'quarter') {
        props.time.month = 'All'
        props.time.quarter = value
    } else {
        props.time.quarter = 'All'
        props.time.month = value
    }
    pageNumber.value = 1
    emit('selectedTimeClicked', {year: props.time.year, quarter: props.time.quarter, month: props.time.month})
};

const isSpecificLicense = ref(false)
let searchedLicense = ref('')

const loading = ref(false)
const registCardList = ref([])
const fetchData = async () => {
    loading.value = true
    let fetchRoute
    let fetchBody
    if(isAdmin) {
        fetchRoute = `http://localhost:1111/stats/all`
        if(adminSelectionStore.getSelected === 'all') {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
            }
        } else if(adminSelectionStore.getSelected === 'region') {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                filter: 'region',
                name: adminSelectionStore.getOptionSelected,
            }
        } else {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                filter: 'centre',
                name: adminSelectionStore.getOptionSelected,
            }
        } 
    } else {
        fetchRoute = `http://localhost:1111/regist/all`
        fetchBody = { resPerPage: 7, page: pageNumber.value }
    }

    const res = await fetch(fetchRoute, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(fetchBody),
    })
    if(res.error) {
        console.log(res.error);
    }
    const dataFetched = JSON.parse(await res.text())
    totalPage.value = dataFetched.countPage
    registCardList.value = dataFetched.data
    loading.value = false
};
// fetchData()
//FIXME - admin failed
const fetchDataWithSpecificTime = async () => {
    loading.value = true
    let fetchRoute
    let fetchBody
    if(isAdmin) {
        fetchRoute = `http://localhost:1111/stats/time`
        if(adminSelectionStore.getSelected === 'all') {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                year: props.time.year,
                quarter: props.time.quarter,
                month: props.time.month,
                order: 'asc',
            }
        } else if (adminSelectionStore.getSelected === 'region') {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                filter: 'region',
                name: adminSelectionStore.getOptionSelected,
                year: props.time.year,
                quarter: props.time.quarter,
                month: props.time.month,
                order: 'asc',
            }
        } else {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                filter: 'centre',
                name: adminSelectionStore.getOptionSelected,
                year: props.time.year,
                quarter: props.time.quarter,
                month: props.time.month,
                order: 'asc',
            }
        }
    } else {
        fetchRoute = `http://localhost:1111/regist/time`
        fetchBody = {
            resPerPage: 7,
            page: pageNumber.value,
            year: props.time.year,
            quarter: props.time.quarter,
            month: props.time.month
        }
    }
    const res = await fetch(fetchRoute, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(fetchBody),
    })
    if(res.error) {
        console.log(res.error);
    }
    const dataFetched = JSON.parse(await res.text())
    totalPage.value = dataFetched.countPage
    registCardList.value = dataFetched.data
    loading.value = false
}

const fetchDataWithSpecificLicense = async (license) => {
    loading.value = true
    if(searchedLicense.value !== license && license !== undefined) {
        searchedLicense.value = license
    }
    if(isSpecificLicense.value === false) {
        isSpecificLicense.value = true
        pageNumber.value = 1
    }
    let fetchRoute
    let fetchBody
    if(isAdmin) {
        fetchRoute = `http://localhost:1111/stats/find`
        if(adminSelectionStore.getSelected === 'all') {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                licenseId: searchedLicense.value
            }
        } else if(adminSelectionStore.getSelected === 'region') {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                filter: 'region',
                name: adminSelectionStore.getOptionSelected,
                licenseId: searchedLicense.value
            }
        } else {
            fetchBody = {
                resPerPage: 7,
                page: pageNumber.value,
                filter: 'centre',
                name: adminSelectionStore.getOptionSelected,
                licenseId: searchedLicense.value
            }
        }
    } else {
        fetchRoute = `http://localhost:1111/regist/find`
        fetchBody = {
            resPerPage: 7,
            page: pageNumber.value,
            licenseId: searchedLicense.value,
        }
    }
    const res = await fetch(fetchRoute, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(fetchBody),
    })
    if(res.error) {
        console.log(res.error);
    }
    const dataFetched = JSON.parse(await res.text())
    totalPage.value = dataFetched.countPage
    registCardList.value = [...dataFetched.data]
    loading.value = false
}

const handleRemoveLicenseSearch = () => {
    isSpecificLicense.value = false
    searchedLicense.value = ''
    if(pageNumber.value === 1) {
        if(props.time.year === 'All') {
            fetchData()
        } else {
            fetchDataWithSpecificTime()
        }
    } else {
        pageNumber.value = 1
    }
}

//SECTION - watcher
watch([pageNumber], () => {
    if(isSpecificLicense.value) {
        fetchDataWithSpecificLicense()
    } else {
        if(props.time.year === 'All') {
            fetchData()
        } else {
            fetchDataWithSpecificTime()
        }
    }
    
}, { immediate: true });

watch(() => props.time, async () => {
    fetchDataWithSpecificTime()
});

watch(() => adminSelectionStore.getOptionSelected, () => {
    isSpecificLicense.value = false
    searchedLicense.value = ''
    if(pageNumber.value === 1) {
        if(props.time.year === 'All') {
            fetchData()
        } else {
            fetchDataWithSpecificTime()
        }
    } else {
        pageNumber.value = 1
    }
});

watch(() => adminSelectionStore.getSelected, () => {
    isSpecificLicense.value = false
    searchedLicense.value = ''
    if(pageNumber.value === 1) {
        if(props.time.year === 'All') {
            fetchData()
        } else {
            fetchDataWithSpecificTime()
        }
    } else {
        pageNumber.value = 1
    }
});

const scrollToChart = () => {
    document.documentElement.scrollTop = screen.height
};

</script>

<template>
    <div class="w-4/5 flex flex-col shadow-md rounded-t-lg rounded-b-[4px] overflow-hidden">
        <div class="w-full flex flex-col bg-white p-4 gap-3">
            <div class="w-full flex items-center justify-between">
                <div class="w-3/4 flex items-center gap-2">
                    <SearchBar @search-entered="fetchDataWithSpecificLicense" width="w-3/4 min-[732px]:w-3/5" placeholder="Enter a license ID..."/>
                    <div 
                        v-if="searchedLicense !== '' && searchedLicense !== null && searchedLicense !== undefined"
                        class="text-white text-sm font-medium rounded-3xl bg-red-300 py-1 px-2 flex items-center space-x-1"
                    >
                        <p class="">{{ searchedLicense }}</p>
                        <svg @click="handleRemoveLicenseSearch" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 cursor-pointer text-red-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <button v-if="time.year !== 'All'" @click="scrollToChart" class="text-[12px] text-white flex items-center gap-1 font-semibold bg-[#2acc97]/90 active:bg-[#2acc97] p-2 rounded-md">
                        <p class="max-md:hidden">View chart</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center gap-2 w-fit">
                    <svg @click="pageHandler('left')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-[#1d1d1d] cursor-pointer duration-200 hover:text-[#2acc97]">
                        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z" clip-rule="evenodd" />
                    </svg>
                    <div class="flex items-center">
                        <input type="number" min="1" :max="100" @keyup.enter="pageEnteredHandler($event.target.value)" :value="pageNumber" class="w-[30px] border border-solid border-[#1d1d1d]/50 text-[14px] text-[#1d1d1d] font-semibold text-opacity-80"/>
                        <div class="text-[14px] text-[#1d1d1d] font-semibold text-opacity-80">/{{ totalPage }}</div>
                    </div>
                    <svg @click="pageHandler('right')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-[#1d1d1d] cursor-pointer duration-200 hover:text-[#2acc97]">
                        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="flex flex-col min-[732px]:flex-row items-center gap-2 w-full">
                <select v-model="time.year" @change="timeClicked(time.year, 'year')" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-[#2acc97] focus:border-[#2acc97] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option v-for="singleYear in yearList" :key="singleYear" :value="singleYear">
                        {{ singleYear }}
                    </option>
                </select>
                <select :disabled="time.year === 'All'" @change="timeClicked(time.quarter, 'quarter')" v-model="time.quarter" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-[#2acc97] focus:border-[#2acc97] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-60">
                    <option v-for="singleQ in quarterList" :key="singleQ.value" :value="singleQ.value">
                        {{ singleQ.content }}
                    </option>
                </select>
                <select :disabled="time.year === 'All'" @change="timeClicked(time.month, 'month')" v-model="time.month" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-[#2acc97] focus:border-[#2acc97] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-60">
                    <option v-for="singleMonth in monthList" :key="singleMonth.value" :value="singleMonth.value">
                        {{ singleMonth.content }}
                    </option>
                </select>
            </div>
        </div>
        <div id="table" class="w-full flex flex-col bg-[#f5f7fb] overflow-x-scroll">
            <StatisticTableCard :is-root-row="true"/>
            <TransitionGroup name="list" tag="div">
                <div v-if="registCardList.length !== 0" v-for="(card, index) in registCardList" :key="index">
                    <StatisticTableCard :car="card" @open-info="openModal"/>
                </div>
                <div v-else class="p-2 flex w-full mt-[2px] bg-white min-h-[50px]">
                    <p class="pt-1 text-center w-full text-base font-semibold text-red-500">No result found!</p>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<style scoped>

    textarea:focus, input:focus{
        outline: none;
    }

    .list-move, /* apply transition to moving elements */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }

    .list-enter-from,
    .list-leave-to {
    opacity: 0;
        transform: translateX(10px);
    }

    .list-leave-active {
        position: absolute;
    }

    #table::-webkit-scrollbar {
        height: 6px;
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
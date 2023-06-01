<script setup>
import Pagination from '../components/forecast/Pagination.vue';
import ForecastCard from '../components/forecast/ForecastCard.vue';
import CarInfoModal from '../components/modal/CarInfoModal.vue';
import RegistrationFormModal from '../components/modal/RegistrationFormModal.vue';
import { useAdminSelectionStore } from '../stores/AdminSelectionStore';
import NoSpecificSelect from '../components/UI/NoSpecificSelect.vue';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useAccountStore } from '../stores/AccountStore';

const accountStore = useAccountStore()
const isAdmin = localStorage.getItem('userType') == 1
const adminSelectionStore = useAdminSelectionStore()

//SECTION - response per page
const resPerPage = ref(7);
const setResPerPage = (value) => {
    pageNumber.value = 1
    resPerPage.value = value
}

const minHeight = ref('min-h-[400px]')

//SECTION - modal
const registModalOn = ref(false)
const infoModalOn = ref(false)
const modalLicense = ref()

//FIXME - regist modal bug
const handleRegistModal = (license) => {
    modalLicense.value = license
    registModalOn.value = !registModalOn.value
}

const handleInfoModal = (license) => {
    modalLicense.value = license
    infoModalOn.value = !infoModalOn.value
}

//SECTION - pagination
const pageNumber = ref(1);
const totalPage = ref(2);

const navigateToSpecificPage = (page) => {
    pageNumber.value = page
}

const navigatePageWithDirection = (direction) => {
    if(direction === 'left') {
        if(pageNumber.value > 1) {
            pageNumber.value -= 1;
        }
    } else {
        if(pageNumber.value < totalPage.value) {
            pageNumber.value += 1;
        }
    }
}

const status = ref('new')
const changeStatus = (value) => {
    pageNumber.value = 1
    status.value = value
}

//SECTION - data fetcher
const forecastList = ref([]);
const totalRes = ref(0);
const fetchForecastList = async () => {
    let fetchRoute;
    let fetchBody;
    if(isAdmin) {
        if(adminSelectionStore.getSelected === 'all') {
            fetchRoute = `http://localhost:1111/forecast/admin/all`
            fetchBody = {
                resPerPage: resPerPage.value,
                page: pageNumber.value,
                type: status.value
            }
        } else if(adminSelectionStore.getSelected === 'region') {
            fetchRoute = `http://localhost:1111/forecast/admin/area`
            fetchBody = {
                resPerPage: resPerPage.value,
                page: pageNumber.value,
                area: adminSelectionStore.getOptionSelected,
                type: status.value
            }
        } else {
            fetchRoute = `http://localhost:1111/forecast/admin/centre`
            fetchBody = {
                resPerPage: resPerPage.value,
                page: pageNumber.value,
                centre: adminSelectionStore.getOptionSelected,
                type: status.value
            }
        } 
    } else {
        fetchRoute = `http://localhost:1111/forecast`
        fetchBody = {
            resPerPage: resPerPage.value,
            page: pageNumber.value
        }
    }
    const res = await fetch(fetchRoute, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(fetchBody)
    })
    if(res.error) {
        console.log(res.error);
    }
    const dataFetched = JSON.parse(await res.text())
    forecastList.value = dataFetched.data
    totalPage.value = dataFetched.countPage
    totalRes.value = dataFetched.countData
};

onMounted(() => {
    fetchForecastList()
});

watch([status, pageNumber, resPerPage], () => {
    if(resPerPage.value === 5) {
        minHeight.value = 'min-h-[300px]'
    }
    if(resPerPage.value === 7) {
        minHeight.value = 'min-h-[400px]'
    }
    if(resPerPage.value === 10) {
        minHeight.value = 'min-h-[550px]'
    }
    if(resPerPage.value === 12) {
        minHeight.value = 'min-h-[650px]'
    }
    fetchForecastList()
})

watch(() => adminSelectionStore.getOptionSelected, () => {
    fetchForecastList()
});

watch(() => adminSelectionStore.getSelected, () => {
    fetchForecastList()
});

</script>

<template>
    <div>
        <Transition name="fade" mode="out-in">
            <div v-if="!adminSelectionStore.getVerified" class="w-full flex items-center">
                <NoSpecificSelect />
            </div>
            <div v-else class="w-full">
                <div v-if="registModalOn">
                    <RegistrationFormModal :license="modalLicense" @exit-modal="handleRegistModal"/>
                </div>
                <div v-if="infoModalOn">
                    <CarInfoModal :license-id="modalLicense" @exit-modal="handleInfoModal"/>
                </div>
                <div class="my-6 w-full">
                    <div class="flex justify-center w-full">
                        <div class="flex items-center flex-col w-[90vw]">
                            <div class="flex justify-between items-center w-full">
                                <div class="text-[14px] font-semibold flex items-center gap-2">
                                    <p>Total:</p>
                                    <p class="text-[#2acc97]">{{ totalRes }}</p>
                                </div>
                                <div class="flex items-center sm:space-x-6 max-sm:flex-col-reverse max-sm:gap-y-3 max-sm:items-end">
                                    <div v-if="isAdmin" class="flex items-center shadow-sm rounded-md overflow-hidden bg-white">
                                        <div @click="changeStatus('renew')" class="flex items-center p-3 cursor-pointer duration-300 ease-in-out transition-all relative overflow-hidden" :class="status === 'renew' ? 'bg-red-500 text-white w-28' : 'text-red-500 w-12'">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                            <span :class="status === 'renew' ? '' : ''" class="font-semibold ml-9 text-sm absolute">Expired</span>
                                        </div>
                                        <div @click="changeStatus('new')" class="flex justify-end items-center p-3 cursor-pointer duration-300 ease-in-out relative overflow-hidden" :class="status === 'new' ? 'bg-[#93a3e6] text-white w-24' : 'text-[#93a3e6] w-12'">
                                            <p :class="status === 'new' ? '' : ''" class="font-semibold text-sm mr-9 absolute">New</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="text-[13px] font-semibold">Results per page</div>
                                        <select @change="(event) => setResPerPage(event.target.value)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-[#2acc97] block w-full p-2.5">
                                            <option value="5">5</option>
                                            <option value="7" selected>7</option>
                                            <option value="10">10</option>
                                            <option value="12">12</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div id="table" class="w-full overflow-x-scroll flex flex-col gap-[2px] mb-4" :class="minHeight">
                                <ForecastCard :is-root-row="true"/>
                                <div v-for="card in forecastList" :key="card">
                                    <ForecastCard 
                                        :info="card"
                                        :status="status"
                                        @open-info="handleInfoModal"
                                        @regist="handleRegistModal"
                                    />
                                </div>
                                <div v-if="forecastList.length === 0" class="bg-white min-w-[800px] h-7 py-7 text-center flex items-center justify-center text-red-500 font-semibold text-lg rounded-md">
                                    No expired car yet!
                                </div>
                            </div>
                            <Pagination 
                                :total-page="totalPage" 
                                :current-page="pageNumber"
                                @pageClicked="navigateToSpecificPage"
                                @navigatePage="navigatePageWithDirection"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
    .custom-shadow {
        box-shadow: -5px 6px 8px #ebecf0;
    }

    input[type=radio] {
        accent-color: #2acc97;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.3s ease;
    }
    
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
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
<script setup>
import CarInfoModal from '../components/modal/CarInfoModal.vue';
import RegistrationFormModal from '../components/modal/RegistrationFormModal.vue';
import CarList from '../components/cars/CarList.vue';
import SearchField from '../components/cars/SearchField.vue';
import NoSpecificSelect from '../components/UI/NoSpecificSelect.vue';
import { useAdminSelectionStore } from '../stores/AdminSelectionStore';
import { onMounted, reactive, ref, watch } from 'vue';

const adminSelectionStore = useAdminSelectionStore()
const isAdmin = ref(localStorage.getItem('userType') == 1)

//SECTION - page handler
const pageNumber = ref(1);

const nextPage = () => {
    pageNumber.value += +1
}
const prevPage = () => {
    pageNumber.value += -1
}
const specifiedPage = (number) => {
    pageNumber.value = +number
};

//SECTION - bind total page number
const totalPage = ref()
const bindTotalPage = (total) => {
    totalPage.value = total
}
bindTotalPage()

//SECTION - bind sort order
const order = ref('asc')
const bindOrder = (givenOrder) => {
    if(order.value !== givenOrder) {
        order.value = givenOrder
        pageNumber.value = 1
    }
}

const timeOrder = ref('asc')
const bindTimeOrder = (ord) => {
    timeOrder.value = ord
    pageNumber.value = 1
}

//SECTION - car info modal handler
const carDetailModal = ref(false);
const carInfoLicense = ref('')
const openCarInfo = (license) => {
    carInfoLicense.value = license
    carDetailModal.value = true
};

//SECTION - car regist form modal handler
const registrationModal = ref(false);
const carRegistLicense = ref('')
const openCarRegistration = (license) => {
    carRegistLicense.value = license
    registrationModal.value = true
};

//SECTION - modal turn off
const turnOffModal = () => {
    carDetailModal.value = false
    registrationModal.value = false
};

//SECTION - license search
const licenseSearchContent = ref('');
const licenseSearchEntered = (content) => {
    licenseSearchContent.value = content
};

//SECTION - reload
const reloaded = ref(false)
const reload = () => {
    filter.value = 'No filter'
    pageNumber.value = 1
    city.value = 'All'
    brand.value = 'All'
    owner.value = null
    licenseSearchContent.value = null
    time.value = { year: 'All', quarter: 'All', month: 'All' }
    reloaded.value = !reloaded.value
}

//SECTION - filter handler
const filter = ref('No filter');
const city = ref('All')
const brand = ref('All')
const owner = ref('')
const time = ref({
    year: 'All', quarter: 'All', month: 'All'
})

// logic - general filter handler
const filterSelected = (value) => {
    filter.value = value
    if(filter.value !== 'Owner') {
        pageNumber.value = 1
    }
};

// logic - city filter handler
const citySelected = (value) => {
    city.value = value
    pageNumber.value = 1
}

// logic - owner filter handler
const ownerEntered = (value) => {
    pageNumber.value = 1
    owner.value = value
}

// logic - brand filter handler
const brandSelected = (value) => {
    brand.value = value
    pageNumber.value = 1
}

// logic - time filter handler
const timeSelected = (value) => {
    time.value = value
    pageNumber.value = 1
};

//SECTION - car type handler
const carType = ref('registed');

// logic - bind car type (registed/expired)
const carTypeHandler = (value) => {
    carType.value = value
    filter.value = 'No filter'
    brand.value = 'All'
    city.value = 'All'
    owner.value = ''
    time.value = {
        year: 'All', quarter: 'All', month: 'All'
    }
    pageNumber.value = 1
};

// logic - check whether the car type value matches the button value or not
const carTypeMatched = (value) => {
    if(carType.value === value) {
        return true
    } else {
        return false
    }
};

//SECTION - small selection handler with small screen with
const selectionOpened = ref(false)
const openSelectHandler = () => {
    selectionOpened.value = !selectionOpened.value
};

onMounted(() => {
    document.documentElement.scrollTop = 0
});

watch(() => adminSelectionStore.getOptionSelected, () => {
    pageNumber.value = 1
});

watch(() => adminSelectionStore.getSelected, () => {
    pageNumber.value = 1
});

</script>

<template>
    <div>
        <Transition name="fade" mode="out-in">
            <div v-if="!adminSelectionStore.getVerified" class="w-full flex items-center">
                <NoSpecificSelect />
            </div>
            <div v-else>
                <!-- <div>{{ pageNumber }}</div> -->
                <div v-if="carDetailModal">
                    <CarInfoModal :license-id="carInfoLicense" @exit-modal="turnOffModal"/>
                </div>
                <div v-if="registrationModal">
                    <RegistrationFormModal :license="carRegistLicense" @exit-modal="turnOffModal"/>
                </div>

                <!-- main -->
                <div class="my-6">
                    <div class="flex items-center flex-col gap-5 justify-center">
                        <!-- default car type filter -->
                        <div class="flex custom-shadow rounded-2xl overflow-hidden bg-white max-[732px]:hidden" :class="isAdmin ? 'w-[90vw]' : 'w-[70vw]'">
                            <div 
                                @click="carTypeHandler('registed')"
                                class="text-base font-medium gap-1 flex items-center justify-center text-center duration-200 cursor-pointer p-2 py-4 max-[997px]:text-sm max-[738px]:text-xs max-[625px]:text-[10px]"
                                :class="carTypeMatched('registed') ? 'bg-[#2acc97] text-white' : 'hover:text-[#2acc97]', isAdmin ? 'w-1/3' : 'w-1/2'"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M280 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v80c0 13.3 10.7 24 24 24s24-10.7 24-24V24zm-94.2 200h140.4c6.8 0 12.8 4.3 15.1 10.6l19 53.4H151.7l19.1-53.4c2.3-6.4 8.3-10.6 15.1-10.6zm-75.3-10.9l-28.3 79.3C62.1 300.9 48 320.8 48 344v136c0 17.7 14.3 32 32 32h16c17.7 0 32-14.3 32-32v-32h256v32c0 17.7 14.3 32 32 32h16c17.7 0 32-14.3 32-32V344c0-23.2-14.1-43.1-34.2-51.6l-28.3-79.3C390.1 181.3 360 160 326.2 160H185.8c-33.8 0-64 21.3-75.3 53.1zM128 344a24 24 0 1 1 0 48a24 24 0 1 1 0-48zm232 24a24 24 0 1 1 48 0a24 24 0 1 1-48 0zM39 39c-9.4 9.4-9.4 24.6 0 33.9l48 48c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L73 39c-9.4-9.4-24.6-9.4-33.9 0zm400 0l-48 48c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l48-48c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0z"/>
                            </svg>
                                <div>Registed cars</div>
                            </div>
                            <div 
                                v-if="isAdmin"
                                @click="carTypeHandler('unregisted')"
                                class="w-1/3 text-base font-medium gap-1 flex items-center justify-center text-center duration-200 cursor-pointer p-2 py-4 max-[997px]:text-sm max-[738px]:text-xs max-[625px]:text-[10px]"
                                :class="carTypeMatched('unregisted') ? 'bg-[#93a3e6] text-white' : 'hover:text-[#93a3e6]'"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256v192c0 35.3 28.7 64 64 64h42.8c-6.6-5.9-10.8-14.4-10.8-24V376c0-20.8 11.3-38.9 28.1-48.6l21-64.7c7.5-23.1 29-38.7 53.3-38.7h115.2c24.3 0 45.8 15.6 53.3 38.7l21 64.7c16.8 9.7 28.2 27.8 28.2 48.6v112c0 9.6-4.2 18.1-10.8 24H448c35.3 0 64-28.7 64-64V256C512 114.6 397.4 0 256 0zm106.8 512c-6.6-5.9-10.8-14.4-10.8-24v-40H160v40c0 9.6-4.2 18.1-10.8 24h213.6zm-172-234.5L177 320h158l-13.8-42.5c-1.1-3.3-4.1-5.5-7.6-5.5H198.4c-3.5 0-6.5 2.2-7.6 5.5zM168 408a24 24 0 1 0 0-48a24 24 0 1 0 0 48zm200-24a24 24 0 1 0-48 0a24 24 0 1 0 48 0z"/>
                            </svg>
                                <div>Unregisted cars</div>
                            </div>
                            <div 
                                @click="carTypeHandler('expired')"
                                class="text-base font-medium gap-1 flex items-center justify-center text-center duration-200 cursor-pointer p-2 py-4 max-[997px]:text-sm max-[738px]:text-xs max-[625px]:text-[10px]"
                                :class="carTypeMatched('expired') ? 'bg-red-500 text-white' : 'hover:text-red-500', isAdmin ? 'w-1/3' : 'w-1/2'"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 640 512">
                                <path fill="currentColor" d="M176 8c-6.6 0-12.4 4-14.9 10.1l-29.4 74l-76.1-23.2c-6.3-1.9-13.1.2-17.2 5.3S33.8 86.4 37 92.1l39.5 69.1l-65.6 45.2c-5.4 3.7-8 10.3-6.5 16.7s6.7 11.2 13.1 12.2l78.7 12.2l-5.6 79.5c-.5 6.5 3.1 12.7 9 15.5s12.9 1.8 17.8-2.6l35.3-32.5l9.5-35.4l10.4-38.6c8-29.9 30.5-52.1 57.9-60.9l41-59.2C282.8 97 297.9 84.4 315 76.1c-.4-.6-.8-1.2-1.3-1.8c-4.1-5.1-10.9-7.2-17.2-5.3l-76.2 23.1l-29.4-74C188.4 12 182.6 8 176 8zm191.7 153.5l135.6 36.3c6.5 1.8 11.3 7.4 11.8 14.2l4.6 56.5l-201.5-54l32.2-46.6c3.8-5.6 10.8-8.1 17.3-6.4zm-69.9-30l-47.9 69.3c-21.6 3-40.3 18.6-46.3 41l-10.4 38.6l-16.6 61.8l-8.3 30.9c-4.6 17.1 5.6 34.6 22.6 39.2l15.5 4.1c17.1 4.6 34.6-5.6 39.2-22.6l8.3-30.9l247.3 66.3l-8.3 30.9c-4.6 17.1 5.6 34.6 22.6 39.2l15.5 4.1c17.1 4.6 34.6-5.6 39.2-22.6l8.3-30.9L595 388l10.4-38.6c6-22.4-2.5-45.2-19.6-58.7l-6.8-84c-2.7-33.7-26.4-62-59-70.8L384.2 99.7c-32.7-8.8-67.3 4-86.5 31.8zm-17 131a24 24 0 1 1-12.4 46.4a24 24 0 1 1 12.4-46.4zm217.9 83.2a24 24 0 1 1 46.3 12.4a24 24 0 1 1-46.4-12.4z"/>
                            </svg>
                                <div>Expired cars</div>
                            </div>
                            
                        </div>
                        
                        <!-- responsive select dropdown -->
                        <div class="w-4/5 flex flex-col min-[732px]:hidden">
                            <div @click="openSelectHandler" class="w-full rounded-lg p-2 flex items-center justify-between text-white text-base bg-[#2acc97]">
                                <div class="font-semibold">Select</div>
                                <i class="fa-solid fa-caret-down"></i>
                            </div>
                            <Transition name="slide-fade">
                                <div v-if="selectionOpened" class="w-full bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul class="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"  >
                                        <div class="flex items-center">
                                            <input @click="carTypeHandler('registed')" id="default-radio-2" type="radio" value="registed" v-model="carType" name="registed" class="w-4 h-4">
                                            <label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Registed cars</label>
                                        </div>

                                        <div class="flex items-center" v-if="isAdmin">
                                            <input @click="carTypeHandler('unregisted')" id="default-radio-2" type="radio" value="unregisted" v-model="carType" name="unregisted" class="w-4 h-4">
                                            <label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unregisted cars</label>
                                        </div>
                                    
                                        <div class="flex items-center">
                                            <input @click="carTypeHandler('expired')" id="default-radio-3" type="radio" value="expired" v-model="carType" name="expired" class="w-4 h-4">
                                            <label for="default-radio-3" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Expired cars</label>
                                        </div>    
                                    </ul>
                                </div>
                            </Transition>
                        </div>
                        
                         <div class="flex custom-shadow items-center flex-col w-[90vw] rounded-t-lg rounded-b-[3px] overflow-hidden">
                            <SearchField
                                @selectedFilterClicked="filterSelected" 
                                @selectedCityClicked="citySelected"
                                @selectedBrandClicked="brandSelected"
                                @selectedTimeClicked="timeSelected"
                                @selectedOwnerClicked="ownerEntered"
                                @licenseSearch="licenseSearchEntered" 
                                @next-page="nextPage" 
                                @prev-page="prevPage" 
                                @specified-page="specifiedPage"
                                @sendSortOrder="bindOrder"
                                @sendTimeSortOrder="bindTimeOrder"
                                @reloadData="reload"
                                :page-num="pageNumber"
                                :total-page="totalPage"
                                :car-type="carType"
                            />
                            <CarList 
                                :filter="filter" 
                                :city="city"
                                :brand="brand"
                                :owner="owner"
                                :time="time"
                                :page-number="pageNumber" 
                                :car-type="carType"
                                :sort-order="order"
                                :time-sort-order="timeOrder"
                                :specific-license="licenseSearchContent"
                                :reloaded="reloaded"
                                @openCarInfo="openCarInfo" 
                                @openCarRegistration="openCarRegistration"
                                @totalPageNum="bindTotalPage"
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

    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: all 0.3s ease;
    }
    
    .slide-fade-enter-from,
    .slide-fade-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }
</style>
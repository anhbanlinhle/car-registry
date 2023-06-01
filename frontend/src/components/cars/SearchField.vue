<script setup>
import { ref, watch } from 'vue';
import SearchBar from '../UI/SearchBar.vue';
import { useAccountStore } from '../../stores/AccountStore';

const isAdmin = localStorage.getItem('userType') == 1

const props = defineProps(['pageNum', 'totalPage', 'carType']);
const emit = defineEmits([
    'nextPage',
    'prevPage',
    'sendSortOrder',
    'sendTimeSortOrder',
    'specifiedPage',
    'licenseSearch',
    'selectedFilterClicked',
    'selectedCityClicked',
    'selectedOwnerClicked',
    'selectedBrandClicked',
    'selectedTimeClicked',
    'reloadData',
]);

//SECTION - Filter list
let filterList = ['No filter', 'City', 'Owner', 'Brand', 'Time']
if(isAdmin) {
    filterList = ['No filter', 'Owner', 'Brand', 'Time']
}
const cityList = ref(['All'])
const brandList = ref(['All'])
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
]

//SECTION - filter sorting
const fromAtoZ = ref('asc');

// logic - alphabetical order asc or desc
const fromAtoZClicked = () => {
    fromAtoZ.value = 'asc'
    emit('sendSortOrder', fromAtoZ.value)
};
const fromZtoAClicked = () => {
    fromAtoZ.value = 'desc'
    emit('sendSortOrder', fromAtoZ.value)
};

// logic - time order
const timeAscending = ref('asc')
const timeAscendingClicked = () => {
    timeAscending.value = 'asc'
    emit('sendTimeSortOrder', 'asc')
}
const timeDescendingClicked = () => {
    timeAscending.value = 'desc'
    emit('sendTimeSortOrder', 'desc')
}


//SECTION - find car by license
const regex = /^\d\d[A-Z]\-\d\d\d\.\d\d$/g;
const wrongLicenseFormat = ref(false)
const errorTime = 5
const wrongLicenseFormatMessageTime = ref(errorTime)
let wrongLicenseFormatInterval
const licenseSearch = (content) => {
    if(content.toUpperCase().match(regex) === null) {
        wrongLicenseFormatMessageTime.value = errorTime
        clearInterval(wrongLicenseFormatInterval)
        wrongLicenseFormat.value = true
        wrongLicenseFormatInterval = setInterval(() => {
            wrongLicenseFormatMessageTime.value -= 1
        }, 1000);
    } else {
        wrongLicenseFormatMessageTime.value = errorTime
        clearInterval(wrongLicenseFormatInterval)
        wrongLicenseFormat.value = false
        emit('licenseSearch', content)
    }
};

//SECTION - fetch all available brands
const fetchAllAvailableBrands = async () => {
    if(isAdmin) {
        const res = await fetch(`http://localhost:1111/stats/brand`, {
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
        })
        if(res.error) {
            console.log(res.error);
        }
        const dataFetched = JSON.parse(await res.text())
        brandList.value = ['All', ...dataFetched.brands]
    } else {
        const res = await fetch(`http://localhost:1111/filter/brand/all`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({carType: props.carType}),
        })
        if(res.error) {
            console.log(res.error);
        }
        const dataFetched = JSON.parse(await res.text())
        brandList.value = ['All', ...dataFetched.data]
    }
    
};

//SECTION - fetch all available cities
const fetchAllAvailableCities = async () => {
    const res = await fetch(`http://localhost:1111/filter/city/all`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({carType: props.carType}),
    })
    if(res.error) {
        console.log(res.error);
    }
    const dataFetched = JSON.parse(await res.text())
    cityList.value = ['All', ...dataFetched.data]
}

//SECTION - handle pagination
// logic - pagination with previous and next button
const pageHandler = (direction) => {
    if(direction === 'left') {
        if (props.pageNum > 1) {
            emit('prevPage');
        }
    } else {
        if (props.pageNum < props.totalPage) {
            emit('nextPage');
        }
    }
};

// logic - navigate to exact page when enter is pressed
const enterHandler = (number) => {
    if(1 <= number && number <= props.totalPage) {
        emit('specifiedPage', +number);
    }
};

//SECTION - Filter handler
const selected = ref('No filter');
const city = ref('All');
const owner = ref('');
const brand = ref('All');
const time = ref({
    year: 'All', quarter: 'All', month: 'All',
});

// logic - general filter
const filterClickedHandler = (value) => {
    brand.value = 'All'
    time.value = {
        year: 'All', quarter: 'All', month: 'All',
    }
    if(selected.value === 'Brand') {
        fetchAllAvailableBrands()
    }
    if(selected.value === 'City') {
        fetchAllAvailableCities()
    }
    emit('selectedFilterClicked', value)
}

// logic - city filter
const cityClicked = (value) => {
    emit('selectedCityClicked', value)
}

// logic - owner filter
const ssnRegex = /\d\d\d\d\-\d\d\d\d\-\d\d\d/gm
const taxRegex = /\d\d\d\-\d\d\d\-\d\d\d/gm
const ownerErrorMessageTime = ref(errorTime)
const ownerError = ref(false)
let ownerErrorMessageInterval
const ownerClicked = (value) => {
    if(value.toUpperCase().match(ssnRegex) === null && value.toUpperCase().match(taxRegex) === null) {
        ownerErrorMessageTime.value = errorTime
        clearInterval(ownerErrorMessageInterval)
        ownerError.value = true
        ownerErrorMessageInterval = setInterval(() => {
            ownerErrorMessageTime.value -= 1
        }, 1000);
    } else {
        owner.value = value
        emit('selectedOwnerClicked', value)
    }
}

// logic - brand filter
const brandClicked = (value) => {
    emit('selectedBrandClicked', value)
}

// logic - time filter with year + quarter or year + month
const timeClicked = (value, type) => {
    if(type === 'year') {
        time.value.year = value;
        time.value.month = 'All'
        time.value.quarter = 'All'
    } else if (type === 'quarter') {
        time.value.quarter = value
        time.value.month = 'All'
    } else {
        time.value.month = value
        time.value.quarter = 'All'
    }
    emit('selectedTimeClicked', {year: time.value.year, quarter: time.value.quarter, month: time.value.month})
};

//SECTION - watcher
// logic - reset filter after car type change event
watch(() => props.carType, (newCarType, oldCarType) => {
    if(newCarType !== oldCarType) {
        
        selected.value = 'No filter'
        time.value = {
            year: 'All', quarter: 'All', month: 'All',
        }
        owner.value = ''
        brand.value = 'All'
        city.value = 'All'
    }
});

//SECTION - reload data
const reload = async () => {
    selected.value = 'No filter'
    brand.value = 'All'
    city.value = 'All'
    owner.value = ''
    emit('reloadData')
};

watch(wrongLicenseFormatMessageTime, () => {
    if(wrongLicenseFormatMessageTime.value === 0) {
        wrongLicenseFormat.value = false
        wrongLicenseFormatMessageTime.value = errorTime
        clearInterval(wrongLicenseFormatInterval)
    }
});

watch(ownerErrorMessageTime, () => {
    if(ownerErrorMessageTime.value === 0) {
        ownerError.value = false
        ownerErrorMessageTime.value = errorTime
        clearInterval(ownerErrorMessageInterval)
    }
});
</script>

<template>
    <div class="bg-white w-full p-6 px-7 flex flex-col gap-3 justify-center">
        <div class="w-full flex items-center justify-between max-[535px]:items-start max-[535px]:flex-col-reverse max-[535px]:gap-y-2">
            <div class="flex items-center w-1/2 gap-3 max-[535px]:w-full">
                <SearchBar @search-entered="licenseSearch" width="w-full" placeholder="Enter a license plate..."/>
                <svg @click="reload" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-[#292929] p-[6px] rounded-[50%] hover:text-[#2acc97] active:bg-[#2acc97]/10 cursor-pointer duration-300 ease-in-out transition-transform hover:rotate-180">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </div>
            <!-- Pagination -->
            <div class="flex items-center gap-2 w-fit justify-end max-[535px]:w-full">
                <svg @click="pageHandler('left')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-[#1d1d1d] cursor-pointer duration-200 hover:text-[#2acc97]">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z" clip-rule="evenodd" />
                </svg>
                <div class="flex items-center">
                    <input type="number" min="1" :max="totalPage" :value="props.pageNum" @keyup.enter="enterHandler($event.target.value)" class="border border-[#1d1d1d] border-opacity-10 p-[2px] w-10 text-[14px] text-[#1d1d1d] font-semibold">
                    <div class="text-[14px] text-[#1d1d1d] font-semibold">/{{ totalPage }}</div>
                </div>
                <svg @click="pageHandler('right')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-[#1d1d1d] cursor-pointer duration-200 hover:text-[#2acc97]">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
        <Transition name="slide-fade">
            <div v-if="wrongLicenseFormat" class="w-full flex items-center space-x-1 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p class="text-sm font-semibold">Please enter the correct format (e.g. 29F-288.10)</p>
            </div>
        </Transition>
        <div class="w-full min-[732px]:flex-row flex flex-col gap-y-2 min-[732px]:items-center">
            <div class="w-full min-[732px]:w-[30%] flex items-center gap-2">
                <div class="flex items-center">
                    <h1 class="text-[#9196a4] font-semibold">Filter</h1>
                </div>
                <select @change="filterClickedHandler(selected)" v-model="selected" id="countries" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:outline-[#2acc97] block w-full p-2.5">
                    <option :value="item" v-for="item in filterList" :key="item">
                        {{ item }}
                    </option>
                </select>

                <!-- Ordering -->
                <div v-if="selected !== 'No filter' && selected === 'Brand' && brand === 'All'" class="flex flex-col gap-1">
                    <svg @click="fromAtoZClicked" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-up-filled w-5 h-5 cursor-pointer" :class="fromAtoZ === 'asc' ? 'text-[#2acc97]' : ''" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10.586 3l-6.586 6.586a2 2 0 0 0 -.434 2.18l.068 .145a2 2 0 0 0 1.78 1.089h2.586v7a2 2 0 0 0 2 2h4l.15 -.005a2 2 0 0 0 1.85 -1.995l-.001 -7h2.587a2 2 0 0 0 1.414 -3.414l-6.586 -6.586a2 2 0 0 0 -2.828 0z" stroke-width="0" fill="currentColor"></path>
                    </svg>
                    <svg @click="fromZtoAClicked" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-down-filled w-5 h-5 cursor-pointer" :class="fromAtoZ === 'desc' ? 'text-[#2acc97]' : ''" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10 2l-.15 .005a2 2 0 0 0 -1.85 1.995v6.999l-2.586 .001a2 2 0 0 0 -1.414 3.414l6.586 6.586a2 2 0 0 0 2.828 0l6.586 -6.586a2 2 0 0 0 .434 -2.18l-.068 -.145a2 2 0 0 0 -1.78 -1.089l-2.586 -.001v-6.999a2 2 0 0 0 -2 -2h-4z" stroke-width="0" fill="currentColor"></path>
                    </svg>
                </div>
                <div v-else-if="selected === 'Time'" class="flex flex-col">
                    <svg @click="timeAscendingClicked" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-badge-up-filled w-5 h-5 cursor-pointer" :class="timeAscending === 'asc' ? 'text-[#2acc97]' : ''" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M11.375 6.22l-5 4a1 1 0 0 0 -.375 .78v6l.006 .112a1 1 0 0 0 1.619 .669l4.375 -3.501l4.375 3.5a1 1 0 0 0 1.625 -.78v-6a1 1 0 0 0 -.375 -.78l-5 -4a1 1 0 0 0 -1.25 0z" stroke-width="0" fill="currentColor"></path>
                    </svg>
                    <svg @click="timeDescendingClicked" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-badge-down-filled w-5 h-5 cursor-pointer" :class="timeAscending === 'desc' ? 'text-[#2acc97]' : ''" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M16.375 6.22l-4.375 3.498l-4.375 -3.5a1 1 0 0 0 -1.625 .782v6a1 1 0 0 0 .375 .78l5 4a1 1 0 0 0 1.25 0l5 -4a1 1 0 0 0 .375 -.78v-6a1 1 0 0 0 -1.625 -.78z" stroke-width="0" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
            <div class="w-full min-[732px]:w-[70%] flex items-center max-[731px]:justify-end min-[732px]:ml-3">
                <!-- City filter -->
                <Transition name="slide-fade">
                    <div v-show="selected === 'City'" class="flex max-[731px]:w-full max-[731px]:pr-[26px] items-center gap-2">
                        <div class="flex items-center max-[731px]:pr-[10px]">
                            <h1 class="text-[#9196a4] font-semibold">City</h1>
                        </div>
                        <select v-model="city" @change="cityClicked(city)" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:outline-[#2acc97] block w-full p-2.5">
                            <option v-for="singleCity in cityList" :key="singleCity">
                                {{ singleCity }}
                            </option>
                        </select>
                    </div>
                </Transition>

                <!-- Owner filter -->
                <Transition name="slide-fade">
                    <div v-show="selected === 'Owner'" class="flex items-center gap-2">
                        <div class="flex items-center">
                            <h1 class="text-[#9196a4] font-semibold">Owner</h1>
                        </div>
                        <SearchBar @search-entered="ownerClicked" width="w-[70%]" placeholder="Enter the SSN or tax..."/>
                    </div>
                </Transition>
                
                <!-- Brand filter -->
                <Transition name="slide-fade">
                    <div v-show="selected === 'Brand'" class="flex max-[731px]:w-full items-center gap-2">
                        <div class="flex items-center">
                            <h1 class="text-[#9196a4] font-semibold">Brand</h1>
                        </div>
                        <select v-model="brand" @change="brandClicked(brand)" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:outline-[#2acc97] block w-full p-2.5">
                            <option v-for="singleBrand in brandList" :key="singleBrand" :value="singleBrand">
                                {{ singleBrand }}
                            </option>
                        </select>
                    </div>
                </Transition>
                
                <!-- Time filter -->
                <Transition name="slide-fade">
                    <div v-show="selected === 'Time'" class="flex max-[731px]:w-full items-center gap-2 w-full">
                        <select v-model="time.year" @change="timeClicked(time.year, 'year')" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:outline-[#2acc97] block w-full p-2.5">
                            <option v-for="singleYear in yearList" :key="singleYear" :value="singleYear">
                                {{ singleYear }}
                            </option>
                        </select>
                        <select :disabled="time.year === 'All'" v-model="time.quarter" @change="timeClicked(time.quarter, 'quarter')" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:outline-[#2acc97] block w-full p-2.5 disabled:opacity-60">
                            <option v-for="singleQ in quarterList" :key="singleQ.value" :value="singleQ.value">
                                {{ singleQ.content }}
                            </option>
                        </select>
                        <select :disabled="time.year === 'All'" v-model="time.month" @change="timeClicked(time.month, 'month')" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:outline-[#2acc97] block w-full p-2.5 disabled:opacity-60">
                            <option v-for="singleMonth in monthList" :key="singleMonth.value" :value="singleMonth.value">
                                {{ singleMonth.content }}
                            </option>
                        </select>
                    </div>
                </Transition>
                
            </div>
        </div>
        <Transition name="slide-fade">
            <div v-if="ownerError" class="w-full flex items-center space-x-1 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p class="text-sm font-semibold">Please enter the correct format of SSN or Tax-number</p>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
    textarea:focus, input:focus{
        outline: none;
    }

    #sub-filter {
        animation: slide 0.5s;
    }
    @keyframes slide {
        from {
            opacity: 0;
            transform: translateX(10px);
        }
        to {
            opacity: 1;
            transform: translateX(0px);
        }
    }

    .slide-fade-enter-active {
        transition: all 0.6s ease-in-out;
    }

    .slide-fade-leave-active {
        transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from {
        transform: translateX(10px);
        opacity: 0;
    }
    .slide-fade-leave-to {
        transform: translateX(-10px);
        opacity: 0;
    }
</style>
<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { ref, onMounted, onBeforeMount, watch, onUpdated } from 'vue';
import { Bar } from 'vue-chartjs';
import { useAccountStore } from "../../stores/AccountStore";
import { useAdminSelectionStore } from '../../stores/AdminSelectionStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.defaults.font.size = 10
ChartJS.defaults.font.weight = 700

const adminSelectionStore = useAdminSelectionStore()
const isAdmin = ref(localStorage.getItem('userType') == 1)
const props = defineProps(['year']);

const chartData = ref({});
let registedCarList = []
let expiredCarList = []
const dataList = ref([])
const totalRegist = ref()
const totalExpire = ref()
const yearList = ref([])

const data = ref({
    labels: [],
    datasets: [{ data: [] }]
})
const options = ref({})

let chartRegisted, chartExpired;

const fetchData = async () => {
    let fetchBody
    let res
    if (isAdmin.value) {
        if(adminSelectionStore.getSelected === 'all') {
            fetchBody = {}
        } else if(adminSelectionStore.getSelected === 'region') {
            fetchBody = {
                filter: 'region',
                name: adminSelectionStore.getOptionSelected,
            }
        } else {
            fetchBody = {
                filter: 'centre',
                name: adminSelectionStore.getOptionSelected,
            }    
        }
        res = await fetch(`http://localhost:1111/admin/chart`, {
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
    } else {
        res = await fetch(`http://localhost:1111/chart`, {
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
        if(res.error) {
            console.log(res.error);
        }
    }
    dataList.value = JSON.parse(await res.text())
    yearList.value = dataList.value.Year
    chartData.value = dataList.value.Data[props.year - yearList.value[0]];
    
    totalRegist.value = dataList.value.Data[props.year - yearList.value[0]].regist.total
    totalExpire.value = dataList.value.Data[props.year - yearList.value[0]].expire.total

    chartRegisted = chartData.value.regist.month;
    chartExpired = chartData.value.expire.month;

    registedCarList = [
        chartRegisted.January,
        chartRegisted.February,
        chartRegisted.March,
        chartRegisted.April,
        chartRegisted.May,
        chartRegisted.June,
        chartRegisted.July,
        chartRegisted.August,
        chartRegisted.September,
        chartRegisted.October,
        chartRegisted.November,
        chartRegisted.December,
    ]

    expiredCarList = [
        chartExpired.January,
        chartExpired.February,
        chartExpired.March,
        chartExpired.April,
        chartExpired.May,
        chartExpired.June,
        chartExpired.July,
        chartExpired.August,
        chartExpired.September,
        chartExpired.October,
        chartExpired.November,
        chartExpired.December,
    ]
    data.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Registed cars',
                color: '#36A2EB',
                backgroundColor: ['#2acc97'],
                data: registedCarList
            },
            {
                label: 'Expired cars',
                color: '#36A2EB',
                backgroundColor: ['#93a3e6'],
                data: expiredCarList
            },
        ]
    }
    

    options.value = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    beginAtZero: true,
                }
            },
            x: {
                ticks: {
                    fontSize: 20,
                },
            }
        },
        animations: {
            easing: 'easeOutQuart',
        },
    }
}

fetchData();

watch(() => props.year, (newYear, oldYear) => {
    if(newYear !== oldYear) {
        chartData.value = dataList.value.Data[newYear - yearList.value[0]];
        
        totalRegist.value = dataList.value.Data[props.year - yearList.value[0]].regist.total
        totalExpire.value = dataList.value.Data[props.year - yearList.value[0]].expire.total
        
        chartRegisted = chartData.value.regist.month
        chartExpired = chartData.value.expire.month

        registedCarList = [
            chartRegisted.January,
            chartRegisted.February,
            chartRegisted.March,
            chartRegisted.April,
            chartRegisted.May,
            chartRegisted.June,
            chartRegisted.July,
            chartRegisted.August,
            chartRegisted.September,
            chartRegisted.October,
            chartRegisted.November,
            chartRegisted.December,
        ]

        expiredCarList = [
            chartExpired.January,
            chartExpired.February,
            chartExpired.March,
            chartExpired.April,
            chartExpired.May,
            chartExpired.June,
            chartExpired.July,
            chartExpired.August,
            chartExpired.September,
            chartExpired.October,
            chartExpired.November,
            chartExpired.December,
        ]

        data.value = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Registed cars',
                    color: '#36A2EB',
                    backgroundColor: ['#2acc97'],
                    data: registedCarList
                },
                {
                    label: 'Expired cars',
                    color: '#36A2EB',
                    backgroundColor: ['#93a3e6'],
                    data: expiredCarList
                },
            ]
        }

    }
});

watch(() => adminSelectionStore.getOptionSelected, () => {
    fetchData()
});

watch(() => adminSelectionStore.getSelected, () => {
    fetchData()
});

</script>

<template>
    <div class="w-4/5 flex flex-col items-center bg-white rounded-md shadow-md p-4 gap-5">
        <div class="w-full flex items-center justify-between pl-1 max-sm:flex-col max-sm:items-start">
            <div class="flex items-center gap-1">
                <div class="font-medium text-[#1d1d1d]">Year:</div>
                <div class="font-medium" :class="totalRegist > totalExpire ? 'text-[#2acc97]' : 'text-[#93a3e6]'">{{ year }}</div>
            </div>
            <div class="flex items-center sm:gap-6 max-sm:flex-col max-sm:items-start">
                <div class="flex items-center gap-1">
                    <div class="font-medium text-[#1d1d1d]">Total Registed:</div>
                    <div class="font-medium text-[#2acc97]"> {{ totalRegist }} </div>
                </div>
                <div class="flex items-center gap-1">
                    <div class="font-medium text-[#1d1d1d]">Total Expired:</div>
                    <div class="font-medium text-[#93a3e6]"> {{ totalExpire }} </div>
                </div>
            </div>
        </div>
        <div class="w-full h-full max-[914px]:w-full max-[500px]:h-[50vh]">
            <Bar :data="data" :options="options" class="w-full max-[914px]:w-full max-[500px]:h-[50vh]" />
        </div>
    </div>
</template>
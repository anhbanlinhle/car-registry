<script setup>
import { ref } from 'vue';
import bg from '../../assets/bg6.png'
import CategoryCard from './CategoryCard.vue';

const isAdmin = ref(localStorage.getItem('userType') == 1)

const about = ref(null)
const terms = ref(null)
const services = ref(null)

const scrollToAbout = () => {
    document.documentElement.scrollTop = about.value.offsetTop
};

const scrollToTerms = () => {
    document.documentElement.scrollTop = terms.value.offsetTop
};

const scrollToServices = () => {
    document.documentElement.scrollTop = services.value.offsetTop
};

const scrollToTop = () => {
    document.documentElement.scrollTop = 0
};

</script>

<template>
    <div class="w-full h-full flex flex-col items-center relative overflow-hidden">
        <div class=" w-full flex items-center justify-end pt-5 px-10">
            <div class="flex gap-5 text-lg text-white font-semibold">
                <button @click="scrollToAbout" class="relative text-base max-sm:text-sm inline-block after:contents-[''] after:w-full after:absolute after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:after:origin-bottom-left">
                    About
                </button>
                <button @click="scrollToTerms" class="relative text-base max-sm:text-sm inline-block after:contents-[''] after:w-full after:absolute after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Terms
                </button>
                <button @click="scrollToServices" class="relative text-base max-sm:text-sm inline-block after:contents-[''] after:w-full after:absolute after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Services
                </button>
            </div>
        </div>
        <div class="w-full flex justify-around items-start px-10 max-lg:flex-col-reverse max-lg:items-center">
            <div class="lg:pt-40 text-white">
                <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold mb-5">
                    Take your car registry management experience to the next level.
                </p>
                <p class="text-[10px] md:text-xs lg:text-sm xl:text-base font-medium mb-4">
                    With this application, registry management can be much easier and enjoyable than ever with modern interface and extremely convenient functions.
                </p>
                <button @click="scrollToServices" class="flex group text-base max-sm:text-sm items-center bg-[#2acc97]/80 hover:bg-[#2acc97] hover:-translate-y-1 transition-all ease-in-out duration-200 px-3 py-3 gap-2 mb-10 font-semibold rounded-lg">
                    Get to work
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-6 h-6 max-sm:w-5 max-sm:h-5 transition-transform duration-200 group-hover:rotate-90">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
                <div class="flex items-center gap-16 max-sm:hidden">
                    <div class="flex flex-col justify-around items-center h-32 w-28 border-2 rounded-2xl p-2 pb-3 bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-9 h-9 text-[#eded4a]">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <div class="text-center flex items-center text-base text-[#1d1d1d] text-opacity-90 font-semibold">Convenient</div>
                    </div>
                    <div class="flex flex-col justify-around items-center h-32 w-28 border-2 rounded-2xl p-2 pb-3 bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-9 h-9 text-[#eded4a]">
                            <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
                        </svg>
                        <div class="text-center flex items-center text-base text-[#1d1d1d] text-opacity-90 font-semibold">Fast</div>
                    </div>
                    <div class="flex flex-col justify-around items-center h-32 w-28 border-2 rounded-2xl p-2 pb-3 bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-number-1 w-9 h-9 text-[#eded4a]" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M10 10l2 -2v8"></path>
                        </svg>
                        <div class="text-center flex items-center text-base text-[#1d1d1d] text-opacity-90 font-semibold">SPA</div>
                    </div>
                </div>
            </div>
            <img :src="bg" alt="" class="transition-all duration-200 ease-in-out md:w-[450px] lg:w-[500px] xl:w-[600px] 2xl:w-[800px]"/>
        </div>
        <div class="w-[600%] absolute z-[-1] bottom-0 bg-[#93a3e6]/60 h-[200%] -translate-y-1/3 sm:-translate-y-[31%] md:-translate-y-1/3 lg:-translate-y-[36%] xl:-translate-y-[35%] rotate-[6deg] rounded-bl-xl"></div>
        <div ref="about" class="w-full px-10">
            <div class="w-full mt-24 py-10 px-5 rounded-lg bg-white border border-gray-100 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-xl shadow transition-all duration-300 ease-in-out">
                <p class="text-center text-3xl font-semibold mb-5"><span class="text-[#2acc97] text-5xl">A</span>bout</p>
                <div class="font-medium text-sm text-justify">
                    <p class="font-semibold text-md ">
                        The Vietnam Register (VR) is an organization directly under the Ministry of Transport, performing the function of state management of registration.
                    </p>
                    <p class=" ">
                        ​Vietnam Register (VR) is an organization directly under the Ministry of Transport, performing the function of state management of registration of traffic vehicles and vehicles and equipment for ranking and testing. specialized tools, containers, boilers and pressure vessels used in road, railway, inland waterway and maritime transportation nationwide; organize the registration of technical safety and quality of all kinds of vehicles, transportation equipment and means of transport, equipment for oil and gas exploration, extraction and transportation at sea according to the provisions of law.
                    </p>
                    <p class=" ">
                        The Vietnam Register has 24 Sub-Departments that carry out technical inspection of safety of watercraft and marine structures; there is a system of 140 centers/stations for technical inspection of road motor vehicle safety.
                    </p>
                    <p class=" ">
                        The Vietnam Register has about 1,300 officials and employees, including more than 1000 technical staff with college and university degrees, about 100 staff with university degrees.
                    </p>
                </div>
            </div>
        </div>
        <div ref="terms" class="w-full pt-24 pb-10 px-10">
            <p class="text-center text-3xl font-semibold mb-8"><span class="text-[#2acc97] text-5xl">T</span>erms</p>
            <div class="grid grid-cols-4 grid-rows-[repeat(x,max-content),1fr] gap-4 max-sm:grid-cols-1 max-md:grid-cols-2">
                <div class="w-full overflow-hidden flex flex-col text-[#1d1d1d] bg-white items-center gap-4 py-10 shadow rounded-lg relative z-[1] hover:text-white duration-700 ease-in-out hover:-translate-y-1 hover:shadow-md group after:absolute after:contents-[''] after:z-[-2] after:h-full after:-left-[35%] after:top-0 after:skew-x-[15deg] after:duration-500 after:origin-top-left after:w-0 after:bg-red-500/30 hover:after:h-full hover:after:w-[200%]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-8 h-8 p-1 bg-red-500/20 group-hover:bg-transparent text-red-500 rounded-[50%] transition-all duration-500 group-hover:[transform:rotateY(180deg)]">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p class="text-center text-base font-semibold">Do not violate the system</p>
                </div>
                <div class="w-full overflow-hidden flex flex-col text-[#1d1d1d] bg-white items-center gap-4 py-10 shadow rounded-lg relative z-[1] hover:text-white duration-700 ease-in-out hover:-translate-y-1 hover:shadow-md group after:absolute after:contents-[''] after:z-[-2] after:h-full after:-left-[35%] after:top-0 after:skew-x-[15deg] after:duration-500 after:origin-top-left after:w-0 after:bg-[#93a3e6]/30 hover:after:h-full hover:after:w-[200%]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 p-1 bg-[#93a3e6]/20 group-hover:bg-transparent text-[#93a3e6] rounded-[50%] transition-all duration-500 group-hover:[transform:rotateY(180deg)]">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                    </svg>
                    <p class="text-center text-base font-semibold">Be fair</p>
                </div>
                <div class="w-full overflow-hidden flex flex-col text-[#1d1d1d] bg-white items-center gap-4 py-10 shadow rounded-lg relative z-[1] hover:text-white duration-700 ease-in-out hover:-translate-y-1 hover:shadow-md group after:absolute after:contents-[''] after:z-[-2] after:h-full after:-left-[35%] after:top-0 after:skew-x-[15deg] after:duration-500 after:origin-top-left after:w-0 after:bg-[#2acc97]/30 hover:after:h-full hover:after:w-[200%]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bong-off w-8 h-8 p-1 bg-[#2acc97]/20 group-hover:bg-transparent text-[#2acc97] rounded-[50%] transition-all duration-500 group-hover:[transform:rotateY(180deg)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 5v-2h4v6m1.5 1.5l2.5 -2.5l2 2l-2.5 2.5m-.5 3.505a5 5 0 1 1 -7 -4.589v-2.416"></path>
                        <path d="M8 3h6"></path>
                        <path d="M6.1 17h9.8"></path>
                        <path d="M3 3l18 18"></path>
                    </svg>
                    <p class="text-center text-base font-semibold">No drugs</p>
                </div>
                <div class="w-full overflow-hidden flex flex-col text-[#1d1d1d] bg-white items-center gap-4 py-10 shadow rounded-lg relative z-[1] hover:text-white duration-700 ease-in-out hover:-translate-y-1 hover:shadow-md group after:absolute after:contents-[''] after:z-[-2] after:h-full after:-left-[35%] after:top-0 after:skew-x-[15deg] after:duration-500 after:origin-top-left after:w-0 after:bg-orange-400/30 hover:after:h-full hover:after:w-[200%]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cash-banknote-off w-8 h-8 p-1 bg-orange-400/20 group-hover:bg-transparent text-orange-400 rounded-[50%] transition-all duration-500 group-hover:[transform:rotateY(180deg)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9.88 9.878a3 3 0 1 0 4.242 4.243m.58 -3.425a3.012 3.012 0 0 0 -1.412 -1.405"></path>
                        <path d="M10 6h9a2 2 0 0 1 2 2v8c0 .294 -.064 .574 -.178 .825m-2.822 1.175h-13a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2h1"></path>
                        <path d="M18 12l.01 0"></path>
                        <path d="M6 12l.01 0"></path>
                        <path d="M3 3l18 18"></path>
                    </svg>
                    <p class="text-center text-base font-semibold">No bribe</p>
                </div>
            </div>
        </div>
        <div ref="services" class="w-full grid grid-cols-2 max-sm:grid-cols-1 grid-rows-[repeat(x,max-content),1fr] items-center pt-24 pb-10 bg-[#2acc97]/10 px-10">
            <div class="text-center pl-10 min-[500px]:p-20">
                <p class="text-3xl font-semibold text-left"><span class="text-[#2acc97] text-5xl">S</span>ervices</p>
                <p class="text-lg font-medium text-left">With these functions, management will be easier than ever</p>
            </div>
            <div class="grid grid-cols-2 max-[500px]:grid-cols-1 grid-rows-[repeat(x,max-content),1fr] gap-2 mt-5">
                <CategoryCard icon="fa-solid fa-car" category="Cars" link="/cars" class="w-full">
                    <template #i>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M135.2 117.4L109.1 192h293.8l-26.1-74.6c-4.5-12.8-16.6-21.4-30.2-21.4H165.4c-13.6 0-25.7 8.6-30.2 21.4zm-95.6 79.4L74.8 96.3C88.3 57.8 124.6 32 165.4 32h181.2c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2v192c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-48H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0-64 0a32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64a32 32 0 1 0 0 64z"/>
                        </svg>
                    </template>
                </CategoryCard>
                <CategoryCard v-if="!isAdmin" icon="fa-solid fa-circle-plus" category="Regist" link="/regist-new-car" class="w-full">
                    <template #i>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512zm-24-168v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                        </svg>
                    </template>
                </CategoryCard>
                <CategoryCard icon="fa-solid fa-lightbulb" category="Forecast" link="/forecast" class="w-full">
                    <template #i>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 384 512">
                            <path fill="currentColor" d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c19.8 27.1 39.7 54.4 49.2 86.2h160zm-80 128c44.2 0 80-35.8 80-80v-16H112v16c0 44.2 35.8 80 80 80zm-80-336c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"/>
                        </svg>
                    </template>
                </CategoryCard>
                <CategoryCard icon="fa-solid fa-chart-simple" category="Statistics" link="/statistics" class="w-full">
                    <template #i>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48h-32c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48v160c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48v288c0 26.5-21.5 48-48 48h-32c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"/>
                        </svg>
                    </template>
                </CategoryCard>
                <CategoryCard v-if="isAdmin" icon="fa-sharp fa-solid fa-users" category="Account management" link="/account-management" class="w-full">
                    <template #i>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 640 512">
                            <path fill="currentColor" d="M144 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160zm368 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96H21.3C9.6 320 0 310.4 0 298.7zM405.3 320h-.7c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7c58.9 0 106.7 47.8 106.7 106.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0a96 96 0 1 1-192 0zm-96 261.3c0-73.6 59.7-133.3 133.3-133.3h117.4c73.6 0 133.3 59.7 133.3 133.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/>
                        </svg>
                    </template>
                </CategoryCard> 
                <CategoryCard v-if="isAdmin" icon="fa-sharp fa-solid fa-database" category="Manage database" link="/manage-database" class="w-full">
                    <template #i>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0s224 35.8 224 80zm-54.8 134.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432v-85.9z"/>
                        </svg>
                    </template>
                </CategoryCard>
            </div>
        </div>
        <div class="fixed z-10 bottom-4 right-4">
            <svg @click="scrollToTop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 animate-bounce text-[#2acc97] cursor-pointer">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 001.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
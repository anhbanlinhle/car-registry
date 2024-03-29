<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '../stores/AccountStore';

const accountStore = useAccountStore()
const isAdmin = localStorage.getItem('userType') == 1

const router = useRouter()

//SECTION - file upload handler
const file = ref()
const hasFile = ref(false)
const selectedFile = ref(null)

const fileUploadHandler = () => {
	selectedFile.value = file.value.files[0]
	hasFile.value = true
};

const removeFile = () => {
	if(selectedFile.value !== null) {
		hasFile.value = false
		selectedFile.value = null
		ownerTypePicked.value = null
		file.value.value = null
	}
};

const messageTime = 5
const errorMessageTime = ref(messageTime)
const errorMessageOn = ref(false)
const ownerTypeErrorMessageOn = ref(false)
const successfullyAdded = ref(false)
const addFailed = ref(false)
let addFailedInterval
const addFailedTime = ref(messageTime)
let errorMessageInterval;
const upload = async () => {
	if(!hasFile.value) {
		errorMessageOn.value = true
		clearInterval(errorMessageInterval)
		errorMessageTime.value = messageTime
		errorMessageInterval = setInterval(() => {
			errorMessageTime.value -= 1
		}, 1000);
	} else {
		if(ownerTypePicked.value === null) {
			ownerTypeErrorMessageOn.value = true
			return
		}
		ownerTypeErrorMessageOn.value = false
		const formData = new FormData()
		formData.append("ownerType", ownerTypePicked.value)
		formData.append("file", file.value.files[0])
		const res = await fetch(`http://localhost:1111/read-excel`, {
			method: 'POST',
			credentials: "include",
			headers: {
				'Authorization': `${localStorage.getItem('token')}`
			},
			body: formData
		})
		if(res.error) {
			console.log(res.error);
		}
		if(res.status === 200) {
			successfullyAdded.value = true
			setTimeout(() => {
				location.reload()
			}, 1);
		} else {
			clearInterval(addFailedInterval)
			addFailedTime.value = messageTime
			addFailed.value = true
			addFailedInterval = setInterval(() => {
				addFailedTime.value -= 1
			}, 1000);
		}
	}
}

//SECTION - owner type selection
const ownerTypePicked = ref(null);

//SECTION - watchers
watch(() => errorMessageTime.value, () => {
	if(errorMessageTime.value === 0) {
		errorMessageOn.value = false
		errorMessageTime.value = messageTime
		clearInterval(errorMessageInterval)
	}
});

watch(() => ownerTypePicked.value, (newType, oldType) => {
	if(hasFile.value && oldType === null) {
		ownerTypeErrorMessageOn.value = false
	}
});

watch(addFailedTime, () => {
	if(addFailedTime.value === 0) {
		addFailed.value = false
		clearInterval(addFailedInterval)
		addFailedTime.value = messageTime
	}
})

onBeforeMount(() => {
	if(!isAdmin) {
		router.push('/not-found')
	}
});

</script>

<template>
	<div class="flex flex-col gap-4 items-center justify-center w-full p-4">
		<div class="w-full flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-[#cc5b2a]">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
			</svg>
			<p class="text-base font-medium text-[#cc5b2a]">
				Be careful! Remember to classify files by car owner type (company/person)
			</p>
		</div>
        <label for="dropzone-file" class="flex flex-col items-center justify-center px-4 w-full h-64 border-2 border-[#2acc97] border-dashed rounded-lg cursor-pointer bg-transparent hover:bg-[#2acc97]/10">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Choose file</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Excel only (.xlsx)</p>
            </div>
        </label>
		<div class="w-full flex items-center justify-between">
			<div class="flex items-center gap-2 ml-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-[#1d1d1d]">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
				<input accept=".xlsx" ref="file" @change="fileUploadHandler" id="dropzone-file" type="file" class="hidden"/>
				<p class="font-medium text-base text-[#1d1d1d]">{{ selectedFile !== null ? selectedFile.name : 'No chosen file' }}</p>
			</div>
			<div v-if="hasFile">
				<svg @click="removeFile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-[#cc5b2a] p-3 rounded-[50%] cursor-pointer ease-in-out duration-200 hover:bg-[#cc5b2a]/10 active:bg-[#cc5b2a]/20">
					<path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
				</svg>
			</div>
		</div>
		<!-- <div>{{ selectedFile.name }}</div> -->
		<Transition name="slide-fade">
			<div v-if="hasFile" class="w-full flex flex-col gap-4 p-4 border-[#2acc97] border-dashed border-2 rounded-lg">
				<p class="font-medium text-[#1d1d1d] text-base">Choose an owner type of the uploaded file</p>
				<div class="w-full flex justify-evenly">
					<div>
						<input type="radio" id="one" :value="0" v-model="ownerTypePicked" />
						<label for="one" class="text-base font-medium text-[#1d1d1d] ml-1">Company</label>
					</div>
					<div>
						<input type="radio" id="two" :value="1" v-model="ownerTypePicked" />
						<label for="two" class="text-base font-medium text-[#1d1d1d] ml-1">Person</label>
					</div>
				</div>
			</div>
		</Transition>
		<Transition name="fade">
			<div v-if="errorMessageOn" class="w-full flex items-center p-3 gap-2 text-[#cc5b2a]">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
					<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
				</svg>
				<p class="text-base font-medium">No chosen file to be uploaded!</p>
			</div>
		</Transition>
		<Transition name="fade">
			<div v-if="ownerTypeErrorMessageOn && hasFile" class="w-full flex items-center p-3 gap-2 text-[#cc5b2a]">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
					<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
				</svg>
				<p class="text-base font-medium">Please choose an owner type of the uploaded file!</p>
			</div>
		</Transition>
		<Transition name="fade">
			<div v-if="successfullyAdded" class="w-full flex items-center p-3 gap-2 text-[#2acc97]">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
				</svg>
				<p class="text-base font-medium">Add data to database successfully!</p>
			</div>
		</Transition>
		<Transition name="fade">
			<div v-if="addFailed" class="w-full flex items-center p-3 gap-2 text-red-500">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
				<p class="text-base font-medium">Failed to add data to database! Please try again!</p>
			</div>
		</Transition>
		<button @click="upload" class="py-2 px-3 rounded-lg bg-[#2acc97]/80 font-semibold text-white text-[14px] flex items-center gap-1 hover:bg-[#2acc97]/90 active:bg-[#2acc97]">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
			</svg>
			<p>Upload</p>
		</button>
    </div>
</template>

<style scoped>
	input[type=file]::file-selector-button {
        display: none;
    }

	.slide-fade-enter-active {
		transition: all 0.3s ease-out;
	}

	.slide-fade-leave-active {
		transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateY(-15px);
		opacity: 0;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
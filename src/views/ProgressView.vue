<template>
<div class="max-w-screen-lg mx-auto px-4 py-10">
    <div class="max-w-7xl mb-10 mx-auto py-5 lg:py-5 lg:flex lg:items-center lg:justify-between">
        <div>
            <span class="block font-extrabold leading-tight text-4xl mt-0 mb-2">My Achievements</span>
            <span class="block mt-2 max-w-2xl text-l text-gray-500">Track the progress of all your completed exercises!</span>
        </div>
    </div>
    <div class="flex flex-col items-center p-8 px-8 relative">
        <div class="flex flex-col">
            <div class="flex items-center">
                <div class="bg-violet-300 h-16 w-16 rounded-full">
                    <img  src="@/assets/images/strength.svg" class="h-16 w-auto" alt="">
                </div>  
                <h2 class="font-extrabold text-xl pl-3">Strength Exercises</h2>
            </div>
            <div class="flex justify-between relative p-6 rounded-lg bg-gray-50 shadow-md mt-6 items-center w-full" v-for="(exercise, key) in filterType(progress, 'strength')" :key="key">
                <div class="flex items-center">
                    <div>
                        <img class="w-20 " :src="exercise.gifUrl">
                    </div>
                    <div class="capitalize font-bold pl-6 text-md">
                        {{key}}
                    </div>
                </div>
                <div class="flex flex-2 px-5 items-center justify-end">
                    <div>
                        <span class=" inline-block text-sm text-center ">Total Reps</span> <span class=" inline-block text-center font-bold text-md">{{exercise.totalReps}} reps</span>
                    </div>
                    <div class="ml-4">
                        <span class="inline-block text-sm text center ">Weight</span> <span class=" inline-block text-center font-bold text-md">{{exercise.maxWeight}} kg</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-8 flex flex-col">
            <div class="flex items-center">
                <div class="bg-cyan-300 h-16 w-16 rounded-full">
                    <img  src="@/assets/images/Cardio.svg" class="h-16 w-auto" alt="">
                </div>
                <h2 class="font-extrabold text-xl pl-3">Cardio Exercises</h2>
            </div>
            <div class="flex justify-between relative p-6 rounded-lg bg-gray-50 shadow-md mt-6 items-center w-full" v-for="(exercise, key) in filterType(progress, 'cardio')" :key="key">
                <div class="flex items-center">
                    <div>
                        <Vue3Lottie :animationData="convertLottis(key)" :height="90" :width="90" />
                    </div>
                    <div class="capitalize font-bold pl-6 text-md">
                        {{key}}
                    </div>
                </div>
                <div class="flex flex-2 px-5 items-center justify-end">
                    <div>
                        <div class="inline-block text-sm text-center ">Fastest Pace</div> <div class=" inline-block text-center font-bold text-md">{{exercise.maxPace}} km/hr</div>
                    </div>
                    <div class="ml-2">
                        <div class="inline-block text-sm text-center ">Total Time</div> <div class=" inline-block text-center font-bold text-md">{{exercise.totalDuration}} minutes</div>
                    </div>
                    <div class="ml-2">
                        <div class="inline-block text-sm text center ">Total Distance</div> <div class=" inline-block text-center font-bold text-md">{{exercise.totalDistance}} km</div>
                    </div>
                </div>
            </div>
        </div>


        
        

    </div>


</div>
</template>

<script>
import {ref} from 'vue'
import {supabase} from '../supabase/init'
import bike from '../assets/lotti/bike'
import run from '../assets/lotti/run.json'
import swim from '../assets/lotti/swim.json'
import walk from '../assets/lotti/walk.json'


export default {
    name: 'progressView',
    setup(){
        const dataLoaded = ref(null);
        const progressData = ref([])
        const progress = ref({})

        const filterType = (progress, type) =>{
            if (type === "strength"){
                const asArray = Object.entries(progress)
                const filtered = asArray.filter(([key, value])=> value.type == "strength")
                const justStrength = Object.fromEntries(filtered)
                console.log(justStrength)
                return justStrength
            }
            else{
                const asArray = Object.entries(progress)
                const filtered = asArray.filter(([key, value])=> value.type == "cardio")
                const justCardio = Object.fromEntries(filtered)
                console.log(justCardio)
                return justCardio
            }
        }

        const getData = async()=>{
        //destructure data from supabase
            const user = supabase.auth.user()
            try {
                //read rows from the database
                const { data, error} = await supabase.from('progress').select('*').eq('user_id', user.id)
                progressData.value = data
                if(error) throw error;
                dataLoaded.value =true
                summariseWorkouts(progressData.value)
            }
            catch(error){
                console.warn(error.message)
            }
        }
        getData()
        const convertLottis = (exerciseName) =>{
            const lottis = [{exercise: 'bike', json:bike},{exercise: 'swim', json:swim},{exercise: 'run', json:run}, {exercise: 'walk', json:walk} ]
            for(let i=0 ; i<lottis.length; i++){
            if(lottis[i].exercise === exerciseName){
                return lottis[i].json
            }
            }
        }

         const summariseWorkouts = (progressData) =>{

            let totalProgress={}
      
            progressData.forEach(({progress})=>{
                for(const exercise in progress){
                    if(!totalProgress[exercise]){
                        totalProgress[exercise] = progress[exercise]
                    }
                    else{
                        if(totalProgress[exercise].type === "strength"){
                            totalProgress[exercise].totalReps += progress[exercise].totalReps
                            if (progress[exercise].maxWeight > totalProgress[exercise].maxWeight){
                                totalProgress[exercise].maxWeight = progress[exercise].maxWeight
                            }
                        }
                        else{

                            totalProgress[exercise].totalDistance += progress[exercise].totalDistance
                            totalProgress[exercise].totalDuration += progress[exercise].totalDuration
                            if(progress[exercise].maxPace > totalProgress[exercise].maxPace){
                                progress[exercise].maxPace = totalProgress[exercise].maxPace
                            }

                        }

                    }
                }
               
            })

            console.log(totalProgress)
            progress.value=totalProgress
        }
        return{ filterType, progressData, dataLoaded, progress, summariseWorkouts, convertLottis}
    }  
}
</script>

<style>


</style>
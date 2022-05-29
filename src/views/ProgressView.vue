<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div>
            <h2 class="py-3">Strength Exercises</h2>
        </div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-6 py-3">Exercise</th>
                    <th class="px-6 py-3">Total Reps</th>
                    <th class="px-6 py-3">Max Weight</th>
                    <th class="px-6 py-3">visual</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="(exercise, key) in progress" :key="key">
                    <td v-if="exercise.type=='strength'" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{{key}}</td>
                    <td v-if="exercise.type=='strength'" >{{exercise.totalReps}}</td>
                    <td v-if="exercise.type=='strength'">{{exercise.maxWeight}}Kg</td>
                    <td v-if="exercise.type=='strength'"><img class="object-scale-down h-20 w-20" :src="exercise.gifUrl"></td>
                </tr>
            </tbody>
        </table>
         <div>
            <h2 class="py-3">Cardio Exercises</h2>
        </div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-6 py-3">Exercise</th>
                    <th class="px-6 py-3">Total Distance</th>
                    <th class="px-6 py-3">Total Time</th>
                    <th class="px-6 py-3">Fastest Pace</th>
                    <th class="px-6 py-3">Visual</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="(exercise, key) in progress" :key="key">
                    <td v-if="exercise.type=='cardio'" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{{key}}</td>
                    <td v-if="exercise.type=='cardio'" >{{exercise.totalDuration}}</td>
                    <td v-if="exercise.type=='cardio'">{{exercise.totalDistance}}</td>
                    <td v-if="exercise.type=='cardio'">{{exercise.maxPace}}</td>
                    <td v-if="exercise.type=='cardio'"><Vue3Lottie :animationData="convertLottis(key)" :height="100" :width="100" /></td>
                </tr>
            </tbody>
        </table>
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
        return{progressData, dataLoaded, progress, summariseWorkouts, convertLottis}
    }  
}
</script>

<style lang="scss" scoped>

</style>
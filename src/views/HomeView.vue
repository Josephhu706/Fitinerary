<template>

  <div v-if="!user">
    <HomePageLayout/>
    <HomePageFeatures/>
    <HomePageCTA/>
  </div>
  <div v-else-if="dataLoaded" class="container mt-10 px-4 pb-6">
    <!-- no data -->
    <div v-if="data.length === 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Get off your fat ass...</h1>
      <!-- redirects you to create a workout -->
      <router-Link class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-indigo-600 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600" :to="{name: 'createWorkout'}">Create Workout</router-Link>
    </div>
    <!-- data -->
    <div v-else>
      <div class="max-w-7xl mb-10 mx-auto py-5 md:flex-row lg:py-5 lg:flex lg:items-center lg:justify-between">
        <div>
          <span class="block font-extrabold leading-tight text-4xl mt-0 mb-2">My Workout Collection</span>
          <span class="block mt-2 max-w-2xl text-l text-gray-500">Create, view and edit your workouts</span>
        </div>
        <div class="mt-5">
          <router-link class="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" :to="{name: 'createWorkout'}">
            Create Workout
          </router-link>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- loop through data array from workouts we got from database and display them -->
        <div class="flex flex-col rounded-lg items-center bg-gray-50 p-8 shadow-md"  v-for="(workout, index) in data" :key="index">
          <!-- Cardio -->
          <!-- if workout type is cardio then show this image  -->
          <div class="bg-cyan-300 rounded-full" v-if="workout.workoutType === 'cardio'">
            <img  src="@/assets/images/Cardio.svg" class="h-24 w-auto">
          </div>
          <!-- else if the workout type is strength training show this image -->
          <div class="bg-violet-300 rounded-full" v-else>
            <img  src="@/assets/images/strength.svg" class="h-24 w-auto" alt="">
          </div>
          <h1 class="mt-4 mb-2 text-center text-xl text-indigo-600">
            {{workout.workoutName}}
          </h1>
          <div v-if="workout.workoutType ==='strength'" class="mt-4">
            <div class="space-x-1 flex">
              <span class="text-center flex items-center mt-6 py-3 px-3 text-xs text-gray-600 bg-gray-300 rounded-full">{{workout.workoutType}}</span>
              <span v-for="(exercise, index) in filterExercises(workout.exercises, workout.workoutType)" :key="index" class=" text-center flex items-center mt-6 py-3 px-3 text-xs text-gray-600 bg-gray-300 rounded-full">{{exercise}}</span>
            </div>
          </div>
          <div v-if="workout.workoutType ==='cardio'" class="mt-4">
            <div class="space-x-1 flex" >
              <span class=" text-center flex items-center mt-6 py-3 px-3 text-xs text-gray-600 bg-gray-300 rounded-full">{{workout.workoutType}}</span>
              <span v-for="(exercise, index) in filterExercises(workout.exercises, workout.workoutType)" :key="index" class=" text-center flex items-center mt-6 py-3 px-3 text-xs text-gray-600 bg-gray-300 rounded-full">{{exercise}}</span>
            </div>
          </div>
          <div class="mt-10">
            <router-link class="bg-transparent hover:bg-violet-200 text-indigo-700 font-semibold hover:text-indigo-700 py-2 px-4 border border-indigo-500 hover:border-transparent rounded" :to="{name:'View-Workout', params:{workoutId: workout.id}}">
              View Workout
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import {supabase} from '../supabase/init'
import {computed} from 'vue'
import store from '../store/index'
import HomePageLayout from '../components/HomePageLayout.vue'
import HomePageFeatures from '../components/HomePageFeatures.vue'
import HomePageCTA from '../components/HomePageCTA.vue'

export default {
  name: "HomeView",
  components: {HomePageLayout, HomePageFeatures, HomePageCTA},
  setup() {
    // Create data / vars state
    const showP = ref(false)
    const data = ref([])
    const dataLoaded = ref(null);
    const user = computed(()=>store.state.user)
    // Get data from supabase

    const getData = async()=>{
      //destructure data from supabase
      const user = supabase.auth.user()
      try {
        //read rows from the database
        const {data: workouts, error} = await supabase.from('workouts').select('*')
        if(error) throw error;
        //fill our workouts array with data from the db
        console.log(workouts)
        console.log(user.id)
        let userWorkouts = workouts.filter((workout)=>workout.user_id == user.id);
        console.log(userWorkouts)
        data.value = userWorkouts
        //set the state to true to confirm we have fetched data from db
        dataLoaded.value =true
      }
      catch(error){
        console.warn(error.message)
      }
    }

    // Run data function
    getData();

    const filterExercises = (exercises, type) =>{
      let allExercises = []
      if (type === "strength"){
          exercises.forEach((exercise)=>{
          allExercises.push(exercise.exercise.bodyPart)
        })
      }else{
          exercises.forEach((exercise)=>{
          allExercises.push(exercise.cardioType)
        })
      }
      allExercises.filter((value, index, self)=> self.indexOf(value) === index)
      return allExercises.slice(0,1)
    }

    return {data, dataLoaded, user, showP, filterExercises};
  },
};
</script>

<style>
.fade-enter-from{
  opacity:0
}
.fade-enter-to{
  opacity: 1;
}
.fade-enter-active{
  transition: all 2s ease;
}
</style>
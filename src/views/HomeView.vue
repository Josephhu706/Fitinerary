<template>

  <div v-if="!user">
    <HomePageLayout/>
    <HomePageFeatures/>
    <HomePageCTA/>
  </div>
  <div v-else-if="dataLoaded" class="container mt-10 px-4">
    <!-- no data -->
    <div v-if="data.length === 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Looks Empty Here...</h1>
      <!-- redirects you to create a workout -->
      <router-Link class="mt-6 py-2 px-6 rounded-sm text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green" :to="{name: 'createWorkout'}">Create Workout</router-Link>
    </div>
    <!-- data -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- loop through data array from workouts we got from database and display them -->
      <router-link class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer" :to="{name:'View-Workout', params:{workoutId: workout.id}}" v-for="(workout, index) in data" :key="index">
        <!-- Cardio -->
        <!-- if workout type is cardio then show this image  -->
        <img v-if="workout.workoutType === 'cardio'" src="@/assets/images/running-light-green.png" class="h-24 w-auto">
        <!-- else if the workout type is strength training show this image -->
        <img v-else src="@/assets/images/dumbbell-light-green.png" class="h-24 w-auto" alt="">
        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg">
          {{workout.workoutType}}
        </p>
        <h1 class="mt-8 mb-2 text-center text-xl text-at-light-green">
          {{workout.workoutName}}
        </h1>
      </router-link>
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

    return {data, dataLoaded, user, showP};
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
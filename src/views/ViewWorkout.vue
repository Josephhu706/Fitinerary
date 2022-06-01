<template>
    <div class="viewWorkout max-w-screen-sm mx-auto px-4 py-10">
        <router-link :to="{name: 'home'}" class="bg-transparent mb-6 hover:bg-violet-200 text-indigo-700 inline-flex items-center font-semibold hover:text-indigo-700 py-2 px-4 border border-indigo-500 hover:border-transparent rounded">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
          <span>Back To Home</span>
        </router-link >
<!-- App Message -->
      <div v-if="statusMsg || errorMsg" class="mb-10 p-4 rounded-md shadow-md bg-light-grey">
        <p class='text-at-light-green'>
          {{statusMsg}}
        </p>
        <p class="text-red-500">
          {{errorMsg}}
        </p>
      </div>
      <!-- only show this if we get data from the server -->
      <div v-if="dataLoaded">
        <!-- General Workout Info -->
        <div class="flex flex-col items-center p-8 rounded-md shadow-md bg-light-grey relative">
          <!-- only show these icons if user is logged in -->
          <div v-if="user" class="flex absolute left-8 top-3 gap-x-2">
            <div @click="editMode" class="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer bg-indigo-600 shadow-lg">
              <img class="h-3.5 w-auto" src="@/assets/images/pencil-light.png" alt="">
            </div>
            <div @click='deleteWorkout' class="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer bg-indigo-600 shadow-lg">
              <img class="h-3.5 w-auto" src="@/assets/images/trash-light.png" alt="">
            </div>
          </div>
          <!-- show these depending on the type of workout -->
          <div class=" bg-cyan-300 rounded-full " v-if="data.workoutType === 'cardio'">
            <img class="h-30 w-auto" src="@/assets/images/Cardio.svg" alt="">
          </div>
          <div class=" bg-violet-300 rounded-full " v-else>
            <img class="h-30 w-auto" src="@/assets/images/strength.svg" alt="">
          </div>
          <!-- put the workout type in the span -->
          <span class="mt-6 py-3 px-3 text-xs text-white bg-indigo-600 rounded-full shadow-md">
            {{data.workoutType}}
          </span>

          <div class="w-full mt-6">
            <!-- only show this if edit mode is enabled -->
            <input v-if="edit" v-model="data.workoutName" type="text" class="p-2 w-full text-gray-500 focus:outline-none">
            <h1 v-else class="text-indigo-600 text-2xl text-center">
              {{data.workoutName}}
            </h1>
          </div>

          <!-- SCHEDULING PART -->
        <div class="flex flex-col gap-y-4 w-full mt-5 sm:items-center">
          <div class="scheduling" v-if="data.events.length > 0">
            <transition-group tag = "ul" name="list" appear>
              <div class="flex flex-col gap-x-6  gap-y-2 relative sm:flex-row" v-for="(event, index) in data.events" :key="index">
                <!-- edit date -->
                <div class="flex flex-col">
                  <label for="start" class="mb-1 text-sm text-indigo-600">
                    Workout Date
                  </label>
                  <input v-if="edit" class="p-2 text-gray-500 focus:outline-none" id="date" type="date" v-model="event.start">
                    <p v-else>{{ moment(event.start, "YYYY-MM-DD").format('MMMM D YYYY')}}</p>
                </div>
                <!-- edit start time -->
                <div class="flex flex-col">
                  <label for="start" class="mb-1 text-sm text-indigo-600">
                    Start Time 
                  </label>
                  <input v-if="edit" class="p-2 text-gray-500 focus:outline-none" id="startTime" type="time" v-model="event.startTime">
                    <p v-else>{{momentTime(event.startTime, "hh:mm" ).format("hh:mm a")}}</p>
                </div>
                <div class="flex flex-col">
                  <label for="start" class="mb-1 text-sm text-indigo-600">
                    End Time 
                  </label>
                  <input v-if="edit" class="p-2 text-gray-500 focus:outline-none" id="endTime" type="time" v-model="event.endTime">
                    <p v-else>{{momentTime(event.endTime, "hh:mm" ).format("hh:mm a")}}</p>
                </div>
                <div v-if="edit" class="flex flex-col pt-5">
                  <svg  @click="deleteEvent(event.id)" class="h-6 w-auto cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
              </div>
            </transition-group>
          </div>
          <div v-else>
            <h2>Nothing scheduled for this workout....</h2>
          </div>
        </div>
         <button @click="addEvent" v-if="edit" type="button" class=" mt-3 w-full py-2 px-6 rounded-md text-sm text-violet-600 bg-violet-200 duration-200 border-solid border-2 font-medium border-transparent hover:border-violet-800 hover:bg-white hover:text-violet-800">Add Schedule</button>
      </div>
<!-- ///////////////////////////////////////////////////////////////////////// -->
        <!--Exercises  -->
        <div class="mt-10 p-8 rounded-md flex flex-col
         item-center bg-light-grey shadow-md">
          <!-- Strength Training -->
          <div v-if="data.workoutType === 'strength'" class="flex flex-col gap-y-4 w-full">
            <transition-group tag = "ul" name="list" appear>
              <div class="flex flex-col gap-x-6 relative sm:flex-row" v-for="(item, index) in data.exercises" :key="index">
                
                <div class="flex flex-1 flex-col">
                  <label for="body-part" class="mb-1 text-sm text-indigo-600">
                    Body Part
                  </label>
                  <!-- <input v-if="edit" id="sets" v-model="item.bodyPart" class="p-2 w-full text-gray-500 focus:outline-none" type="text"> -->
                    <select v-if="edit" @change="selectBodyPart(item)" required id="bodyparts" v-model="item.bodyPart" class="p-2 w-full text-gray-500 focus:outline-none" >
                        <option :value="bodypart" v-for="bodypart in bodyparts" :key="bodypart.name">
                            {{bodypart.name}}
                        </option>
                    </select>
                  <p v-else>{{item.bodyPart.name}}</p>
                </div>

                <div class="flex flex-2 flex-col md:w-1/3">
                  <label for="exercise-name" class="mb-1 text-sm text-indigo-600">
                    Exercise
                  </label>
                  <!-- <input v-if="edit" id="exercise-name" v-model="item.exercise" class="p-2 w-full text-gray-500 focus:outline-none" type="text"> -->
                    <select v-if="edit" required id="exerciseFromDB" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.exercise">
                      <option v-for="exercise in item.dbexercises" :key="exercise.name" :value="exercise">
                          {{exercise.name}}
                      </option>
                    </select>
                  
                  <p v-else>{{item.exercise.name}}</p>

                </div>
              <!-- Sets -->
              <div class="flex flex-1 flex-col">
                  <label for="sets" class="mb-1 text-sm text-indigo-600">
                    Sets
                  </label>
                  <input v-if="edit" id="sets" v-model="item.sets" class="p-2 w-full text-gray-500 focus:outline-none" type="number">
                  <p v-else>{{item.sets}}</p>
                </div>
                <!-- reps -->
                <div class="flex flex-1 flex-col">
                  <label for="reps" class="mb-1 text-sm text-indigo-600">
                    Reps
                  </label>
                  <input v-if="edit" id="reps" v-model="item.reps" class="p-2 w-full text-gray-500 focus:outline-none" type="number">
                  <p v-else>{{item.reps}}</p>
                </div>
                <!-- Weight -->
                <div class="flex flex-1 flex-col">
                  <label for="weight" class="mb-1 text-sm text-indigo-600">
                    Weight kg
                  </label>
                  <input v-if="edit" id="weight" v-model="item.weight" class="p-2 w-full text-gray-500 focus:outline-none" type="number">
                  <p v-else>{{item.weight}}</p>
                </div>
                <div v-if="!edit" class="relative">
                    <img class="gifUrl rounded-md sm:bottom-0 sm:left-0" :src="item.exercise.gifUrl" alt="">
                </div>
                <!-- only in edit mode -->
                <div v-if="edit" class="flex flex-col pt-5">
                  <svg  @click="deleteExercise(item.id)" class="h-6 w-auto cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                <!-- onclick add exercise -->
              </div>
            </transition-group>
             <button @click="addExercise" v-if="edit" type="button" class="py-2 px-6 rounded-md text-sm text-violet-800 bg-violet-200 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Add Exercise</button>
          </div>

          <!--\\\\\\\\\\ Cardio //////////////// -->
          <div v-else class="flex flex-col gap-y-4 w-full">
            <transition-group tag = "ul" name="list" appear>
              <div class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row" v-for="(item, index) in data.exercises" :key="index">
                <div class="flex flex-1 flex-col md:w-1/3">
                  <label for="cardioType" class="mb-1 text-sm text-indigo-600">
                    Type
                  </label>
                  <select v-if="edit" id="cardioType" v-model="item.cardioType" class="p-2 w-full text-gray-500 focus:outline-none">
                    <option value="#">Select Type</option>
                    <option value="run">Run</option>
                    <option value="walk">Walk</option>
                    <option value="swim">swim</option>
                    <option value="bike">bike</option>
                  </select>
                  <p v-else>{{item.cardioType}}</p>
                </div>
                <!-- Distance -->
              <div class="flex flex-1 flex-col">
                  <label for="distance" class="mb-1 text-sm text-indigo-600">
                    Distance km
                  </label>
                  <input v-if="edit" id="distance" v-model="item.distance" class="p-2 w-full text-gray-500 focus:outline-none" type="number">
                  <p v-else>{{item.distance}}</p>
                </div>
                <!-- duration -->
                <div class="flex flex-1 flex-col">
                  <label for="duration" class="mb-1 text-sm text-indigo-600">
                    Duration min
                  </label>
                  <input v-if="edit" id="duration" v-model="item.duration" class="p-2 w-full text-gray-500 focus:outline-none" type="number">
                  <p v-else>{{item.duration}}</p>
                </div> 
                <!-- pace -->
                <div class="flex flex-1 flex-col">
                  <label for="pace" class="mb-1 text-sm text-indigo-600">
                    Pace km/hr
                  </label>
                  <input v-if="edit" id="pace" v-model="item.pace" class="p-2 w-full text-gray-500 focus:outline-none" type="number">
                  <p v-else>{{item.pace}}</p>
                </div>
                <!-- LOTTI ANIMATION -->
                <div v-if="!edit" class="flex flex-1 flex-col">
                  <Vue3Lottie :animationData="convertLottis(item.cardioType)" :height="100" :width="100" />
                </div>
                <!-- only in edit mode -->
                <div v-if="edit" class="flex flex-col pt-5">
                  <svg  @click="deleteExercise(item.id)" class="h-6 w-auto cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
              </div>
            </transition-group>
            <button @click='addExercise' v-if="edit" type="button" class="py-2 px-6 rounded-md text-sm text-violet-800 bg-violet-200 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Add Exercise</button>
          </div>
        </div>
        <div v-if="edit" class=" mt-6 flex items-start justify-center">
           <button @click='update' type="button" class=" px-6 py-3 rounded-lg text-sm text-white bg-indigo-600 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Update Workout</button>
        </div>
          <!-- update -->
      </div>
    </div>
</template>

<script>
import {ref, computed} from 'vue'
import {supabase} from '../supabase/init'
import {useRoute, useRouter} from 'vue-router'
import { v4 as uuidv4 } from 'uuid';
import store from '../store/index'
import moment from 'moment'
import bike from '../assets/lotti/bike'
import run from '../assets/lotti/run.json'
import swim from '../assets/lotti/swim.json'
import walk from '../assets/lotti/walk.json'

export default {
  name: "View-Workout",
  data(){
    return{
      bike,
      run,
      swim,
      walk
    }
  },
  setup() {
    const bodyparts=ref([{name:"Back", query:"back"},{name:"BodyWeight", query:"cardio"},{name:"Chest", query:"chest"},{name:"Lower Arms", query:"lower%20arms"},{name:"Lower Legs", query:"lower%20legs"},{name:"Neck", query:"neck"},{name:"Shoulders", query:"shoulders"},{name:"Upper Arms", query:"upper%20arms"},{name:"Upper Legs", query:"upper%20legs"},{name:"Waist", query:"waist"}])
    // Create data / vars use params to make a call to superbase
    //data will be the object returned from supabase which is our workout
    const data = ref(null)
    //state for loading data from supabase, don't load data till supa base loaded
    const dataLoaded = ref(null)
    const errorMsg = ref(null)
    const statusMsg = ref(null)
    //allows access to route
    const route = useRoute();
    const user = computed(()=>store.state.user)
    const router = useRouter()

    // Get current Id of route. This is the ID OF OUR CURRENT WORKOUT
    const currentId = route.params.workoutId
    // Get workout data

    const getData = async()=>{
      //destructure data from supabase
      try {
        //read rows from the database for workouts but select by id and only the currentId of the workout
        const {data: workouts, error} = await supabase.from('workouts').select('*').eq('id', currentId)
        if(error) throw error;
        //fill our workouts array with data from the db. 
        //data returned from superbase is an array, we only want the first object
        data.value = workouts[0];
        //set the state to true to confirm we have fetched data from db
        dataLoaded.value =true
        console.log(data.value)
      }
      catch(error){
        //set errorMsg state as error message
        errorMsg.value = error.message
        setTimeout(()=>{errorMsg.value = false}, 5000)
      }
    }

    //call the function

    getData();

    const addEvent = () =>{
      data.value.events.push({
          id: uuidv4(),
          start:"",
          startTime:"",
          endTime:"",
      });
      return
    }

    const deleteEvent = (id) =>{
      //check that the user has a minimum of 2 exercises in their workout
      // filter exercises and keep only the exercises that don't have the id
      data.value.events = data.value.events.filter(event => event.id !== id)
      return;
    }

    // Delete workout
    const deleteWorkout = async () =>{
      try{
        //delete the workout row from the database
        const {error} = await supabase.from('workouts').delete().eq('id', currentId);
        if (error) throw error;
        //redirect to home page after deleting workout
        router.push({name: 'home'})
      }
      catch(error){
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(()=>{
          errorMsg.value = false
        }, 5000)
      }
    }

    // Edit mode

    const edit = ref(null);

    //like a toggle mode
    const editMode = ()=>{
      edit.value = !edit.value
    }

    // Add exercise(same as the create exercise function mostly)
    //we use data.value because 
    const addExercise = () =>{
      console.log(data.value)
      //cardio and strength will have two different object types
      if (data.value.workoutType === 'strength'){
        //this is the strength training exercise object we will create
        //same as the creat exercise
        data.value.exercises.push({
          id: uuidv4(),
          bodyPart:{},
          exercise: {},
          sets: "",
          reps: "",
          weight: "",
          dbexercises:[],
          gifUrl:""
        });
        return
      }
      else{
        data.value.exercises.push({
            id: uuidv4(),
            cardioType: "",
            distance: "",
            duration: "",
            pace: "",
        })
      }
    }
  const convertLottis = (exerciseName) =>{
    const lottis = [{exercise: 'bike', json:bike},{exercise: 'swim', json:swim},{exercise: 'run', json:run}, {exercise: 'walk', json:walk} ]
    for(let i=0 ; i<lottis.length; i++){
      if(lottis[i].exercise === exerciseName){
        return lottis[i].json
      }
    }
  }

    // Delete exercise
  const deleteExercise = (id) =>{
    //check that the user has a minimum of 2 exercises in their workout
    if (data.value.exercises.length > 1){
        // filter exercises and keep only the exercises that don't have the id
        data.value.exercises = data.value.exercises.filter(exercise => exercise.id !== id)
        return;
    }
    //set the errorMsg above to throw an error
    errorMsg.value = "Error: Cannot remove, need to at least have one exercise"
    setTimeout(()=>{
        errorMsg.value = false;
    }, 5000)
  }

    const selectBodyPart = async (item) =>{

        const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${item.bodyPart.query}`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': process.env.VUE_APP_RAPIDAPI_URL,
                    'x-rapidapi-key': process.env.VUE_APP_RAPIDAPI_KEY
                }
            }
        )
        console.log(response)
        const data = await response.json();
        console.log(data)
        item.dbexercises=data.slice(0,15)
    }


  // Update Workout
  const update = async () =>{
    try{
      const {error} = await supabase.from('workouts').update({
        //update the workoutName and exercises columns for the specific workout id
        workoutName: data.value.workoutName,
        exercises: data.value.exercises,
        events: data.value.events
      }).eq('id', currentId)
      if(error) throw error;
      //turn off edit mode after we update the workout
      edit.value = false
      statusMsg.value = "success: Workout Updated!"
      setTimeout(()=>{
        statusMsg.value = false;
      }, 5000)
    }
    catch(error){
      errorMsg.value = `Error: ${error.message}`;
      setTimeout(()=>{
        errorMsg.value = false;
      }, 5000)
    }
  }

    return {statusMsg,
    data,
    dataLoaded,
    errorMsg,
    edit,
    editMode,
    user,
    deleteWorkout,
    addExercise,
    deleteExercise,
    update,
    bodyparts,
    selectBodyPart,
    convertLottis,
    addEvent,
    deleteEvent
 };
  },
  methods:{
    moment: function(date, format){
      return moment(date, format)
    },
    momentTime: function(time, format){
      return moment(time, format)
    }
  }

}
</script>

<style>
.list-enter-from{
    opacity:0;
    transform: scale(0.6)
}
.list-enter-to{
    opacity: 1;
    transform: scale(1)
}
.list-enter-active{
    transition: all 0.4s ease;
}
.list-leave-from{
    opacity:1;
    transform: scale(1)
}
.list-leave-to{
    opacity: 0;
    transform: scale(0.6);
}
.list-leave-active{
    transition: all 0.4s ease;
    position: absolute;
}
.list-move{
    transition: all 0.3s ease;
}
.gifUrl{
  height: 100px
}

</style>
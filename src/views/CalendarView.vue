<template>
<div class="max-w-screen-lg mx-auto px-4 py-10">
    <div class="max-w-7xl mb-10 mx-auto py-5 lg:py-5 lg:flex lg:items-center lg:justify-between">
      <div>
        <span class="block font-extrabold leading-tight text-4xl mt-0 mb-2">My Workout Schedule</span>
        <span class="block mt-2 max-w-2xl text-l text-gray-500">View planned workouts, reschedule and complete your workouts!</span>
      </div>
      <div class="mt-5">
        <router-link class="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" :to="{name: 'createWorkout'}">
          Create Workout
        </router-link>
      </div>
    </div>
</div>
<div class="px-8 md:mb-6">
    <vue-cal :selected-date="currentDate"
            class=" vuecal--blue-theme"
            active-view="month"
            :time-from="12"
            :time-to="12 * 60"
            :disable-views="['years', 'year']"
            :events="events"
            events-on-month-view="short"
            :on-event-click="onEventClick">
    </vue-cal>
</div>
    <!-- modal NEEDS SOME ANIMATION -->
    <transition name="modal">
      <div v-if="showDialog" id="overlay" class="modalOverlay bg-black bg-opacity-80 z-50 inset-0 flex justify-center items-center">
          <div v-if="!playAnimation" class="relative bg-white w-auto py-10 px-10 rounded shadow-xl text-gray-800 border-2">
            <div class="flex flex-shrink-0 justify-between items-center">
              <h3 class="text-lg font-bold">{{selectedEvent.title}}</h3>
              <h3 class="text-lg font-bold">{{selectedEvent.start && selectedEvent.start.format('DD/MM/YYYY')}}</h3>
              <svg @click="closeModal" id="close-modal" class="xIcon w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="py-4">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="mt-2 text-sm">
              <p class="leading-loose" v-html="selectedEvent.contentFull"/>
            </div>
            <div class="py-4">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="flex gap-x-1" v-if="!edit">
              <button @click="editMode" class="bg-white hover:bg-violet-200 text-violet-800 border-2 border-violet-800 font-bold py-2 px-4 rounded">Reschedule</button>
              <button @click="animateComplete" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Completed!</button>
              <button @click="deleteEvent" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete Event</button>
            </div>
            <div v-else>
              <div class="flex flex-col gap-x-6 relative">       
                <div class="flex flex-col flex-1">
                    <label class="mb-1 text-sm text-gray-800">Pick a date</label>
                    <input v-model="editEvent.start" type="date" class="p-2 text-gray-500 focus:outline-none" id="date" required>
                </div>
                <div class="flex flex-col flex-1">
                    <label for="startTime" class="mb-1 text-sm text-gray-800">Pick a start time</label>
                    <input v-model="editEvent.startTime" type="time" class="p-2 text-gray-500 focus:outline-none" id="startTime" required>
                </div>
                <div class="flex flex-col flex-1">
                    <label for="endTime" class="mb-1 text-sm text-gray-800">Pick a end time</label>
                    <input v-model="editEvent.endTime" type="time" class="p-2 text-gray-500 focus:outline-none" id="endTime" required>
                </div>
                 <button @click="rescheduleEvent" class="bg-white hover:bg-violet-200 text-violet-800 border-2 border-violet-800 font-bold py-2 px-4 rounded">Reschedule</button>
              </div>    
            </div>
          </div>
          <div v-else class="bg-white py-7 px-7 rounded-full shadow-xl text-gray-800 w-fit border-2">
            <Vue3Lottie :animationData="excellent" :height="150" />
          </div>
      </div>
    </transition>

</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import {ref} from 'vue'
import {supabase} from '../supabase/init'
import {computed} from 'vue'
import store from '../store/index'
import excellent from '../assets/lotti/excellent.json'
import lodash from 'lodash'
export default {
    name:'calendarView',
    components: { VueCal },
   setup() {
     const edit = ref(false)
    // Create data / vars state
    const selectedEvent = ref({})
    const showDialog = ref(false)
    const currentDate = new Date().toISOString().substr(0, 10)
    const data = ref([])
    const dataLoaded = ref(null);
    const user = computed(()=>store.state.user)
    // Get data from supabase
    const events = ref([])
    const currentWorkout = ref(null)
    const editEvent = ref(null)
    const currentWorkoutProgress = ref({})
    const playAnimation = ref(false)

    const animateComplete = () =>{
      playAnimation.value=true
      setTimeout(()=>{
        playAnimation.value=false
        completeEvent();
      },2000)
    }

    function onEventClick (event, e) {
      console.log(event.workoutId)
      let workoutId = event.workoutId
      data.value.forEach(workout => workout.id === workoutId? currentWorkout.value=workout : "")
      currentWorkoutProgress.value = currentWorkout.value.progress
      selectedEvent.value = event
      showDialog.value = true
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    }

    const closeModal=()=>{
      currentWorkout.value = null
      showDialog.value = false
      edit.value = false
    }

    const deleteEvent=()=>{
      let eventId = selectedEvent.value.id
      console.log(eventId)
      events.value.forEach((event, index)=>event.id == eventId? events.value.splice(index, 1):'')
      currentWorkout.value.events.forEach((event, index)=>event.id == eventId? currentWorkout.value.events.splice(index, 1):'')
      console.log(events.value)
      updateWorkout()
      closeModal()
    }

    const completeEvent=()=>{
      if (currentWorkoutProgress.value == null){
        currentWorkoutProgress.value = {}
      }
      let workoutExercises = currentWorkout.value.exercises
      let progress = []
      workoutExercises.forEach((exercise)=>{
        console.log(exercise)
        let summary={}
        summary.type = currentWorkout.value.workoutType
        if(currentWorkout. value.workoutType === "strength"){
          summary.name = exercise.exercise.name
          summary.totalReps = parseInt(exercise.reps)*parseInt(exercise.sets)
          summary.weight = parseInt(exercise.weight)
          summary.gifUrl = exercise.exercise.gifUrl
        }else{
          console.log(currentWorkout.value.cardioType)
          summary.name = exercise.cardioType
          summary.distance = parseInt(exercise.distance)
          summary.duration = parseInt(exercise.duration)
          summary.pace = parseInt(exercise.pace)
        }
        progress.push(summary)
      })
      console.log(progress)
      let currentProgress = currentWorkoutProgress.value
      
      progress.forEach((summary)=>{
        console.log(summary)
        if(!currentProgress[summary.name]){
          if(summary.type ==="strength"){
            console.log(summary.name)
              currentProgress[summary.name] = {
              type: summary.type,
              totalReps: summary.totalReps,
              maxWeight: summary.weight,
              gifUrl: summary.gifUrl
            }
          }
          else{
            console.log(summary.name)
            currentProgress[summary.name] = {
              type: summary.type,
              totalDistance: summary.distance,
              totalDuration: summary.duration,
              maxPace: summary.pace
            }
          }
        }
        else{
          if(summary.type === "strength"){
            currentProgress[summary.name].totalReps += parseInt(summary.totalReps)
            if(summary.weight > currentProgress[summary.name].maxWeight){
              currentProgress[summary.name].maxWeight = parseInt(summary.weight)
            }
          }
          else{
            currentProgress[summary.name].totalDistance += parseInt(summary.distance)
            currentProgress[summary.name].totalDuration += parseInt(summary.duration)
            if(summary.pace > currentProgress[summary.name].maxPace){
              currentProgress[summary.name].maxPace = parseInt(summary.pace)
            }
          }
        }
      })
      console.log(currentProgress)
      currentWorkoutProgress.value = currentProgress
      currentWorkout.value.progress = currentWorkoutProgress.value
      updateProgress();
      deleteEvent();
      closeModal();
    }

    const updateProgress = async () =>{
      const user = supabase.auth.user()
      try{
        const {error} = await supabase.from('progress').insert([
          {
            user_id: user.id,
            progress: currentWorkoutProgress.value
          }
        ])
        if(error) throw error;
      }
      catch(error){
       console.log(error)
      }
    }

     // Update Workout
    const updateWorkout = async () =>{
      try{
        const {error} = await supabase.from('workouts').update({
          events: currentWorkout.value.events
        }).eq('id', currentWorkout.value.id)
        if(error) throw error;
      }
      catch(error){
       console.log(error)
      }
    }

    const editMode = () =>{
      edit.value= true
      let searchEvents = currentWorkout.value.events
      searchEvents.forEach((event)=>{
        if(event.id == selectedEvent.value.id){
          editEvent.value = event
        }
      })
    }

    const rescheduleEvent = () =>{
      let currentWorkoutEvents = currentWorkout.value.events
      currentWorkoutEvents.forEach((event)=>{
        if(event.id === editEvent.value.id){
          event = editEvent.value
        }
      })
      events.value.forEach((event)=>{
        if(event.id === editEvent.value.id){
          event.start = editEvent.value.start+" "+editEvent.value.startTime
          event.end = editEvent.value.start+" "+editEvent.value.endTime
        }
      })
      updateWorkout()
      closeModal()
    }


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
        data.value = userWorkouts
        console.log(userWorkouts)
        data.value.forEach((workout)=>{
          buildEvent(workout)
        })
        //set the state to true to confirm we have fetched data from db
        dataLoaded.value =true
      }
      catch(error){
        console.warn(error.message)
      }
    }

    const buildEvent = (workout) =>{
      let newEvents = []
        workout.events.forEach((event)=>{
          let freshEvent = {}
          freshEvent.workoutId = workout.id
          freshEvent.id = event.id
          freshEvent.start = event.start+" "+event.startTime
          freshEvent.end = event.start+" "+event.endTime
          freshEvent.title = workout.workoutName
          freshEvent.class = workout.workoutType
          let eventContent = `<strong>${lodash.capitalize(workout.workoutType)} Workout:</strong><br><ul>`
            workout.exercises.forEach((exercise, index)=>{
              //if last item in the array
              if(index==workout.exercises.length-1){
                
                if(workout.workoutType==='strength'){
                  let lastLi = `<li>${lodash.capitalize(exercise.exercise.name)}'s: ${exercise.sets} sets of ${exercise.reps} reps at ${exercise.weight}kg.</li></ul>`
                  eventContent+=lastLi
                }
                else{
                  let lastLi = `<li>Go for a ${exercise.duration} minute ${exercise.cardioType}: ${exercise.distance} kms at a ${exercise.pace} pace.</li></ul>`
                  eventContent+=lastLi
                }
              }
              else{
                if (workout.workoutType === 'strength'){
                  let newLi = `<li>${lodash.capitalize(exercise.exercise.name)}'s: ${exercise.sets} sets of ${exercise.reps} reps at ${exercise.weight}kg.</li>`
                  eventContent+=newLi
                }
                else{
                  let newLi = `<li>Go for a ${exercise.duration} minute ${exercise.cardioType}: ${exercise.distance} kms at a ${exercise.pace} km/hr pace.</li>`
                  eventContent+=newLi
                }
              }
            })
          freshEvent.contentFull = eventContent
          newEvents.push(freshEvent)
        })
        events.value= [...events.value, ...newEvents]
      }
    // // Run data function
    getData();

    return {
    excellent, 
    playAnimation, 
    animateComplete,
    updateProgress,
    currentWorkoutProgress,
    completeEvent, 
    rescheduleEvent, 
    edit, 
    editEvent, 
    editMode, 
    data, 
    dataLoaded, 
    user, events, 
    getData, 
    currentDate, 
    buildEvent, 
    currentWorkout, 
    onEventClick, 
    selectedEvent, 
    showDialog, 
    closeModal, 
    deleteEvent};
  },
}
</script>

<style>
.modalOverlay{
  height: 100%;
  width: 100%;
  position: fixed; /* Stay in place */
  left: 0;
  top: 0;
  overflow-x: hidden; /* Disable horizontal scroll */
}
.xIcon{
  cursor:pointer;
}
.modal-enter-from{
    opacity:0;
    transform: scale(0.6)
}
.modal-enter-to{
    opacity: 1;
    transform: scale(1)
}
.modal-enter-active{
    transition: all 0.4s ease;
}
.modal-leave-from{
    opacity:1;
    transform: scale(1)
}
.modal-leave-to{
    opacity: 0;
    transform: scale(0.6);
}
.modal-leave-active{
    transition: all 0.4s ease;
    position: absolute;
}
.modal-move{
    transition: all 0.3s ease;
}

.vuecal--month-view .vuecal__cell {height: 80px;}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {padding: 4px;}
.vuecal--month-view .vuecal__no-event {display: none;}
.vuecal__event {cursor: pointer;}

.vuecal__event-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event-content {
  font-style: italic;
}
.vuecal__event.strength {background-color: rgba(	165, 180, 252);border: 1px solid rgb(165, 180, 252);color: #fff;}
.vuecal__event.cardio {background-color: rgba(103, 232, 249);border: 1px solid rgb(103, 232, 249);color: #fff;}
</style>
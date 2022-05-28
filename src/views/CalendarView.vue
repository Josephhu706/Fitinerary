<template>
    <vue-cal :selected-date="currentDate"
            class=" vuecal--blue-theme"
            active-view="month"
            :time-from="9 * 60"
            :time-to="19 * 60"
            :disable-views="['years', 'year']"
            :events="events"
            events-on-month-view="short"
            :on-event-click="onEventClick">
    </vue-cal>

    <!-- modal NEEDS SOME ANIMATION ZOOM IN-OUT-->
    <transition name="modal">
      <div v-if="showDialog" id="overlay" class=" fixed bg-black bg-opacity-80 z-50 absolute inset-0 flex justify-center items-center">
          <div class="bg-white w-5/12 py-7 px-7 rounded shadow-xl text-gray-800 w-fit border-2">
            <div class="flex justify-between items-center">
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
            <div>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Reschedule</button>
              <button @click="deleteEvent" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete Event</button>
            </div>
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

export default {
    name:'calendarView',
    components: { VueCal },
   setup() {
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

    function onEventClick (event, e) {
      console.log(event.workoutId)
      let workoutId = event.workoutId
      data.value.forEach(workout => workout.id === workoutId? currentWorkout.value=workout : "")
      selectedEvent.value = event
      showDialog.value = true
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    }

    const closeModal=()=>{
      currentWorkout.value = null
      showDialog.value = false
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

     // Update Workout
    const updateWorkout = async () =>{
      try{
        const {error} = await supabase.from('workouts').update({
          //update the workoutName and exercises columns for the specific workout id
          events: currentWorkout.value.events
        }).eq('id', currentWorkout.value.id)
        if(error) throw error;
      }
      catch(error){
       console.log(error)
      }
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
          let eventContent = `<strong>${workout.workoutType} workout:</strong><br><ul>`
            workout.exercises.forEach((exercise, index)=>{
              //if last item in the array
              if(index==workout.exercises.length-1){
                if(workout.workoutType==='strength'){
                  let lastLi = `<li>${exercise.exercise.name}'s: ${exercise.sets} sets of ${exercise.reps} reps.</li></ul>`
                  eventContent+=lastLi
                }
                else{
                  let lastLi = `<li>Go for a ${exercise.duration} minute ${exercise.cardioType}: ${exercise.distance} kms at a ${exercise.pace} pace.</li></ul>`
                  eventContent+=lastLi
                }
              }
              else{
                if (workout.workoutType === 'strength'){
                  let newLi = `<li>${exercise.exercise.name}'s: ${exercise.sets} sets of ${exercise.reps} reps.</li>`
                  eventContent+=newLi
                }
                else{
                  let newLi = `<li>Go for a ${exercise.duration} minute ${exercise.cardioType}: ${exercise.distance} kms at a ${exercise.pace} pace.</li>`
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

    return {data, dataLoaded, user, events, getData, currentDate, buildEvent, currentWorkout, onEventClick, selectedEvent, showDialog, closeModal, deleteEvent};
  },
}
</script>

<style>
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
.vuecal__event.strength {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}
.vuecal__event.cardio {background-color: rgba(255, 102, 102, 0.9);border: 1px solid rgb(235, 82, 82);color: #fff;}
</style>
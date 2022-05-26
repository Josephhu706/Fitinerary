<template>
    <vue-cal :selected-date="currentDate"
            class=" vuecal--green-theme"
            active-view="month"
            :time-from="9 * 60"
            :time-to="19 * 60"
            :disable-views="['years', 'year']"
            :events="events"
            events-on-month-view="short"
            :on-event-click="onEventClick">
    </vue-cal>

    <!-- modal NEEDS SOME ANIMATION ZOOM IN-OUT-->
    <div v-if="showDialog" id="overlay" class=" fixed bg-black bg-opacity-50 z-50 absolute inset-0 flex justify-center items-center" @click="closeModal">
      <div class="bg-gray-200 max-w-sm py-2 px-3 rounded shadow-xl text-gray-800">
        <div class="flex justify-between items-center">
          <h4 class="text-lg font-bold">{{selectedEvent.title}}</h4>
          <h4 class="text-lg font-bold">{{selectedEvent.start && selectedEvent.start.format('DD/MM/YYYY')}}</h4>
          <svg @click="closeModal" id="close-modal" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="mt-2 text-sm">
          <p v-html="selectedEvent.contentFull"/>
        </div>
        <!-- <div class="mt-3 flex justify-end space-x-3">
          <button class="px-3 py-1 bg-red-300 hover:bg-red-300 hover:bg-opacity-50 hover:text-red-900 rounded">Cancel</button>
          <button class="px-3 py-1 bg-red-800 text-gray-200 hover:bg-red-600 rounded">Delete</button>
        </div>  -->
      </div>
    </div>

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
    data:()=>({
      selectedEvent: {},
      showDialog:false,
    }),
    methods:{
    onEventClick (event, e) {
      this.selectedEvent = event
      this.showDialog = true
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    },
    closeModal(){
      this.showDialog = false
    },

    },
   setup() {
    // Create data / vars state
    const currentDate = new Date().toISOString().substr(0, 10)
    const data = ref([])
    const dataLoaded = ref(null);
    const user = computed(()=>store.state.user)
    // Get data from supabase
    const events = ref([])

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
        userWorkouts.forEach((workout)=>{
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
            freshEvent.id = event.id
            freshEvent.start = event.start+" "+event.startTime
            freshEvent.end = event.start+" "+event.endTime
            freshEvent.title = workout.workoutName
            freshEvent.class = workout.workoutType
            let eventContent = `${workout.workoutType} workout: <br><ul>`

            workout.exercises.forEach((exercise, index)=>{
              //if last item in the array
              if(index==workout.exercises.length-1){
                let lastLi = `<li>${exercise.exercise.name}'s: ${exercise.sets} sets of ${exercise.reps} reps.</li></ul>`
                eventContent+=lastLi
              }
              else{
                let newLi = `<li>${exercise.exercise.name}'s: ${exercise.sets} sets of ${exercise.reps} reps.</li>`
                eventContent+=newLi
              }

            })

            freshEvent.contentFull = eventContent
            newEvents.push(freshEvent)
        })

        console.log(newEvents)

        events.value= [...events.value, ...newEvents]
      }
    // // Run data function
    getData();

    return {data, dataLoaded, user, events, getData, currentDate};
  },
}
</script>

<style>
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
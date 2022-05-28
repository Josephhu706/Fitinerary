<template>
    <div class="max-w-screen-md mx-auto px-4 py-10">
        <!-- status Message -->
        <!-- only display this div if the workout was created successfully or unsuccessfully -->
        <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-light-grey rounded-md shadow-lg">
            <!-- success/error message message -->
            <p class="text-at-light-green">{{statusMsg}}</p>
            <p class="text-red-500">{{errorMsg}}</p>
        </div>
        <!-- exercise creation -->
        <div class="p-8 flex items-start bg-light-grey rounded-md shadow-lg">
            <!-- form -->
            <!-- prevent form from submitting and run createworkout function  -->
            <form @submit.prevent="createWorkout" class="flex flex-col gap-y-5 w-full">
                <h1 class="text-2xl text-indigo-600">Record Workout</h1>

                <!-- workoutname -->
                <!-- v-model lets us set state to whatever the value in this input is -->
                <div class="flex flex-col">
                    <label for="workout-name" class="mb-1 text-sm text-indigo-600">Workout Name</label>
                    <input type="text" class="p-2 text-gray-500 focus:outline-none" id="workout" v-model="workoutName" required>
                </div>



                <!-- start date -->
            <div class="flex flex-col gap-y-5">
            <transition-group tag = "div" name="list" appear>
                <div class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" v-for="(event,index) in events" :key="index">
                    <div class="flex flex-col flex-1">
                        <label for="startDate" class="mb-1 text-sm text-indigo-600">Pick a date</label>
                        <input type="date" class="p-2 text-gray-500 focus:outline-none" id="date" v-model="event.start" required>
                    </div>
                    <div class="flex flex-col flex-1">
                        <label for="startTime" class="mb-1 text-sm text-indigo-600">Pick a start time</label>
                        <input type="time" class="p-2 text-gray-500 focus:outline-none" id="startTime" v-model="event.startTime" required>
                    </div>
                    <div class="flex flex-col flex-1">
                        <label for="endTime" class="mb-1 text-sm text-indigo-600">Pick a end time</label>
                        <input type="time" class="p-2 text-gray-500 focus:outline-none" id="endTime" v-model="event.endTime" required>
                    </div>
                    <img @click="deleteEvent(event.id)" src="@/assets/images/trash-light-green.png" class="h-4 w-auto absolute -left-5 cursor-pointer">
                </div> 
                </transition-group>
                <button @click="addEvent" type="button" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-indigo-600 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Add Schedule</button>
            </div>
                


                <!-- workout type -->

            <div class="flex flex-col">
                <label for="workout-type" class="mb-1 text-sm text-indigo-600">Workout Type</label>
                <select @change="workoutChange"  id="workout-type" class="p-2 text-gray-500 focus:outline-none" v-model="workoutType" required>
                    <option value="select-workout">Select Workout</option>
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                </select>
            </div>

                <!-- Strength training Inputs -->
                <div v-if="workoutType === 'strength'" class="flex flex-col gap-y-5">
                    <transition-group tag="div" name="list" appear>
                        <div class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" v-for="(item,index) in exercises" :key="index">

                            <div class="flex-col flex">
                                <label for="bodyPart" class="mb-1 text-sm text-indigo-600">Choose a Body Part</label>
                                    <select required id="bodyparts" v-model="item.bodyPart" class="p-2 w-full text-gray-500 focus:outline-none" @change="selectBodyPart(item)">
                                        <option>select body part</option>
                                        <option :value="bodypart" v-for="bodypart in bodyparts" :key="bodypart.name">
                                            {{bodypart.name}}
                                        </option>
                                    </select>
                            </div>

                            <div class="flex flex-col flex-1">
                            <label for="exercise" class="mb-1 text-sm text-indigo-600">Exercises</label>
                                <select required id="exerciseFromDB" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.exercise">
                                    <option v-for="exercise in item.dbexercises" :key="exercise.name" :value="exercise">
                                        {{exercise.name}}
                                    </option>
                                </select>
                            </div>

                            <div class="flex flex-col flex-1">
                                <label for="sets" class="mb-1 text-sm text-indigo-600">Sets</label>
                                <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.sets">
                            </div>

                            <div class="flex flex-col flex-1">
                                <label for="reps" class="mb-1 text-sm text-indigo-600">Reps</label>
                                <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.reps">
                            </div>

                            <div class="flex flex-col flex-1 mb-8">
                                <label for="weight" class="mb-1 text-sm text-indigo-600">Weight (Kg's)</label>
                                <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.weight">
                            </div>
                            <img @click="deleteExercise(item.id)" src="@/assets/images/trash-light-green.png" class="h-4 w-auto absolute -left-5 cursor-pointer">
                        </div>
                    </transition-group>
                    <button @click="addExercise" type="button" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-indigo-600 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Add Exercise</button>
                </div>

                <!--Cardio training inputs-->
                <div v-if="workoutType === 'cardio'" class="flex flex-col gap-y-4">
                    <div class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row" v-for="(item,index) in exercises" :key="index">
                        <div class="flex flex-col md:w-1/3">
                            <label for="cardio-type" class="mb-1 text-sm text-indigo-600">Type</label>
                            <select id="cardio-type" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.cardioType">
                                <option value="#">Select Type</option>
                                <option value="run">Run</option>
                                <option value="walk">Walk</option>
                                <option value="swim">swim</option>
                                <option value="bike">bike</option>
                            </select>
                        </div>

                        <div class="flex flex-col flex-1">
                            <label for="distance" class="mb-1 text-sm text-indigo-600">Distance</label>
                            <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.distance">
                        </div>

                        <div class="flex flex-col flex-1"> 
                            <label for="duration" class="mb-1 text-sm text-indigo-600">Duration</label>
                            <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.duration">
                        </div>

                        <div class="flex flex-col flex-1">
                            <label for="pace" class="mb-1 text-sm text-indigo-600">Pace</label>
                            <input required type="text" class="p-2 w-full text-gray-500 focus:outline-none" v-model="item.pace">
                        </div>
                        <img @click="deleteExercise(item.id)" src="@/assets/images/trash-light-green.png" class="h-4 w-auto absolute -left-5 cursor-pointer">
                    </div>
                    <button @click="addExercise" type="button" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-indigo-600 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Add Exercise</button>
                </div>
                <button type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-indigo-600 duration-200 border-solid border-2 border-transparent hover:border-indigo-600 hover:bg-white hover:text-indigo-600">Record Workout</button>
            </form>
        </div>
    </div>
</template>

<script>
// ref makes our data reactive
import {ref, onMounted} from 'vue'
import { v4 as uuidv4 } from 'uuid';
import {supabase} from '../supabase/init'
export default {
    name: "createWorkout",
    setup(){
        //create data state
        const workoutName = ref('')
        const workoutType = ref('select-workout')
        const exercises = ref([]);
        const events = ref([])
        const statusMsg = ref(null)
        const errorMsg = ref(null)
        const bodyparts=ref([{name:"Back", query:"back"},{name:"BodyWeight", query:"cardio"},{name:"Chest", query:"chest"},{name:"Lower Arms", query:"lower%20arms"},{name:"Lower Legs", query:"lower%20legs"},{name:"Neck", query:"neck"},{name:"Shoulders", query:"shoulders"},{name:"Upper Arms", query:"upper%20arms"},{name:"Upper Legs", query:"upper%20legs"},{name:"Waist", query:"waist"}])
        const DBexercises=ref([])
        const bodypartType=ref('')

        onMounted(()=>{
            addEvent();
        })
        //Add Exercise function
        const addExercise = () =>{
            //cardio and strength will have two different object types
            if (workoutType.value === 'strength'){
                //this is the strength training exercise object we will create
                exercises.value.push({
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
                exercises.value.push({
                    id: uuidv4(),
                    cardioType: "",
                    distance: "",
                    duration: "",
                    pace: "",
                })
            }
        }

        const addEvent = () =>{
            events.value.push({
                id: uuidv4(),
                start:"",
                startTime:"",
                endTime:"",
            });
            return
        
        }

        const deleteEvent = (id) =>{
            //check that the user has a minimum of 2 exercises in their workout
            if (events.value.length > 1){
                // filter exercises and keep only the exercises that don't have the id
                events.value = events.value.filter(event => event.id !== id)
                return;
            }
            //set the errorMsg above to throw an error
            errorMsg.value = "Error: Cannot remove, need to at least have one schedule"
            setTimeout(()=>{
                errorMsg.value = false;
            }, 5000)
        }

        //Listens for changing of workout type input
        const workoutChange = () =>{
            //reset exercises state array back to an empty array when we select a different type of exercise
            exercises.value = [];
            // call exercise to have inputs display
            addExercise();
        }

        const selectBodyPart = async (item) =>{

            console.log(item)
            const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${item.bodyPart.query}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': process.env.VUE_APP_RAPIDAPI_URL,
                        'x-rapidapi-key': process.env.VUE_APP_RAPIDAPI_KEY
                    }
                }
            )
            const data = await response.json();
            item.dbexercises=data.slice(0,15)
        }

        //delete the exercise when we click on trashcan based on exercise id

        const deleteExercise = (id) =>{
            //check that the user has a minimum of 2 exercises in their workout
            if (exercises.value.length > 1){
                // filter exercises and keep only the exercises that don't have the id
                exercises.value = exercises.value.filter(exercise => exercise.id !== id)
                return;
            }
            //set the errorMsg above to throw an error
            errorMsg.value = "Error: Cannot remove, need to at least have one exercise"
            setTimeout(()=>{
                errorMsg.value = false;
            }, 5000)
        }
        
        //Create workout
        //we need to create a new row in our workouts database
        const createWorkout = async() =>{
            const user = supabase.auth.user()
            try {
                //destructure error. This is the column we are sending to the database
                const {error} = await supabase.from('workouts').insert([
                    {
                        //this is from our state
                        workoutName: workoutName.value,
                        workoutType: workoutType.value,
                        exercises: exercises.value,
                        events: events.value,
                        user_id: user.id
                    },
                ]);
                if (error) throw error;
                //update success status message
                statusMsg.value = "Success: Workout Created!";
                //reset state
                events.value=[]
                workoutName.value = null;
                workoutType.value = "select-workout";
                exercises.value = []
                setTimeout(()=>{
                    statusMsg.value = false;
                }, 5000)
            } catch(error){
                errorMsg.value = `Error: ${error.message}`;
                setTimeout(()=>{
                    errorMsg.value = false;
                }, 5000)
            }
        }

        return {
            workoutName,
            workoutType,
            exercises,
            statusMsg,
            errorMsg,
            addExercise,
            workoutChange,
            deleteExercise,
            createWorkout,
            bodyparts,
            DBexercises,
            bodypartType,
            selectBodyPart,
            events,
            addEvent,
            deleteEvent,

        };
    }

};
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
</style>
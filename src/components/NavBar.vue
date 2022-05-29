<template>
    <header class="bg-cyan-700 text-white">
        <nav class="container py-2 px-4 flex flex-col gap-4 items-center sm:flex-row">
            <div class='flex items-center gap-x-4'>
                <img class="w-14" src="../assets/images/Logo.svg" alt="">
                <h1 class="text-lg">Fitinerary</h1>
            </div>
            <ul class="flex flex-1 justify-end gap-x-10">
                <router-link class="cursor-pointer" :to="{name: 'home'}">Home</router-link>
                <!-- only render this link if the user is logged in -->
                <router-link v-if="user" class="cursor-pointer" :to="{name: 'createWorkout'}">Create</router-link>
                <!-- only render this link if user is logged out -->
                <router-link v-if="user" class="cursor-pointer" :to="{name: 'calendarView'}">Schedule</router-link>
                <router-link v-if="user" class="cursor-pointer" :to="{name: 'progressView'}">Progress</router-link>
                <router-link v-if="!user" class="cursor-pointer" :to="{name: 'loginForm'}">Login</router-link>
                <!-- only render this link if the user is logged in -->
                <li v-if="user" @click="logout" class="cursor-pointer">Logout</li>
            </ul>
        </nav>
    </header>
</template>

<script>
import store from '../store/index'
import {computed} from 'vue'
import {supabase} from '../supabase/init'
import {useRouter} from 'vue-router'

export default {
    setup(){

        //set up ref to router
        const router = useRouter();
        //references our user from the session store
        const user = computed(()=>store.state.user)
        //logout function
        const logout = async () =>{
            await supabase.auth.signOut();
            
            router.push({name:'home'})
        }

        return{
            logout,
            user,
        };
    },
};
</script>

<style lang="scss" scoped>

</style>
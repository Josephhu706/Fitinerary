<template>
    <div class="max-w-screen-sm mx-auto px-4 py-10">
        <!-- Error Handling -->
        <!-- only show this dif if there is an error message -->
        <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
            <p class="text-red-500">{{errorMsg}}</p>
        </div>
        <!-- registration form -->
        <!-- onsubmit also has prevent default and calls the register function -->
        <form @submit.prevent="register" class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">

            <h1 class="text-3xl text-at-light-green mb-4">Register</h1>
            <div class="flex flex-col mb-2">
                <label for="email" class="mb-1 text-sm text-at-light-green">Email</label>
                <input type="text" required class="p-2 text-gray-500 focus:outline-none" id="email" v-model="email">
            </div>
             <div class="flex flex-col mb-2">
                <label for="password" class="mb-1 text-sm text-at-light-green">Password</label>
                <input type="password" required class="p-2 text-gray-500 focus:outline-none" id="password" v-model="password">
            </div>
             <div class="flex flex-col mb-2">
                <label for="confirmPassword" class="mb-1 text-sm text-at-light-green">Confirm Password</label>
                <input type="password" required class="p-2 text-gray-500 focus:outline-none" id="confirmPassword" v-model="confirmPassword">
            </div>
            <button type="submit" class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-at-light-green duration-200 border-solid border-2 border-transparent hover:border-at-light-green hover:bg-white hover:text-at-light-green">Register</button>
            
            <router-link class="text-sm mt-6 text-center" :to="{name: 'loginForm'}">
            Already Have An Account? <span class="text-at-light-green">Login</span>
        </router-link>
        </form>
    </div>
</template>

<script>
import {ref} from 'vue';
import {supabase} from '../supabase/init'
import {useRouter} from 'vue-router'

export default {
name: "registerForm",
  setup() {
    // Create data / vars
    //use router method to reroute user
    const router = useRouter();
    const email = ref(null)
    const password = ref(null)
    const confirmPassword = ref(null);
    const errorMsg = ref(null)
    // Register function
    const register = async() =>{
        // if the passwords match
        if (password.value === confirmPassword.value){
            try{
                //use supabase authentication
                const {error} = await supabase.auth.signUp({
                    email: email.value,
                    password: password.value,
                });
                //if there is an error throw an error
                if (error) throw error;
                //if login is unsuccessful, redirect them to the login form
                router.push({name: 'loginForm'})

            }catch(error){
                //sets our errorMsg value as the error message
                errorMsg.value = error.message;
                setTimeout(()=>{
                    errorMsg.value = null;
                },5000)
            }
            return;
        }
        errorMsg.value = "Error: Passwords do not match"
        setTimeout(()=>{
            errorMsg.value = null;
        },5000)
    };
    return {
        email,
        password,
        confirmPassword,
        errorMsg,
        register
    };
  },      
};
</script>

<style lang="scss" scoped>

</style>
<template>

  <!-- only show the navbar if the app is ready -->
    <div v-if="appReady" class="min-h-full font-Poppins box-border">
      <NavBar/>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <div :key="route.name">
          <component :is="Component"/>
        </div>
      </transition>
    </router-view>

</template>

<script>
import NavBar from './components/NavBar.vue'
import {ref} from 'vue';
import {supabase} from './supabase/init'
import store from './store/index'

export default{
  components:{
    NavBar,
  },
  setup(){
    //When our app is first running we set our appReady variable to null, which prevents our application from rendering
    const appReady = ref(null);
    //We are then checking to see if our user is logged in
    const user = supabase.auth.user();
    //if user does not exist, make the application ready for a new user which renders the app
    if(!user){
      appReady.value = true;
    }
    //if there is a user then the session authentication function is fired which sents a session for the current user
    //session authentication function fires when logged in
    supabase.auth.onAuthStateChange((_, session)=>{
      console.log('creating session')
      //creates the session using our session store
      //stores the user in the session store
        store.methods.setUser(session);
        //then sets the app as ready so the app can render
        appReady.value = true;
    })
    return{
      appReady,

    };
  },
};
</script>

<style lang="scss">

.fade-enter-from,
.fade-leave-to{
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.2s ease-out;
}



</style>
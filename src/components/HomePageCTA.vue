<template>
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="bg-gray-50">
  <div class="max-w-7xl mx-auto py-3 px-4 items-center sm:px-6 lg:py-3 lg:px-8 lg:flex lg:items-center lg:justify-between">
    <div class="flex items-center">
      <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span class="block">Do you even lift bro?</span>
        <span class="block text-indigo-600">Sign up today.</span>
      </h2>
      <div class="inline-block items-center">
        <Vue3Lottie :animationData="liftbro" :height="200" :width="200" />
      </div>
    </div>
    <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
      <div class="inline-flex rounded-md shadow">
       <router-link class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" :to="{name: 'loginForm'}">
          Get Started
      </router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import liftbro from '../assets/lotti/liftbro.json'
    export default {
      setup(){
        return{
          liftbro
        }
      }

        
    }
</script>

<style lang="scss" scoped>

</style>
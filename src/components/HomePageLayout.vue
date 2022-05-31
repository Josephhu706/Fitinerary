<template>
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="relative bg-white overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
      <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div class="sm:text-center lg:text-left">
          <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block xl:inline">Visualise and Plan</span> <span class="block text-indigo-600 xl:inline">Your Workouts</span>
          </h1>
          <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">Make the most out of your busy schedule by creating comprehensive workout plans with guided visuals and calendar view.</p>
          <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div class="rounded-md shadow">
              <router-link class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10" :to="{name: 'registerForm'}"> Create my Workout </router-link>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  <div class="lg:absolute flex xl:pr-52 lg:inset-y-0 lg:right-0 lg:w-1/2">
    <Vue3Lottie :animationData="avocado" />
  </div>
</div>
</template>

<script>
import avocado from '../assets/lotti/avocado.json'
    export default {

      setup(){
        return{
          avocado,
        }
      }
        
    }
</script>

<style lang="scss" scoped>

</style>
import { createRouter, createWebHistory } from "vue-router";
import {supabase} from '../supabase/init'
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue"
import AboutView from "../views/AboutView.vue"
import RegisterView from "../views/RegisterView.vue"
import CreateView from "../views/CreateView.vue"
import ViewWorkout from '../views/ViewWorkout.vue'
import CalendarView from '../views/CalendarView.vue'
import ProgressView from '../views/ProgressView.vue'

const routes = [{
        path: "/",
        name: "home",
        component: HomeView,
        meta:{
            title: "home",
            auth: false,
        }
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: AboutView,
        meta:{
            title: "about",
            auth: false,
        }
    },
    {
        path: "/login",
        name: "loginForm",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: LoginView,
        meta:{
            title: "loginForm",
            auth: false,
        }
    },
    {
        path: "/register",
        name: "registerForm",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: RegisterView,
        meta:{
            title: "registerForm",
            auth: false,
        }
    },
    {  
        path: "/create",
        name: "createWorkout",
        component: CreateView,
        meta:{
            title: "createWorkout",
            //this is the only route we don't want to let people go on if they are not logged in
            //this is how we route guard so people can't visit pages if they're not authenticated
            auth: true
        }
    },
    {
        //need to use params
        path: "/view-workout/:workoutId",
        name: "View-Workout",
        component: ViewWorkout,
        meta:{
            title: "View-Workout",
            auth: false
        }
    },
    {  
        path: "/calendar",
        name: "calendarView",
        component: CalendarView,
        meta:{
            title: "calendarview",
            //this is the only route we don't want to let people go on if they are not logged in
            //this is how we route guard so people can't visit pages if they're not authenticated
            auth: true
        }
    },
    {  
        path: "/progress",
        name: "progressView",
        component: ProgressView,
        meta:{
            title: "progressview",
            //this is the only route we don't want to let people go on if they are not logged in
            //this is how we route guard so people can't visit pages if they're not authenticated
            auth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

//change document titles. Router before each method adds the document titles to the browser
router.beforeEach((to, form, next) =>{
    document.title = `${to.meta.title} | Active Tracker`;
    next()
})

//Route guard for auth routes
router.beforeEach((to, from, next)=>{
    const user = supabase.auth.user();
    //check if a route requires authentication
    if(to.matched.some((res)=>res.meta.auth)){
        //if true it means the route requires authentication
        if(user){
            next();
            return
        }
        // else redirect them to the login page
        next({name: "loginForm"})
        return
    }
    //if not requiring authentication, pass them to the page
    next();
})

export default router;
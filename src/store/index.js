import { reactive } from 'vue';
//this is like the state of the user. 
const state = reactive({
    user: null,
});

const methods = {
    setUser(session) {
        //if the session is true, create the session, else set the session to null
        state.user = session ? session.user : null;
    }
}
export default {
    state,
    methods

};
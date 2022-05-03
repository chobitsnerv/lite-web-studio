import {createRouter, createWebHashHistory} from 'vue-router'
import HomePage from "@/views/HomePage/HomePage"
import SongCollectionPage from "@/views/SongCollection/SongCollectionPage"
import SearchPage from "@/views/Search/SearchPage.vue";
export const router = createRouter({
  history:createWebHashHistory(),
  routes:[
    {path:'/',component:HomePage},
    {path:'/songlist',component:SongCollectionPage},
    {path:'/search',component:SearchPage}
  ]
})
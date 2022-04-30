import {createRouter, createWebHashHistory} from 'vue-router'
import HomePage from "@/views/HomePage/HomePage"
import SongCollectionPage from "@/views/SongCollection/SongCollectionPage"
export const router = createRouter({
  history:createWebHashHistory(),
  routes:[
    {path:'/',component:HomePage},
    {path:'/songlist',component:SongCollectionPage}
  ]
})
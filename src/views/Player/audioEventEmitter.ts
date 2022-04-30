import {Song} from "@/types/HomePage/HomePageTypes";

type FUNC=(...args:any)=>any
export interface PlayState{
  playIndex:number
  nowPlaying:Song|null
  elapsed:number
  nextToPlay:Song|null
  state:'playing'|'stopped'|'loading',
  duration:number
}
export class AudioEventEmitter{
  private static _instance=new AudioEventEmitter()
  static getInstance(){
    return AudioEventEmitter._instance
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  _eventMap:Map<string,FUNC[]>=new Map();
  on(type:string,cb:FUNC){
    if(!this._eventMap.has(type)){
      this._eventMap.set(type,[])
    }
    this._eventMap.get(type)!.push(cb)
  }
  off(type:string,cb:FUNC){
    if(this._eventMap.has(type)){
      const arr=this._eventMap.get(type)!
      const index=arr.indexOf(cb)
      if(index>=0){
        arr.splice(index,1)
      }
    }
  }
  dispatch(type:string,payload:any){
    if(this._eventMap.has(type)){
      this._eventMap.get(type)!.forEach(v=>v(payload))
    }
  }

  playState:PlayState={
    playIndex:0,
    nowPlaying:null,
    elapsed:0,
    nextToPlay:null,
    state:'loading',
    duration:0
  }
}

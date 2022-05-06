<template>
  <div ref="maskRef" class="createMenuListBox-mask" @click="onMaskClicked">
    <div class="list-body">
      <div class="title">
        创建歌单
      </div>
      <div class="content">
        <input placeholder="输入歌单名称" class="content-input" type="text">
      </div>
      <div class="title-image">
        <div class="title-image-desc">
          选择你的封面:(默认随机)
        </div>
        <div ref="imgRef" :style="{backgroundColor:colorSubstitute}" class="title-image-defaultImg" @click="onImgChooserClicked">
        </div>
      </div>
      <div class="tools">
        <div class="cancelButton" @click="onCancelButtonClick">
          取消
        </div>
        <div class="confirmButton">
          确定
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name:"CreateMusicListModalBox"
})
</script>
<script lang="ts" setup>
const maskRef=ref<HTMLDivElement>()
const imgRef=ref<HTMLDivElement>()
const imgUsed=ref<HTMLImageElement>()
const colorSubstitute=["#E799B0","#576690","#B8A6D9","#BD7D74","#9AC8E2"][Math.floor(5*Math.random())];
const emit=defineEmits<{
  (e:'close'):void
}>()
function onMaskClicked(e:MouseEvent){
  if(e.target===maskRef.value){
    emit('close')
  }
}
function onCancelButtonClick(){
  emit('close')
}
function onImgChooserClicked(){
  const input=document.createElement('input')
  input.type='file'
  document.body.appendChild(input)
  input.accept="image/jpeg,image/png,image/gif"
  input.click()
  input.onchange=function(){
    const reader=new FileReader()
    reader.onload=function(){
      if(imgRef.value){
        if(imgUsed.value){
          imgUsed.value.src=`${reader.result}`
        }else{
          const img=new Image(80,80)
          imgUsed.value=img
          img.src=`${reader.result}`
          imgRef.value.appendChild(img)
        }
      }
    }
    if(input.files&&input.files[0]){
      reader.readAsDataURL(input.files[0])
    }
  }
}
</script>
<style lang="scss" scoped>
.createMenuListBox-mask{
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.25);
  position: absolute;
  top:0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  .list-body{
    width: 300px;
    height: 230px;
    background-color: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding:6px;
    .title{
      text-align: center;
    }
    .content{
      text-align: center;
      margin-top: 10px;
      .content-input{
        width: 90%;
        outline: none;
        border:1px solid transparent;
        padding: 4px;
        background-color: rgb(248,248,248);
        border-radius: 4px;
        font-size: 14px;
        &:focus{
          border:1px solid rgb(0,127,255);
          background-color: white;
        }
      }

    }
    .title-image{
      margin-top:6px;
      margin-left: 8px;
      .title-image-desc{
          margin-bottom: 6px;
      }
      .title-image-defaultImg{
        margin:0 auto;
        width: 80px;
        height: 80px;
        border-radius: 8px;
      }
    }
    .tools{
      margin-top:12px;
      display: flex;
      justify-content: flex-end;
      .confirmButton,.cancelButton{
        box-sizing: border-box;
        margin-right: 8px;
        margin-left: 12px;
        font-size: 14px;
        border:1px solid black;
        border-radius: 4px;
        padding: 4px 8px;
      }
    }
  }
}
</style>


cc.Class({
    extends: cc.Component,

    properties: {
      // 重力
      gravity:0.5,
      // 小鸟跳动
      jump:6.6,
      // 动画名称
      AnimName:"",
      // 弹跳音效
      jumpAudio:{
        default:null,
        url:cc.AudioClip,
      }
    },
    onLoad () {
      let anim = this.getComponent(cc.Animation)
      anim.play(this.AnimName)
      // 获取屏幕尺寸
      let size = cc.winSize;
      let box = this.node.getBoundingBox()
      this.top = size.height/2 - box.height/2
      this.velocity = 0
    },
    birdDead(){
      let anim = this.getComponent(cc.Animation)
      anim.stop(this.AnimName)
    },
    getBirdBottom(){
      let box = this.node.getBoundingBox()
      let bottom = box.y
      return bottom
    },
    birdDrop(dt){
      this.node.y += (this.velocity)
      if(this.node.y > this.top){
        this.node.y = this.top
      }
      this.velocity -= (this.gravity)
    },
    birdJump(){
      this.velocity = this.jump
      if(this.jumpAudio){
        cc.audioEngine.playEffect(this.jumpAudio,false)
      }
    },
});

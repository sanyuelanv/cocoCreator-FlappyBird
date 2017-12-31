import Config from "Config"
cc.Class({
    extends: cc.Component,
    properties: {
      floors:{
        default: [],
        type:[cc.Node]
      },
    },
    onLoad () {
      // 获取屏幕宽度
      this._size = cc.winSize
      //获取该节点里面为cc.Sprite 类型的 元素
      let item = this.floors[0]
      let floorImage = item.getComponent(cc.Sprite)
      //获取地板图片的宽度
      this._width = floorImage.spriteFrame.getRect().width
      this.boxTop = this.getFloorTop()
      this.updateTimes = 0
    },
    //获取地板顶部的y坐标：用于小鸟坠地死亡判断
    getFloorTop(){
      // 注意这里获取x/y并不是从描点出发的，而是在左下角为原点出发的
      let box = this.floors[0].getBoundingBox()
      let top = box.y + box.height
      return top
    },
    // updae 地板移动
    updateFloor(dt){
      this.updateTimes += dt
      if(this.updateTimes >= Config.FLOOR_MOVE_INTERVAL){
        this.floorMove()
        this.updateTimes = 0
      }
    },
    // 地板移动
    floorMove(){
      this.floors[0].x += Config.FLOOR_VX
      this.floors[1].x += Config.FLOOR_VX
      // 元素的最右侧 对齐 游戏界面的 0坐标
      if(this.floors[0].x + this._width / 2 < -this._size.width/2){
        // 去到下一个的最右侧
        this.floors[0].x = this.floors[1].x + this._width - 5;
      }
      if(this.floors[1].x + this._width / 2 < -this._size.width/2){
        this.floors[1].x = this.floors[0].x + this._width - 5;
      }
    },
});

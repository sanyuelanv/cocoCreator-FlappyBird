import Bird from 'Bird'
import Floor from 'Floor'
import PipesNode from 'PipesNode'
import Config from "Config"
import Storage from "Storage"
cc.Class({
  extends: cc.Component,
  properties: {
    scoreScaleDuration:0.4,
    // 开始游戏菜单节点
    startMenu: {
      default: null,
      type: cc.Node
    },
    // 当前分数标签
    scoreText: {
      default: null,
      type: cc.Label
    },
    // 最高分分数标签
    highScoreText: {
      default: null,
      type: cc.Label
    },
    // 小鸟节点
    bird: {
      default: null,
      type: Bird
    },
    //地板节点
    floor: {
      default: null,
      type: Floor
    },
    //管道节点
    pipesNode: {
      default: null,
      type: PipesNode
    },
    // 游戏结束文案节点
    gameOverText: {
      default: null,
      type: cc.Label
    }
  },
  onLoad() {
    //绑定一个触摸事件
    this.node.on("touchstart", this._onTouchStart, this)
    // 初始化 游戏开始标志 / 结束标志
    this.isStart = false
    this.isOver = false
    this.size = cc.winSize;
    this.currentScore = 0
    this.updateTimes = 0
    this.highScore = Storage.getHighScore()
    this.highScoreText.string = `${Config.HIGHSCORE}:${this.highScore}`
  },
  //点击屏幕事件
  _onTouchStart(event) {
    // 游戏开始了，并且木有结束的时候调用 小鸟的跳跃事件
    if (!this.isOver && this.isStart) {
      this.bird.birdJump()
    }

  },
  // 判断小鸟是否接触到地板
  _collisionFloor(bird, floor) {
    if (bird.getBirdBottom() <= floor.boxTop) {
      this.gameOver()
    }
  },
  // 游戏结束 标志更改 -> 小鸟死亡 -> 显示游戏结束文案 -> Xs后重新载入当前场景
  gameOver() {
    this.isOver = true
    this.bird.birdDead()
    this.gameOverText.string = Config.OVERTEXT
    if( this.currentScore > this.highScore ){
      Storage.setHighScore(this.currentScore)
    }
    this.schedule(() => {
      cc.director.loadScene('main')
    }, Config.RESTARTTIME)
  },
  // 开始游戏
  onStartGame() {
    // 隐藏 开始游戏菜单节点
    this.startMenu.active = false
    // 显示 当前分数节点
    this.scoreText.string = `${Config.SCORE}:${this.currentScore}`
    // 开启 开始标志
    this.isStart = true
  },
  // 更新管道移动逻辑
  _updatePipeMove(dt){
    this.updateTimes += dt
    if(this.updateTimes >= Config.FLOOR_MOVE_INTERVAL){
      this._pipeMove()
      this.updateTimes = 0
    }
  },
  //指定时间内去移动管道 & 判断碰撞
  _pipeMove(){
    let pipes = this.pipesNode.pipes
    for (let i = 0; i < pipes.length; i++) {
      // 当前管道所在的节点
      let pipeNode = pipes[i]
      pipeNode.x += Config.FLOOR_VX
      // 获取小鸟和管道节点的 rect
      let birdRect = this.bird.node.getBoundingBox();
      let pipeNodeRect = pipeNode.getBoundingBox();
      //判断两者有没有碰撞
      if (cc.Intersection.rectRect(birdRect,pipeNodeRect)) {
        this.gameOver()
        return
      }

      // 获取当前管道的对象
      let pipe = pipeNode.getComponent('Pipe');
      // 没有碰撞,并且通过了，加分
      if( pipeNode.x < this.bird.node.x &&  pipe.isPassed === false && pipe.type === Config.PIPE_UP){
        pipe.isPassed = true;
        this._addScore()
      }
      // console.log(pipe);
      //超出屏幕的，从数组移除 / 在节点上删除 / 回归对象池
      if (pipeNode.x < -( this.size.width/2 + this.pipesNode.rect.width/2)){
        this.pipesNode.pipes.splice(i, 1)
        // 注意这里是 this.pipesNode.node 去解绑子组件，而不是this.pipesNode
        this.pipesNode.node.removeChild(pipeNode, true)
        switch (pipe.type) {
          case Config.PIPE_UP:
            this.pipesNode.pipeUpPool.put(pipeNode)
            break;
          case Config.PIPE_DOWN:
            this.pipesNode.pipeDownPool.put(pipeNode)
            break;
        }
      }
    }
  },
  // 加分
  _addScore(){
    if (this.isOver) return
    this.currentScore ++
    this.scoreText.string = `${Config.SCORE}:${this.currentScore}`
    let act1 = cc.scaleTo(this.scoreScaleDuration,1.1,0.6)
    let act2 = cc.scaleTo(this.scoreScaleDuration,0.8,1.2)
    let act3 = cc.scaleTo(this.scoreScaleDuration,1,1)
    this.scoreText.node.runAction(cc.sequence(act1,act2,act3))
  },
  update(dt) {
    // console.log(this.pipesNode.pipes.length);
    if (this.isOver) return
    if (this.isStart) {
      this.bird.birdDrop(dt)
      this.pipesNode._updateSpawn(dt)
      this._updatePipeMove(dt)
      this._collisionFloor(this.bird, this.floor)
    }
    this.floor.updateFloor(dt)

  },
});

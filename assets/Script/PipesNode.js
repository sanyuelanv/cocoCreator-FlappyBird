import Config from "Config"
cc.Class({
    extends: cc.Component,

    properties: {
      //管道y轴最大偏移值
      pipeMaxOffsetY:150,
      // 上下管道之间最大 /最小距离
      pipeMinDist:80,
      pipeMaxDist:150,
      // 产生管道的时间间隔
      spawnPipeInterval:3,
      // 管道 x 轴 偏移屏幕 距离
      spawnPipesOffsetX:30,
      // 最多同时出现的管道数  因为上下两种：count * 2
      pipesMaxCount:2,
      //管道预制资源数组
      pipesPrefabs:{
        default:[],
        type:[cc.Prefab]
      },
    },

    onLoad () {
      this.pipeUpPool = new cc.NodePool()
      this.pipeDownPool = new cc.NodePool()
      this.size = cc.winSize
      this.spawnTime = this.spawnPipeInterval * 0.8
      this.rect = null
      this.pipes = []
      this._createPool()
    },
    // 生产上下管道
    _spawnPipe(){
      let pipeUp = this._getPipeFromPool(this.pipeUpPool,Config.PIPE_UP)
      let pipeDown = this._getPipeFromPool(this.pipeDownPool,Config.PIPE_DOWN)
      let rndY = cc.random0To1() * this.pipeMaxOffsetY
      let rndDist = (cc.random0To1() * (this.pipeMaxDist - this.pipeMinDist)) + this.pipeMinDist
      let pipeHeight = pipeUp.y * 2
      pipeUp.y += rndY
      pipeDown.y = pipeUp.y - rndDist - pipeHeight
      pipeUp.parent = this.node;
      pipeDown.parent = this.node;
    },
    // 从对象池取出管道
    _getPipeFromPool(pool,type){
      let pipe = null
      if( pool.size() > 0 ){pipe = pool.get()}
      else {
        cc.log("对象池中对象不够用")
        pipe = cc.instantiate(this.pipesPrefabs[type])
      }
      // 设置宽度： 在屏幕最右边 + 偏移值
      var rect = pipe.getComponent('cc.Sprite').spriteFrame.getRect();
      if(this.rect == null){this.rect = rect}
      pipe.x = this.size.width/2 + rect.width/2 + this.spawnPipesOffsetX
      pipe.y = rect.height/2
      pipe.getComponent('Pipe').init(type,false)
      this.pipes.push(pipe)
      return pipe
    },
    // 创建上下两个管道的对象池
    _createPool(){
      for (let i = 0; i < this.pipesMaxCount; i++) {
        let pipeUp = cc.instantiate(this.pipesPrefabs[Config.PIPE_UP])
        let pipeDown = cc.instantiate(this.pipesPrefabs[Config.PIPE_DOWN])
        this.pipeUpPool.put(pipeUp)
        this.pipeDownPool.put(pipeDown)
      }
    },
    //  按照指定速度生产管道
    _updateSpawn(dt){
      this.spawnTime += dt
      if(this.spawnTime >= this.spawnPipeInterval){
        this._spawnPipe()
        this.spawnTime = 0
      }
    },
});

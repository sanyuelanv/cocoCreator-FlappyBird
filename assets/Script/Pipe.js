cc.Class({
    extends: cc.Component,

    properties: {
      isPassed: false,
    },
    // onLoad () {},

    start () {

    },
    init(type,isPassed) {
        // 设置管道的类型（上或下）
        this.type = type
        this.isPassed = isPassed
    },

    // update (dt) {},
});

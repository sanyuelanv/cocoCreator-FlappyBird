let Storage = {
    getHighScore:()=>{
        let score = cc.sys.localStorage.getItem('HighScore') || 0
        return parseInt(score);
    },

    setHighScore:(score)=>{
        cc.sys.localStorage.setItem('HighScore', score);
    }
}

export default Storage

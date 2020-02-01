class ActionLogic {
    //各种运动模式设定的参数
    actionSetting = new Map();
    moveObj = null;

    //运动模式
    constructor(setting,obj){
        this.moveObj = obj;
        //this[setting.Type] = new 
        setting.forEach(s=>{
            let funModel = `
            let setting = this.actionSetting.get("${s.Type}");
            let action = Action.Factory("${s.Action.toUpperCase()}",this.moveObj);
            action.ActionSetting(setting);
    
            this.moveObj.curAction = action;
            `;
            this[s.Type] = new Function(funModel);
            this.actionSetting.set(s.Type,s);
        });
    }

}
/**
 * 抵达 
 * 给定目标和抵达目标的时间，算出平均速度，然后匀速抵达目标
 */
class Arrive extends Action {
    constructor(obj) {
        super(obj);

        this.deceleration = 0;
        this.speed = 0;
        this.angle = 0;

        this.lastDistanceSq = Number.MAX_SAFE_INTEGER;
    }

    //抵达的目标
    //deceleration：抵达目标需要的时间，单位秒
    SetTarget(point, deceleration) {
        if (deceleration) this.deceleration = deceleration;
        this.Target = point;

        this.speed = this.Target.Distance(this.ShowObj) / deceleration / 1000;
        this.angle = this.Target.Minus(this.ShowObj).Normalize().va;
        this.lastDistanceSq = Number.MAX_SAFE_INTEGER;
    }

    ActionSetting(setting) {
        this.deceleration = setting.deceleration;
    }

    ActionUpdate(timeSpan) {
        this.v.Velocity(this.speed * timeSpan, this.angle);
        if (!this.IsArive(timeSpan)) this.Go(timeSpan);
    }

    IsArive(t) {
        if (this.Target == null) return false;
        // const des = this.speed * t;//下一秒将到达的距离
        // var curDistanceSq = this.Target.DistanceSq(this.ShowObj);//当前离目标的距离
        // if (curDistanceSq > this.lastDistanceSq) {
        //     return true;
        // }
        // this.lastDistanceSq = curDistanceSq;
        // return this.lastDistanceSq - des < 0;
        return this.Target.DistanceSq(this.ShowObj) == 0;
    }

    Go(t) {
        if (this.Target == null) return;
        this.ShowObj.AddIn(this.v);
        var curDistanceSq = this.Target.DistanceSq(this.ShowObj);//当前离目标的距离

        //跑过了目标的情况 速度太快的话有，会有越过目标但返回的bug
        if (curDistanceSq > this.lastDistanceSq) {
            this.ShowObj.Copy(this.Target);
        }
        this.lastDistanceSq = curDistanceSq;

        //使朝向与速度一致
        this.ShowObj.r = this.v.va - π_hf;
    }
}
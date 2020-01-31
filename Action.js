class Action {
    constructor(obj) {
        this.Target = null;
        this.ShowObj = obj;
        this.lineSpeed = 0.25;         //线速度px/ms
        this.v = new Vector2D();
        this.v.Velocity(this.lineSpeed, -π_hf);//速度
    }

    ActionUpdate(t) {
        console.warn("[Action]:ActionUpdate 没实际的定义");
    }
    ActionRender(c2d) {
        this.DrawTarget(c2d);
    }

    ActionSetting(setting) {
        if (setting === undefined) return;
        if (setting.lineSpeed !== undefined) this.lineSpeed = setting.lineSpeed;
        if (setting.angle !== undefined) this.v.Velocity(this.lineSpeed, setting.angle);
        if (setting.target !== undefined) this.Target = setting.target;
    }

    SetTarget(point) {
        this.Target = point;
    }

    //是否抵达
    IsArive(t) {
        if (this.Target == null) return false;
        // const des = this.v.speed * t;
        // return this.Target.DistanceSq(this.ShowObj) - des < 0;

        return this.Target.DistanceSq(this.ShowObj) <= 10;
    }

    //按当前速度向前走一小步
    Go(t) {
        this.v.Velocity(this.lineSpeed * t, this.v.va);

        this.ShowObj.AddIn(this.v);
        //使朝向与速度一致
        this.ShowObj.r = this.v.va - π_hf;

    }

    DrawTarget(c2d) {
        if (this.Target != null) {
            c2d.beginPath();
            c2d.moveTo(this.ShowObj.x, this.ShowObj.y);
            c2d.lineTo(this.Target.x, this.Target.y);
            c2d.strokeStyle = 'blue';
            c2d.stroke();
            c2d.beginPath();
            c2d.strokeStyle = 'red';
            c2d.fillStyle = 'black';
            c2d.arc(this.Target.x, this.Target.y, 5, 0, 2 * Math.PI);
            c2d.fill();
            c2d.moveTo(this.Target.x - 10, this.Target.y);
            c2d.lineTo(this.Target.x + 10, this.Target.y);
            c2d.moveTo(this.Target.x, this.Target.y - 10);
            c2d.lineTo(this.Target.x, this.Target.y + 10);
            c2d.closePath();
            c2d.stroke();
        }
    }
}
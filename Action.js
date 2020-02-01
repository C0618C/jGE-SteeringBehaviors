class Action {
    constructor(obj) {
        this.Target = null;             //当前运动的目标点
        this.ShowObj = obj;
        this.lineSpeed = 0.25;         //线速度px/ms
        this.v = new Vector2D();
        this.v.Velocity(this.lineSpeed, -π_hf);//速度
    }

    ActionUpdate(t, world) {
        const w_s = world.GetSetting();
        //环形世界设置
        if (w_s.isRoundWorld) {
            const area = world.GetArea();
            this.AroundTheWorld(area);
        }
    }
    ActionRender(c2d) {
        this.DrawTarget(c2d);
    }

    ActionSetting(setting) {
        if (setting === undefined) return;
        if (setting.LineSpeed !== undefined) this.lineSpeed = setting.LineSpeed;
        if (setting.Angle !== undefined) this.v.Velocity(this.lineSpeed, setting.Angle);
        if (setting.Target !== undefined) this.Target = setting.Target;
    }

    SetTarget(point) {
        this.Target = point;
    }

    //是否抵达
    IsArive(t) {
        if (this.Target == null) return false;
        const des = this.v.speed * t;
        return this.Target.DistanceSq(this.ShowObj) - des < 0 || this.Target.DistanceSq(this.ShowObj) <= 10;
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

    //根据边界，使物体出界后从屏幕另一边回到可视区
    AroundTheWorld(area) {
        this.ShowObj.Copy(this._letThePointInTheViewArea(this.ShowObj, area));
        if (this.Target != null) this.Target.Copy(this._letThePointInTheViewArea(this.Target, area));
    }

    //将一个出界的点映射到可视区内
    _letThePointInTheViewArea(point, area) {
        let newPoint = new Vector2D(point);

        if (newPoint.x >= area.width) { newPoint.x = 0; }
        if (newPoint.x < 0) { newPoint.x = area.width; }
        if (newPoint.y >= area.height) newPoint.y -= area.height;
        if (newPoint.y < 0) newPoint.y = area.height;

        return newPoint;
    }

    //通过名字构造对应的运动模型
    static Factory(actionModel, param) {
        const actionMap = new Map();
        if (typeof (Seek) !== "undefined") actionMap.set(Seek.name.toUpperCase(), Seek);
        if (typeof (Flee) !== "undefined") actionMap.set(Flee.name.toUpperCase(), Flee);
        if (typeof (Arrive) !== "undefined") actionMap.set(Arrive.name.toUpperCase(), Arrive);
        if (typeof (Wander) !== "undefined") actionMap.set(Wander.name.toUpperCase(), Wander);
        if (typeof (FollowPath) !== "undefined") actionMap.set(FollowPath.name.toUpperCase(), FollowPath);
        if (typeof (Pursuit) !== "undefined") actionMap.set(Pursuit.name.toUpperCase(), Pursuit);

        let AC = actionMap.get(actionModel) || Action;
        return new AC(param);
    }
}
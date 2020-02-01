/**
 * 徘徊 
 * 在物体前虚拟一个圆圈，物体移动的目标点落在圆上，通过改变圆的半径和圆心与物体的距离，可以拼凑出比较自然的随机路径
 */
class Wander extends Seek {
    constructor(obj) {
        super(obj);

        this.radius = 50;      //随机半径
        this.distance = 85;    //突出距离
        this.jitter = 10;       //随机位移最大值
        this.tp = new Vector2D();//范围圆心     //不必要，为了方便画出辅助工具

        // this.v = new Proxy(new Vector2D(), {
        //     set: function (target, propKey, value, receiver) {
        //         console.log(`setting ${propKey} = ${value}`);
        //         return Reflect.set(target, propKey, value, receiver);
        //       }
        // })
        // this.v.Velocity(this.lineSpeed, -π_hf);
    }

    ActionSetting(setting) {
        if (setting) {
            super.ActionSetting(setting);

            if (setting.tp) this.tp = setting.tp;
            if (setting.radius) this.radius = setting.radius;
            if (setting.distance) this.distance = setting.distance;
            if (setting.jitter) this.jitter = setting.jitter;
            if (setting.tg) this.tg = setting.tg;
        }
        this.ResetTarget();
    }

    ActionUpdate(timeSpan, world) {
        super.ActionUpdate(timeSpan, world);

        if (this.IsArive(timeSpan) || this.Target == null) this.ResetTarget();
    }

    ActionRender(c2d) {
        this.DrawTarget(c2d);

        c2d.beginPath();
        c2d.arc(this.tp.x, this.tp.y, this.radius, 0, π2);
        c2d.strokeStyle = "#666cc6";
        c2d.stroke();
    }
    SetTarget(point) {
        this.ResetTarget();
    }
    ResetTarget() {
        let r = this.radius;

        //算出圆心实际位置
        this.tp.Copy(this.ShowObj);
        let vs = new Vector2D();
        vs.Velocity(this.distance, this.v.va);
        this.tp.AddIn(vs);

        let x1 = Math.floor(Math.random() * 2 * r) + this.tp.x - r;
        let y1 = 0;

        let x2 = this.tp.x;
        let y2 = this.tp.y;

        y1 = Math.floor(Math.sqrt(r * r - Math.pow(x1 - x2, 2)) * (Math.random() > 0.5 ? 1 : -1) + y2);

        if (Number.isNaN(x1) || Number.isNaN(y1)) { //随机的缘故，有几率会得出NaN值
            this.ResetTarget();
        } else {
            super.SetTarget(new Vector2D(x1, y1));
        }
    }

    //是否抵达
    IsArive(t) {
        if (this.Target == null) return false;


        //当目标点出在屏幕之外的话
        if (this.Target.Minus(this.ShowObj).Length() > this.radius * 2 + this.distance) return true;

        if (super.IsArive(t)) return true;

        return false;
    }

}
/**
 * 可运动对象虚拟体
 * x:初始所处的x坐标
 * y:初始所处的y坐标
 * ActionModel:运动模式，包含：Seek、
 */
class MoveObj extends ShowObj {
    MoveEnvironment = {};       //记录运动场地的一些环境信息

    constructor(args = { x, y, ActionModel, isDebug, setting }) {
        super(args);
        this.curAction = null;

        //显示用的物体（三角形）
        this.l = 10;//三角形外观参数
        this.r = π;//当前物体正方向偏移角度
        this.a = new Vector2D();
        this.b = new Vector2D();
        this.c = new Vector2D();

        //调试用相关
        this.isDebug = args.isDebug || false;
        this._steps = [];
        this.show_color = "green";
        this.area_radius = 130;
        this.aroundTest = false;            //是否打开领域功能

        this.SwitchAction(args.ActionModel, args.setting);

        // this.MoveObjects = null;
    }

    SwitchAction(model, setting) {
        this.curAction = null;
        this.curAction = Action.Factory(model, this);
        this.curAction.ActionSetting(setting);

        if (this.MoveEnvironment.MoveObjectsAction) this.MoveEnvironment.MoveObjectsAction.set(this, model);
    }

    render(c2d) {
        //画轨迹
        if (this._steps.length > 0) {
            c2d.beginPath();
            c2d.moveTo(this._steps[0].x, this._steps[0].y);
            let lastP = this._steps[0];
            for (let s of this._steps) {
                if (s.Minus(lastP).Length() > 500)
                    c2d.moveTo(s.x, s.y);
                else
                    c2d.lineTo(s.x, s.y);
                lastP = s;
            }
            c2d.strokeStyle = "#888888";
            c2d.stroke();
        }

        //领域
        if (this.isDebug && this.aroundTest) {
            c2d.beginPath();
            c2d.arc(this.x, this.y, this.area_radius, 0, π2);
            c2d.strokeStyle = "red";
            c2d.stroke();
        }

        //三角形本体
        c2d.beginPath();
        c2d.moveTo(this.a.x, this.a.y);
        c2d.lineTo(this.b.x, this.b.y);
        c2d.lineTo(this.c.x, this.c.y);
        c2d.fillStyle = this.show_color;
        c2d.fill();

        //渲染辅助用的东西
        if (this.isDebug)
            this.curAction.ActionRender(c2d);
    }

    update(t, world) {

        //计算外形基点
        this.a = this.Add((new Vector2D({ x: 0 * this.l, y: 2 * this.l })).Turn(this.r));
        this.b = this.Add((new Vector2D({ x: -1 * this.l, y: -1.5 * this.l })).Turn(this.r));
        this.c = this.Add((new Vector2D({ x: 1 * this.l, y: -1.5 * this.l })).Turn(this.r));

        //加入轨迹
        if (this.isDebug) {
            var lastPoint = this._steps[this._steps.length - 1];
            if (this._steps.length == 0 || (lastPoint.x != this.x && lastPoint.y != this.y))
                this._steps.push(new Vector2D(this));

            if (this._steps.length >= 1024) this._steps.shift();
        }

        if (this.aroundTest) this.AroundTest();

        return this.curAction.ActionUpdate(t, world);
    }

    SetTarget(point, ...x) {
        this.curAction.SetTarget(point, ...x);
    }



    //检查周围有哪些附近的对象
    LookAround() {
        let aroundObj = new Set();
        let notAround = new Set();
        let r = this.area_radius;
        r *= r;//平方
        this.MoveEnvironment.MoveObjects.forEach(o => {
            if (this == o) return;

            if (this.DistanceSq(o) <= r)
                aroundObj.add(o);
            else
                notAround.add(o);
        });
        return { aroundObj, notAround };
    }


    AroundTest(t) {
        this.show_color = "yellow";
        let info = this.LookAround();

        info.aroundObj.forEach(o => {
            o.show_color = "#f000ef";
            var curAction = this.MoveEnvironment.MoveObjectsAction.get(o);
            if (curAction != "FLEE")
                o.SwitchAction("FLEE", { Target: new Vector2D(this) });
            else
                o.SetTarget(new Vector2D(this));

        });

        let r = this.area_radius;
        r *= r * 2;
        info.notAround.forEach(o => {
            o.show_color = "green";
            var curAction = this.MoveEnvironment.MoveObjectsAction.get(o);
            if (curAction != "WANDER" && this.DistanceSq(o) > r)
                o.SwitchAction("WANDER");
            else if (curAction === "FLEE")
                o.SetTarget(new Vector2D(this));
        });
    }

}
/**
 * 可运动对象虚拟体
 * x:初始所处的x坐标
 * y:初始所处的y坐标
 * ActionModel:运动模式，包含：Seek、
 */
class MoveObj extends ShowObj {
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

        const actionMap = new Map();
        if (typeof (Seek) !== undefined) actionMap.set("SEEK", Seek);
        if (typeof (Flee) !== undefined) actionMap.set("FLEE", Flee);
        if (typeof (Arrive) !== undefined) actionMap.set("ARRIVE", Arrive);
        if (typeof (Wander) !== undefined) actionMap.set("WANDER", Wander);
        if (typeof (FollowPath) !== undefined) actionMap.set("FOLLOWPATH", FollowPath);

        var action = actionMap.get(args.ActionModel);
        this.curAction = new action(this);

        this.curAction.ActionSetting(args.setting);
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

        //三角形本体
        c2d.beginPath();
        c2d.moveTo(this.a.x, this.a.y);
        c2d.lineTo(this.b.x, this.b.y);
        c2d.lineTo(this.c.x, this.c.y);
        c2d.fillStyle = 'green';
        c2d.fill();

        //渲染辅助用的东西
        if (this.isDebug)
            this.curAction.ActionRender(c2d);
    }

    update(t, world) {
        const w_s = world.GetSetting();
        //环形世界设置
        if (w_s.isRoundWorld) {
            const ar = world.GetArea();
            if (this.x >= ar.width) { this.x = 0; }
            if (this.x < 0) { this.x = ar.width; }
            if (this.y >= ar.height) this.y -= ar.height;
            if (this.y < 0) this.y = ar.height;
        }

        //计算外形基点
        this.a = this.Add((new Vector2D({ x: 0 * this.l, y: 2 * this.l })).Turn(this.r));
        this.b = this.Add((new Vector2D({ x: -1 * this.l, y: -1.5 * this.l })).Turn(this.r));
        this.c = this.Add((new Vector2D({ x: 1 * this.l, y: -1.5 * this.l })).Turn(this.r));

        //加入轨迹
        if (this.isDebug) {
            var lastPoint = this._steps[this._steps.length - 1];
            if (this._steps.length == 0 || (lastPoint.x != this.x && lastPoint.y != this.y))
                this._steps.push(new Vector2D(this));
        }


        return this.curAction.ActionUpdate(t);
    }

    SetTarget(point, ...x) {
        this.curAction.SetTarget(point, ...x);
    }

}
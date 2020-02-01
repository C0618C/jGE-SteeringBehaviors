/**
 * 可运动对象虚拟体
 * x:初始所处的x坐标
 * y:初始所处的y坐标
 * ActionModel:运动模式，包含：Seek、
 */
class MoveObj extends ShowObj {
    // MoveEnvironment = {};       //记录运动场地的一些环境信息

    constructor(args = { x: 0, y: 0, ActionModel, isDebug, setting }) {
        super(args);
        this.curAction = null;
        this.actionLogic = null;        //行为管理

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

        if (args.ActionModel) this.SwitchAction(args.ActionModel, args.setting);

        // this.MoveObjects = null;
    }

    SwitchAction(model, setting) {
        this.curAction = null;
        this.curAction = Action.Factory(model, this);
        this.curAction.ActionSetting(setting);

        // if (this.MoveEnvironment.MoveObjectsAction) this.MoveEnvironment.MoveObjectsAction.set(this, model);
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
        if (this.isDebug && this.curAction)
            this.curAction.ActionRender(c2d);
    }

    update(t, world) {

        //计算外形基点
        this.a = this.Add((new Vector2D({ x: 0 * this.l, y: 2 * this.l })).Turn(this.r));
        this.b = this.Add((new Vector2D({ x: -1 * this.l, y: -1.5 * this.l })).Turn(this.r));
        this.c = this.Add((new Vector2D({ x: 1 * this.l, y: -1.5 * this.l })).Turn(this.r));

        //加入轨迹
        if (this.isDebug) {
            let lastPoint = this._steps[this._steps.length - 1];
            if (this._steps.length == 0 || (lastPoint.x != this.x && lastPoint.y != this.y))
                this._steps.push(new Vector2D(this));

            if (this._steps.length >= 1024) this._steps.shift();
        }

        // if (this.aroundTest) this.AroundTest();

        if (this.curAction) return this.curAction.ActionUpdate(t, world);

        return true;
    }

    SetTarget(point, ...x) {
        this.curAction.SetTarget(point, ...x);
    }

    StarRun(ActionType,ActionRegister) {
        if (this.actionLogic) {
            this.actionLogic[ActionType]();
            if(ActionRegister)  ActionRegister.set(this,ActionType);
            else console.warn("注意：切换运动模式时没有登记！");
        }
    }








}
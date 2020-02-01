class SteeringBehaviors {
    constructor(domName) {

        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });
        this._jGE.add(this);

        document.getElementById(domName).appendChild(this._jGE.GetDom());

        this.MoveObjects = new Set();
        this.MoveObjectsAction = new WeakMap();
        //this.CurTarget = this.AddAnObj();  //当前获得焦点的物体

        //自动开始徘徊测试
        // this.WanderTest();
        // this.WanderTestMS();

        //抵达测试
        // this.ArriveTest();

        //靠近测试
        // this.SeekTest();

        //远离测试
        // this.FleeTest();

        //路径跟随
        // this.FollowPathTest();

        // this.AreaSpaceTest();       //领域测试

        this.ActionLogicTest();
    }

    update(timeSpan, world) {
        this.AroundTest(timeSpan);
    }

    //检查周围有哪些附近的对象
    LookAround(target) {
        let aroundObj = new Set();
        let notAround = new Set();
        let r = target.area_radius;
        r *= r;//平方
        this.MoveObjects.forEach(o => {
            if (target == o) return;

            if (target.DistanceSq(o) <= r)
                aroundObj.add(o);
            else
                notAround.add(o);
        });
        return { aroundObj, notAround };
    }

    ///--------------------------- 测试用的方法-----------------------------

    AddAnObj(acm, setting, isDebug = true) {
        setting = Object.assign({
            LineSpeed: 0.25
        }, setting);
        let a = this._jGE.GetArea();
        let obj = new MoveObj({
            x: a.width / 2, y: a.height / 2, ActionModel: acm
            , setting: setting
            , isDebug: isDebug     //是否使用辅助线等
        });
        this.MoveObjects.add(obj);
        this._jGE.add(obj);
        // obj = { MoveObjects: this.MoveObjects, MoveObjectsAction: this.MoveObjectsAction };
        this.MoveObjectsAction.set(obj, acm);

        return obj;
    }


    SeekTest() {
        this.CurTarget = this.AddAnObj("SEEK");
        this._jGE.OnMouse("click", (e) => this.CurTarget.SetTarget(new Vector2D(GetEventPosition(e))));
    }
    FleeTest() {
        this.CurTarget = this.AddAnObj("FLEE");
        this._jGE.OnMouse("click", (e) => this.CurTarget.SetTarget(new Vector2D(GetEventPosition(e))));
    }
    ArriveTest() {
        this.CurTarget = this.AddAnObj("ARRIVE", { deceleration: 0.25 });
        this._jGE.OnMouse("click", (e) => this.CurTarget.SetTarget(new Vector2D(GetEventPosition(e)), Math.random()));
    }
    WanderTest() {
        this.CurTarget = this.AddAnObj("WANDER");
    }
    WanderTestMS() {
        for (let i = 0; i < 80; i++)
            this.AddAnObj("WANDER", { LineSpeed: 0.25 }, false);
    }
    FollowPathTest() {
        this.CurTarget = this.AddAnObj("FOLLOWPATH", {
            PathPoints: [new Vector2D(352, 218), new Vector2D(858, 79), new Vector2D(1148, 320)
                , new Vector2D(894, 742), new Vector2D(360, 926), new Vector2D(666, 444), new Vector2D(164, 500)]
            , RunModel: 1, LineSpeed: 0.4
        }, true);
    }

    //领域测试
    AroundTest(t) {
        let info = this.LookAround(this.CurTarget);

        info.aroundObj.forEach(o => {
            o.show_color = "#f000ef";
            let curAction = this.MoveObjectsAction.get(o);
            if (curAction != "Escape")
                o.StarRun("Escape",this.MoveObjectsAction);

            o.SetTarget(new Vector2D(this.CurTarget));

        });

        let r = this.CurTarget.area_radius;
        r *= r * 4;
        info.notAround.forEach(o => {
            o.show_color = "green";
            let curAction = this.MoveObjectsAction.get(o);
            if (curAction != "Normal" && this.CurTarget.DistanceSq(o) > r)
                o.StarRun("Normal",this.MoveObjectsAction);
            else if (curAction === "Escape")
                o.SetTarget(new Vector2D(this.CurTarget));
        });
    }



    ActionLogicTest() {
        //小动物的构建
        let smallAnimalActionLogic = [
            {
                Type: "Escape"
                , Action: "Flee"
                , LineSpeed: 0.5
            },
            {
                Type: "Normal"
                , Action: "Wander"
                , LineSpeed: 0.15
            }
        ]
        for (let i = 0; i < 180; i++) {
            let smallAnimal = this.AddAnObj(null, null, i == 1);
            smallAnimal.actionLogic = new ActionLogic(smallAnimalActionLogic, smallAnimal);
            this.MoveObjectsAction.set(smallAnimal, "Normal");
            smallAnimal.StarRun("Normal",this.MoveObjectsAction);
        }

        //猎食者的构建
        let hunterLogic = [
            {
                Type: "Normal"
                , Action: "FollowPath"
                , LineSpeed: 0.25
                , PathPoints: [new Vector2D(352, 218), new Vector2D(858, 79), new Vector2D(1148, 320)
                    , new Vector2D(894, 742), new Vector2D(360, 926), new Vector2D(666, 444), new Vector2D(164, 500)]
                , RunModel: 1, LineSpeed: 0.4
            }
        ]
        let hunter = this.AddAnObj();
        hunter.actionLogic = new ActionLogic(hunterLogic, hunter);
        hunter.aroundTest = true;
        hunter.show_color = "yellow";
        this.CurTarget = hunter;
        this.MoveObjectsAction.set(hunter, "Normal");
        hunter.StarRun("Normal",this.MoveObjectsAction);
    }
}
class SteeringBehaviors {
    constructor(domName) {

        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });

        document.getElementById(domName).appendChild(this._jGE.GetDom());

        this.MoveObjects = new Set();
        //this.CurTarget = this.AddAnObj();  //当前获得焦点的物体

        //自动开始徘徊测试
        // this.WanderTest();
        // this.WanderTestMS();

        //抵达测试
        // this.ArriveTest();

        //靠近测试
        // this.SeekTest();

        //远离测试
        // this.FleeTest()

        //路径跟随
        this.FollowPathTest();
    }

    AddAnObj(acm, setting, isDebug = true) {
        let a = this._jGE.GetArea();
        let obj = new MoveObj({
            x: a.width / 2, y: a.height / 2, ActionModel: acm
            , setting: setting
            , isDebug: isDebug     //是否使用辅助线等
        });
        this.MoveObjects.add(obj);
        this._jGE.add(obj);

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
        for (let i = 0; i < 20; i++)
            this.AddAnObj("WANDER", {}, false);
    }
    FollowPathTest() {
        this.CurTarget = this.AddAnObj("FOLLOWPATH", {
            PathPoints: [new Vector2D(352, 218), new Vector2D(858, 79), new Vector2D(1148, 320)
                , new Vector2D(894, 742), new Vector2D(360, 926), new Vector2D(666, 444), new Vector2D(164, 500)]
            , RunModel: 2
        });
    }
}
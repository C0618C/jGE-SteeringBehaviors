class SteeringBehaviors {
    constructor(domName) {

        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });

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
        obj.MoveEnvironment = { MoveObjects: this.MoveObjects, MoveObjectsAction: this.MoveObjectsAction };
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
    AreaSpaceTest() {
        this.CurTarget.aroundTest = true;
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
        for (let i = 0; i < 180; i++) 
        {
            let smallAnimal = this.AddAnObj(null,null,i==1);
            smallAnimal.actionLogic = new ActionLogic(smallAnimalActionLogic, smallAnimal);
            smallAnimal.StarRun();
        }

        //巡逻者的构建
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
        hunter.StarRun();
    }
}
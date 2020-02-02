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
                o.StarRun("Escape", this.MoveObjectsAction);

            o.SetTarget(new Vector2D(this.CurTarget));

        });

        let r = this.CurTarget.area_radius;
        r *= r * 4;
        info.notAround.forEach(o => {
            o.show_color = "green";
            let curAction = this.MoveObjectsAction.get(o);
            if (curAction != "Normal" && this.CurTarget.DistanceSq(o) > r)
                o.StarRun("Normal", this.MoveObjectsAction);
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
                , LineSpeed: 0.35
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
            smallAnimal.StarRun("Normal", this.MoveObjectsAction);
        }

        //猎食者的构建
        let hunterLogic = [
            {
                Type: "Normal"
                , Action: "FollowPath"
                , LineSpeed: 0.08
                , PathPoints: [[288.5,504.5],[281.4,509.6],[272.4,522.1],[271.1,508.7],[263.4,512.1],[247.3,510.4],[232.5,506.2],[221.5,498.7],[210.6,495.4],[206.1,487.0],[198.3,484.5],[184.8,472.8],[174.5,467.7],[168.7,471.9],[150.1,459.4],[136.6,448.5],[132.7,429.3],[142.4,431.8],[143.0,422.6],[137.9,413.3],[139.1,399.1],[124.3,379.0],[102.5,371.5],[98.6,358.1],[88.3,349.8],[86.4,344.7],[83.8,335.5],[84.4,328.0],[76.1,324.7],[72.2,326.3],[68.3,309.6],[72.2,306.2],[70.3,302.1],[83.1,293.7],[92.8,290.3],[107.0,292.0],[112.1,281.1],[129.5,279.5],[134.0,271.9],[155.2,262.7],[157.2,258.6],[155.9,248.5],[165.5,244.3],[153.3,214.2],[179.7,206.7],[186.8,203.3],[196.4,171.5],[223.5,177.4],[230.5,169.0],[231.2,151.4],[242.8,150.6],[253.1,138.9],[258.2,137.2],[261.4,148.9],[273.0,159.0],[292.3,164.8],[301.3,179.1],[296.2,200.0],[301.3,207.5],[317.4,210.0],[335.5,212.5],[351.5,223.4],[359.9,225.9],[365.7,241.8],[374.1,251.9],[388.9,251.9],[416.5,256.0],[434.6,253.5],[448.1,256.0],[467.4,266.9],[484.1,266.9],[489.9,271.9],[505.4,262.7],[527.3,256.9],[547.9,256.0],[563.3,249.3],[573.0,240.1],[582.6,234.3],[580.0,228.4],[576.2,221.7],[583.2,210.9],[590.3,212.5],[604.5,215.9],[618.0,206.7],[638.6,200.0],[648.3,188.3],[657.9,183.2],[677.2,180.7],[688.2,182.4],[689.5,176.5],[677.2,164.0],[666.3,159.0],[656.0,164.8],[642.5,162.3],[635.4,164.8],[631.5,157.3],[641.2,139.7],[647.6,127.2],[663.7,133.0],[683.0,122.2],[683.0,114.6],[695.3,96.2],[702.3,90.4],[683.0,81.2],[694.6,77.0],[706.2,67.8],[722.9,64.4],[740.3,64.4],[760.9,69.4],[772.5,76.1],[780.8,93.7],[786.0,101.2],[790.5,112.1],[795.6,128.9],[818.8,134.7],[834.9,147.3],[840.7,163.2],[860.7,163.2],[872.9,156.5],[894.8,151.4],[887.7,167.3],[882.5,174.0],[878.0,192.4],[869.0,210.0],[852.3,206.7],[840.7,212.5],[844.6,227.6],[842.6,248.5],[835.6,249.3],[835.6,257.7],[827.2,247.7],[822.0,257.7],[800.8,265.2],[802.7,274.4],[791.1,273.6],[784.7,267.8],[775.7,280.3],[760.9,290.3],[750.0,301.2],[731.3,306.2],[721.0,314.6],[706.8,319.6],[713.9,311.3],[711.3,304.6],[721.6,292.9],[714.5,283.6],[703.0,289.5],[687.5,302.1],[679.2,312.9],[666.3,313.8],[659.2,322.1],[666.3,333.9],[677.2,336.4],[677.9,344.7],[688.2,349.8],[703.6,337.2],[715.8,343.9],[724.2,344.7],[726.2,353.9],[707.5,359.0],[701.1,368.2],[688.2,376.5],[681.1,389.1],[695.3,398.3],[701.1,415.9],[708.8,431.8],[718.4,445.1],[717.8,458.5],[709.4,463.6],[712.6,472.8],[720.4,477.8],[718.4,492.0],[715.2,506.2],[707.5,507.9],[697.8,526.3],[686.9,549.7],[674.7,570.7],[656.0,586.6],[637.3,601.6],[621.9,603.3],[613.5,610.8],[609.0,605.8],[601.3,614.2],[582.6,623.4],[568.5,625.9],[564.0,644.3],[556.2,645.1],[553.0,632.6],[556.2,625.9],[538.2,620.0],[531.8,622.5],[518.3,618.4],[511.8,611.7],[513.8,601.6],[501.5,598.3],[495.1,591.6],[483.5,600.8],[470.6,602.5],[459.7,602.5],[452.6,606.6],[445.5,609.2],[447.5,629.2],[440.4,629.2],[439.1,625.0],[438.5,617.5],[428.8,622.5],[423.0,620.0],[412.7,613.3],[416.6,598.3],[408.2,594.9],[405.0,579.0],[390.8,581.5],[392.7,561.5],[405.0,546.4],[405.6,532.2],[405.6,518.8],[399.2,514.6],[394.7,504.6],[387.0,505.4],[372.8,502.9],[377.3,495.4],[370.9,484.5],[361.2,492.0],[349.6,487.8],[334.2,498.7],[321.9,512.1],[311.0,513.8]]
                , RunModel: 0
            }
        ]
        let hunter = this.AddAnObj();
        hunter.actionLogic = new ActionLogic(hunterLogic, hunter);
        hunter.aroundTest = true;
        hunter.show_color = "yellow";
        this.CurTarget = hunter;
        this.MoveObjectsAction.set(hunter, "Normal");
        hunter.StarRun("Normal", this.MoveObjectsAction);
    }
}
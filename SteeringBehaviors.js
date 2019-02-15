class SteeringBehaviors {
    constructor(domName) {

        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });

        document.getElementById(domName).appendChild(this._jGE.GetDom());

        this._jGE.OnMouse("click",(e)=>this.CurTarget.WanderResetTarget(), this);

        this.MoveObjects = new Set();
        this.CurTarget = this.AddAnObj();  //当前获得焦点的物体

        //自动开始徘徊测试
        //this.WanderTest(this.AddAnObj());

        //抵达测试
        this.ArriveTest(this._jGE);
    }

    AddAnObj() {
        let a = this._jGE.GetArea();
        let obj = new MoveObj({x:a.width/2,y:a.height/2});
        this.MoveObjects.add(obj);
        this._jGE.add(obj);

        return obj;
    }


    SeekTest(e) {
        this.CurTarget.Seek(new Vector2D(GetEventPosition(e)));
    }
    FleeTest(e) {
        this.CurTarget.Flee(new Vector2D(GetEventPosition(e)));
    }

    ArriveTest(jGE){
        let dom = jGE.GetDom();
        let target = this.CurTarget;
        dom.addEventListener("click",function(e){
            target.Arrive(new Vector2D(GetEventPosition(e)),0.5);
        })
    }

    WanderTest(target){
        target.Wander(30,85,10);
        target.WanderResetTarget();
    }

}
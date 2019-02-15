class SteeringBehaviors {
    constructor(domName) {

        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });

        document.getElementById(domName).appendChild(this._jGE.GetDom());

        //this._jGE.OnMouse("click",(e)=>this.CurTarget.WanderResetTarget(), this);

        this.MoveObjects = new Set();
        this.CurTarget = this.AddAnObj();  //当前获得焦点的物体

        //自动开始徘徊测试
        //this.WanderTest(this.AddAnObj());

        //抵达测试
        //this.ArriveTest();

        //靠近测试
        this.SeekTest();
    }

    AddAnObj() {
        let a = this._jGE.GetArea();
        let obj = new MoveObj({x:a.width/2,y:a.height/2});
        this.MoveObjects.add(obj);
        this._jGE.add(obj);

        return obj;
    }


    SeekTest() {
        this._jGE.OnMouse("click",(e)=>this.CurTarget.Seek(new Vector2D(GetEventPosition(e))), this);
    }
    FleeTest(e) {
        this.CurTarget.Flee(new Vector2D(GetEventPosition(e)));
    }

    ArriveTest(){
        this._jGE.OnMouse("click",(e)=>{
            this.CurTarget.Arrive(new Vector2D(GetEventPosition(e)),0.5);
        })
    }

    WanderTest(target){
        target.Wander(30,85,10);
        target.WanderResetTarget();
    }

}
class SteeringBehaviors {
    constructor(domName) {

        this._jGE = new jGE({
            width: document.documentElement.clientWidth
            , height: document.documentElement.clientHeight
        });

        document.getElementById(domName).appendChild(this._jGE.GetDom());

        this._jGE.OnMouse("click", this.ArriveTest, this);

        this.MoveObjects = new Set();
        this.CurTarget = this.AddAnObj();  //当前获得焦点的物体
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

    ArriveTest(e){
        this.CurTarget.Arrive(new Vector2D(GetEventPosition(e)),2);
    }

}
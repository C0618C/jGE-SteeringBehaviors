class MoveObj extends ShowObj {
    get target() {
        return this.__tg;
    }
    set target(v) {
        this.__tg = v;
    }
    constructor(...args) {
        super(...args);

        //this.__tg = new Vector2D(0,0);
        this.target = new Vector2D(this.x, this.y);

        //抵达 变量
        this.arrive = {
            deceleration: 0,     //用多少秒抵达目标
            speed: 0,            //速度/S
            angle: 0              //角速度
        }


        //徘徊 变量
        this.wander = {
            showtool:true,     //是否显示辅助工具
            tp: new Vector2D(),//范围圆心
            radius: 52,      //随机半径
            distance: 82,    //突出距离
            jitter: 40,       //随机位移最大值
            tg:null             //产生应力的目标点
        };

        this.followpath = {
            points: [],
            minWidth: 0,
            maxWidth: 800,
            minHeight: 0,
            maxHeight: 600
        };

        this.v = new Vector2D();
        this.v.Velocity(2, -π_hf);


        this.l = 10;//三角形外观参数
        this.r = π;

        this.tw = 0;//wander时用的当前朝向

        this.a = new Vector2D();
        this.b = new Vector2D();
        this.c = new Vector2D();
        this.CurAction = () => { };
        this._steps = [];
    }

    //走
    Go(t) {
        if (this.IsArive(t)) return;
        this.AddIn(this.v);
    }

    //靠近
    Seek(v_tg) {
        this.CurAction = this.Go;
        this.target = v_tg;
        this.v = v_tg.Minus(this).Normalize().Multiply(this.v.speed);
    }

    //离开
    Flee(v_tg) {
        this.CurAction = this.Go;
        this.target = v_tg;
        this.v = this.Minus(v_tg).Normalize().Multiply(this.v.speed);
    }

    //抵达
    Arrive(v_tg, deceleration) {    //目标，计划用时
        this.target = v_tg;
        this.arrive.deceleration = deceleration;
        this.arrive.speed = v_tg.Distance(this) / deceleration / 1000;
        this.arrive.angle = v_tg.Minus(this).Normalize().va;
        this.CurAction = this.ArriveDo;
    }
    ArriveDo(t) {
        this.v = new Vector2D();
        this.v.Velocity(this.arrive.speed * t, this.arrive.angle);
        this.Go(t);
    }

    //     //追逐
    //     Pursuit(v){}

    //     //逃避
    //     Evade(v){}

    //徘徊
    Wander(r,d,j) {
        this.wander.radius = r;
        this.wander.distance = d;
        this.wander.jitter = j;

        this.CurAction = this.WanderDo;
    }
    WanderDo(t){
        let p1 = new Vector2D();
        p1.Velocity(this.wander.distance,this.v.va)
        this.wander.tp = this.Add(p1);

        
        if (this.IsArive(t)) this.WanderResetTarget();

        this.AddIn(this.v);
    }
    WanderResetTarget(){
        let r = this.wander.radius;
        let x1 = Math.floor(Math.random()*2*r)+this.wander.tp.x - r;
        let y1 = 0;

        let x2 = this.wander.tp.x;
        let y2 = this.wander.tp.y;

        y1 = Math.floor( Math.sqrt( r*r-Math.pow(x1-x2,2) )*(Math.random()>0.5?1:-1) + y2 );

        if(typeof x1 === typeof y1){
            this.wander.tg = new Vector2D(x1,y1);
            this.Seek(this.wander.tg);
            this.CurAction = this.WanderDo;
        }
    }

    //     //避障
    //     ObstacleAvoidance(obstacles){}

    //     //避墙
    //     WallAvoidance(walls){}

    //     //插入
    //     Interpose(){}

    //     //躲藏
    //     Hide(){}

    //     //跟随路径
    //     FollowPath(t){
    //         if(this.followpath.points.length <= 1){
    //             const num = Math.floor(Math.random()*100)%20;
    //             for(let j=0;j<num;j++){
    //                 const x = Math.floor(Math.random()*100000)%(this.followpath.maxWidth - this.followpath.minWidth)+this.followpath.minWidth;
    //                 const y = Math.floor(Math.random()*100000)%(this.followpath.maxHeight - this.followpath.minHeight)+this.followpath.minHeight;
    //                 this.followpath.points.push(new Vector2D(x,y));
    //             }
    //         }
    //         if(this.target.Minus(this).Length()<=this.speed*t/1000){
    // //            console.log("A:",this.target,this,this.target.Minus(this).Length(),this.speed*t/1000);
    //             //this.target.Copy(this.followpath.points.shift());
    //             this.target = this.followpath.points.shift();
    // //            console.log("B:",this.target,this,this.target.Minus(this).Length(),this.speed*t/1000);
    //         }
    //     }

    //     //队形
    //     OffsetPursuit(leader,offset){}

    //     //分离
    //     Separation(){}

    //     //队列
    //     Alignment(){}

    //     //聚集
    //     Cohesion(){}

    //     //群集
    //     Flocking(){}

    render(c2d) {
        // //c2d
        if (!false) {
            //红色圆形底盘
            // c2d.beginPath();
            // c2d.strokeStyle = 'red';
            // c2d.fillStyle = '#c08289';
            // c2d.lineWidth = 1;
            // c2d.arc(this.x, this.y, this.l * 2, this.r + Math.PI / 2, 2 * Math.PI + this.r + Math.PI / 2);
            // c2d.fill();

            //画轨迹
            if (this._steps.length > 0) {
                c2d.beginPath();
                c2d.moveTo(this._steps[0].x, this._steps[0].y);
                for (let s of this._steps) {
                    c2d.lineTo(s.x, s.y);
                }
                c2d.strokeStyle = "#888888";
                c2d.stroke();
            }
            
            if(this.wander.showtool){
                c2d.beginPath();
                c2d.arc(this.wander.tp.x,this.wander.tp.y,this.wander.radius,0,π2);
                c2d.strokeStyle = "#666cc6";
                c2d.stroke();

                if(this.wander.tg){
                    c2d.beginPath();
                    c2d.arc(this.wander.tg.x,this.wander.tg.y,2,0,π2);
                    c2d.fillStyle = "#007777";
                    c2d.fill();
                }
            }

            // if (this.CurAction == this.Wander) {  //徘徊用辅助
            //     c2d.beginPath();
            //     c2d.moveTo(this.wander.tp.x, this.wander.tp.y);
            //     c2d.arc(this.wander.tp.x, this.wander.tp.y, this.wander.radius, 0, 2 * Math.PI);
            //     c2d.strokeStyle = 'yellow';
            //     c2d.stroke();
            // } else if (this.CurAction == this.FollowPath) {
            //     c2d.fillStyle = 'pink';
            //     c2d.strokeStyle = 'lightgray';
            //     let curP = this.target;
            //     for (var p of this.followpath.points) {
            //         c2d.beginPath();
            //         c2d.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            //         c2d.closePath();
            //         c2d.fill();
            //         c2d.beginPath();
            //         c2d.moveTo(curP.x, curP.y);
            //         c2d.lineTo(p.x, p.y);
            //         c2d.closePath();
            //         c2d.stroke();
            //         curP.Copy(p);
            //     }
            // }

            //三角形本体
            c2d.beginPath();
            c2d.moveTo(this.a.x, this.a.y);
            c2d.lineTo(this.b.x, this.b.y);
            c2d.lineTo(this.c.x, this.c.y);
            c2d.fillStyle = 'green';
            c2d.fill();

            //连线-目标点
            if (this.target != null) {
                c2d.beginPath();
                c2d.moveTo(this.x, this.y);
                c2d.lineTo(this.target.x, this.target.y);
                c2d.strokeStyle = 'green';
                c2d.stroke();
                c2d.beginPath();
                c2d.strokeStyle = 'red';
                c2d.fillStyle = 'black';
                c2d.arc(this.target.x, this.target.y, 5, 0, 2 * Math.PI);
                c2d.fill();
                c2d.moveTo(this.target.x - 10, this.target.y);
                c2d.lineTo(this.target.x + 10, this.target.y);
                c2d.moveTo(this.target.x, this.target.y - 10);
                c2d.lineTo(this.target.x, this.target.y + 10);
                c2d.closePath();
                c2d.stroke();
            }
        }
    }

    update(t, world) {
        const w_s = world.GetSetting();
        //环形世界设置
        if (w_s.isRoundWorld) {
            const ar = world.GetArea();
            // if(this.x >= ar.width){this.tw = 1;}
            // if(this.x < 0) {this.tw = 0;}
            if (this.x >= ar.width) { this.x = 0; }
            if (this.x < 0) { this.x = ar.width; }
            if (this.y >= ar.height) this.y -= ar.height;
            if (this.y < 0) this.y = ar.height;
        }

        //this.Go(t);  //移动
        this.CurAction(t);

        //计算外形基点
        this.a = this.Add((new Vector2D({ x: 0 * this.l, y: 2 * this.l })).Turn(this.r));
        this.b = this.Add((new Vector2D({ x: -1 * this.l, y: -1.5 * this.l })).Turn(this.r));
        this.c = this.Add((new Vector2D({ x: 1 * this.l, y: -1.5 * this.l })).Turn(this.r));

        //使朝向与目标点一致
        // const tv=this.target.Minus(this);
        // if(tv.y == 0) this.r = Math.PI;
        // else this.r = (tv.y<0?Math.PI:0)-Math.atan(tv.x/tv.y);
        // if(this.r == NaN) this.r = 0;

        //使朝向与速度一致
        this.r = this.v.va - π_hf;

        //加入轨迹
        this._steps.push(new Vector2D(this));
    }

    IsArive(t) {
        if (this.target == null) return false;
        const des = this.v.speed;
        return this.target.DistanceSq(this) <= des;
    }
}
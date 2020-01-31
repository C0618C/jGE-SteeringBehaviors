/**
 * 路径、循径
 * 定义一组点，对象依次以这组点作为目标，使用Seek模式靠近
 */
class FollowPath extends Seek {
    pathpoints = [];
    pointIndex = 0;      //在向第x个点前进
    runmodel = 0;       //运动模式：0-跳到开始点、1-原路返回、2-停下）

    constructor(obj) {
        super(obj);

        //测试用的数据

    }

    ActionSetting(setting) {
        if (setting === undefined) return;

        if (setting.PathPoints === undefined) {
            console.warn("[FollowPath]: 使用了路径模式，但没有定义实际！！");
            return;
        }
        this.pathpoints.push(...setting.PathPoints);

        if (setting.RunModel !== undefined) this.runmodel = setting.RunModel;

        this.SetTarget(this.pathpoints[this.pointIndex]);
    }
    ActionUpdate(timeSpan) {
        super.ActionUpdate(timeSpan);

        if (this.IsArive()) {
            this.pointIndex++;

            if (this.pointIndex >= this.pathpoints.length) {
                // 这儿用于控制，当路径到头时，采取什么形式进行下去（跳到开始点、原路返回、停下）
                switch (this.runmodel) {
                    case 0:
                        this.pointIndex = 0;        //跳到开始点
                        break;
                    case 1:
                        this.pointIndex = 1;        //原路返回
                        this.pathpoints.reverse();
                        break;
                    case 2:
                        this.Target = null;
                        break;
                }
            }

            this.SetTarget(this.pathpoints[this.pointIndex]);
        }
    }

    ActionRender(c2d) {
        super.ActionRender(c2d);

        //描绘出路径
        c2d.beginPath();
        c2d.moveTo(this.pathpoints[0].x, this.pathpoints[0].y);
        c2d.strokeStyle = 'gray';
        for (var i = 1; i < this.pathpoints.length; i++) {
            c2d.lineTo(this.pathpoints[i].x, this.pathpoints[i].y);
        }
        c2d.stroke();
    }
}
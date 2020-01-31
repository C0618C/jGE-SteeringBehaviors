/**
 * 靠近 
 * v = (vt - o)/|vt - o|*|vs|
 */
class Seek extends Action {
    ActionUpdate(timeSpan, world) {
        if (this.Target == null) return;

        this.v = this.Target.Minus(this.ShowObj).Normalize().Multiply(this.v.speed);
        if (!this.IsArive(timeSpan)) this.Go(timeSpan);
        else {
            //FollowPath的时候 如果不强行回到改点，则会卡住在越过目标点的位置
            this.ShowObj.Copy(this.Target);
        }

        super.ActionUpdate(timeSpan, world);
    }
}
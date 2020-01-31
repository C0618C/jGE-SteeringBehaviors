/**
 * 离开 
 * v = (o - vt)/|o - vt|*|vs|
 */
class Flee extends Action {
    ActionUpdate(timeSpan) {
        if (this.Target == null) return;
        this.v = this.ShowObj.Minus(this.Target).Normalize().Multiply(this.v.speed);
        if (!this.IsArive(timeSpan)) this.Go(timeSpan);

        //TODO:环形世界模式下，到达边界会卡住
    }
}
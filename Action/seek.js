/**
 * 靠近 
 * v = (vt - o)/|vt - o|*|vs|
 */
class Seek extends Action {
    ActionUpdate(timeSpan) {
        if (this.Target == null) return;
        
        this.v = this.Target.Minus(this.ShowObj).Normalize().Multiply(this.v.speed);
        if (!this.IsArive(timeSpan)) this.Go(timeSpan);
    }
}
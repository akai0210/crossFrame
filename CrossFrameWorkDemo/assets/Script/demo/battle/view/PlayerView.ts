import RoleView from "./RoleView";
import NPCView from "./NPCView";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerView extends NPCView {

    private _rangeX = cc.v2(0, 0)

    private _rangeY = cc.v2(0, 0)

    private pos = cc.v2(0, 0);
    private startPos: cc.Vec2;

    start() {
        var screenSize = cc.view.getVisibleSize();
        let hw = this.node.width / 2;
        let hh = this.node.height / 2;
        this._rangeX.x = hw;
        this._rangeX.y = screenSize.width - hw;
        this._rangeY.x = hh;
        this._rangeY.y = screenSize.height - hh;
        this.startPos = cc.v2(screenSize.width / 2, -hh);
        this.pos.x = this.node.x;
        this.pos.y = this.node.y;
        // this.node.setPosition(this.startPos.x, this.startPos.y)
        
    }
    updatePos(disx: number, disy: number) {
        // let x = this.node.x;
        // let y = this.node.y;
        // let tx = x + disx;
        // let ty = y + disy;

        this.pos.x = cc.misc.clampf(this.pos.x + disx, this._rangeX.x, this._rangeX.y);
        this.pos.y = cc.misc.clampf(this.pos.y + disy, this._rangeY.x, this._rangeY.y);
        this.setPosition(this.pos.x,this.pos.y)

        // this.pos.x = tx;
        // this.pos.y = ty;
        // this.node.setPosition(tx,ty);      
    }
    // update (dt) {}

    getDuration() {
        return 0.2;
    }

    getShootCount() {
        return 10;
    }
}

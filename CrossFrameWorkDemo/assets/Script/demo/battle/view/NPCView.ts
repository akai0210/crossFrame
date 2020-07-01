import RoleView from "./RoleView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NPCView extends RoleView {

    protected cd: number = 0;

    start () {

    }

    updateObj(dt: number) {
        super.updateObj(dt)
        this.cd += dt;
        // cc.log(' NPCView updateObj cd ',this.cd)
        if (this.cd >= this.getDuration()) {
            this.cd = 0;
            this.simulator.shoot(this)
        }
    }

    getDuration(){
        return 1;
    }

    //发射子弹数量。
    getShootCount(){
        return 1;
    }
}

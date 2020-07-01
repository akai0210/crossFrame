
import PoolManager from "../../../cfw/pool/PoolManager";
import NPCView from "./NPCView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnmeyView extends NPCView {

    static CLASS_NAME: string = 'CLASS_NAME'

    start() {

    }

    kill() {
        PoolManager.instance().put(EnmeyView.CLASS_NAME, this)
    }
    getDuration(){
        return 0.2;
    }
    //发射子弹数量。
    getShootCount(){
        return 4;
    }    
}

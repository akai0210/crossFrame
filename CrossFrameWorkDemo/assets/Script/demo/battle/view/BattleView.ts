

import BaseView from "../../../cfw/mvc/BaseView";
import PlayerView from "./PlayerView";
import Simulator from "../Simulator";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleView extends BaseView {

    @property(PlayerView)
    player: PlayerView = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    enemyPrefab: cc.Prefab = null;

    protected simulator: Simulator;
    
    start() {
        this.simulator = new Simulator(this, this.model)
        this.simulator.start()
    }

    update(dt: number) {
        this.simulator.update(dt)
    }

}

import BattleView from "./view/BattleView";
import BattleManager from "./BattleManager";
import RoleView from "./view/RoleView";
import QuadTree from "../../cfw/collide/QuadTree";
import RoleManager from "./RoleManager";
import Bound from "../../cfw/collide/Bound";
import PoolManager from "../../cfw/pool/PoolManager";
import PlayerView from "./view/PlayerView";
import BulletView from "./view/BulletView";
import EnmeyView from "./view/EnemyView";
import CollisionHelper from "../../cfw/collide/CollisionHelper";
import NPCView from "./view/NPCView";
import RandomHelper from "../../cfw/tools/RandomHelper";
import { DIR } from "../../cfw/tools/Define";

/**
 * 仿真器
 */
export default class Simulator {



    protected renderer: BattleView;
    protected gameState: BattleManager;

    constructor(renderer: BattleView, gameState: BattleManager) {
        this.renderer = renderer;
        this.gameState = gameState;
        this.player = this.renderer.player
    }
    private collisionResult: RoleView[] = []
    //敌人和敌人的子弹
    private enemyTree: QuadTree<RoleView> = null;

    //玩家和玩家的子弹
    private playerTree: QuadTree<RoleView> = null;

    //存放敌人，用于取出来与子弹碰撞。
    private enemyManager: RoleManager = new RoleManager()

    protected player: PlayerView;
    private sx: number = 0;
    private sy: number = 0;
    private sh: number = 0;
    private sw: number = 0;
    start() {
        let visibleOrigin = cc.view.getVisibleOrigin();
        let visibleSize = cc.view.getVisibleSize();
        this.sx = visibleOrigin.x
        this.sy = visibleOrigin.y;
        this.sw = visibleSize.width
        this.sh = visibleSize.height;
        this.enemyTree = new QuadTree(new Bound(visibleOrigin.x, visibleOrigin.y, visibleSize.width, visibleSize.height));
        this.playerTree = new QuadTree(new Bound(visibleOrigin.x, visibleOrigin.y, visibleSize.width, visibleSize.height));
        this.player.setSimulator(this)
        this.playerTree.insert(this.player)
        this.player.born()
        let count = 4;
        let dis = this.sw / (count)
        let bx =  (this.sx + this.sw - dis * count) / 2 + 60
        for (let index = 0; index < count; index++) {
            let x = bx + dis * index;
            let y = this.sh - 100
            this.createEnmey(x, y)
        }

    }

    //发射子弹
    shoot(role: NPCView) {

        let name = role.node.name;
        let num = role.getShootCount()
        let dis = 50;
        let bx = role.node.x - dis * num / 2;

        for (let index = 0; index < num; index++) {
            let comp: NPCView = PoolManager.instance().get(BulletView.CLASS_NAME, () => {
                let node = cc.instantiate(this.renderer.bulletPrefab)
                this.addChild(node)
                return node.getComponent(BulletView)

            })
            comp.setPosition(bx + index * dis, role.node.y)
            comp.setSimulator(this)
            if (name == 'PlayerView') {
                this.playerTree.insert(comp);
                comp.setFaceDir(DIR.UP)
            } else {

                comp.setFaceDir(DIR.DOWN)
                this.enemyTree.insert(comp);
            }
            comp.born()
        }

    }

    collision() {
        // cc.log('---------------------------------')
        let enemyList = this.enemyManager.List;
        // 先用玩家的子弹与敌人碰撞，对玩家有优势。因为敌人先死了。
        for (let i = 0; i < enemyList.length; i++) {
            const enemy: EnmeyView = enemyList[i] as EnmeyView;
            if (enemy.isAlive()) {
                this.collisionResult.length = 0;
                this.playerTree.retrieve(enemy, 0, this.collisionResult);
                // cc.log(' 敌人 需要碰撞的 个数 ',targetList.length)
                let count = this.collisionResult.length;
                for (let j = 0; j < count; j++) {
                    const target = this.collisionResult[j];
                    if (enemy.isAlive()) {
                        if (target instanceof BulletView) {
                            if (CollisionHelper.collision(enemy.node, target.node)) {
                                //处理碰撞逻辑。
                                // cc.log('主角子弹 碰到了敌人  ')
                            } else {
                                // cc.warn(' 没有碰到 子弹 ')
                            }
                        } else {
                            // cc.warn(' 周围的不是子弹  ')
                        }
                    } else {
                        break;
                        // cc.warn(' 子弹是死亡状态  ',enemy.getID())
                    }

                }
            } else {
                // cc.log(' 敌人 已经死亡 ')
            }


        }


        this.collisionResult.length = 0;
        //获得可以攻击主角的子弹
        this.enemyTree.retrieve(this.player, 0, this.collisionResult);
        let count = this.collisionResult.length;
        // cc.log(' collision =================== count ',list.length)
        for (let index = 0; index < count; index++) {
            const element: RoleView = this.collisionResult[index];
            if (element instanceof BulletView) {
                if (CollisionHelper.collision(this.player.node, element.node)) {
                    //************************ */
                    // cc.log('敌人子弹 碰到了主角  ')
                    //处理子弹伤害
                }
            } else if (element instanceof EnmeyView) {
                if (CollisionHelper.collision(this.player.node, element.node)) {
                    //************************ */
                    //处理敌人伤害。
                }

            }
        }
    }



    // 当对象死亡时调用
    gameObjectDead(role: RoleView) {
        if (role instanceof EnmeyView) {
            this.enemyManager.remove(role)
        }
    }

    checkVisible() {
        this.enemyTree.checkVisible();
        this.playerTree.checkVisible();
        this.enemyManager.recover()
    }

    init() {
        this.enemyTree.clear();
        this.playerTree.clear();
    }

    addChild(child) {
        this.renderer.node.addChild(child)
    }

    //创建敌人
    createEnmey(x: number, y: number) {
        let comp: EnmeyView = PoolManager.instance().get(EnmeyView.CLASS_NAME, () => {
            let node = cc.instantiate(this.renderer.enemyPrefab)
            this.addChild(node)
            return node.getComponent(EnmeyView)

        })
        comp.born()
        comp.setSimulator(this)
        comp.setPosition(x, y)
        this.enemyTree.insert(comp);
        this.enemyManager.push(comp)
    }

    //更新游戏逻辑
    update(dt) {
        // cc.log(' update dt ',dt)
        this.collision();
        this.enemyTree.updateState(dt);
        this.playerTree.updateState(dt);
        this.checkVisible();
    }
}

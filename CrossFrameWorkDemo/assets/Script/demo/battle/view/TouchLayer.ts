import PlayerView from "./PlayerView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchLayer extends cc.Component {

    @property(PlayerView)
    player: PlayerView = null;


    private touchPos: cc.Vec2 = cc.v2(0, 0);

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchFinish, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchFinish, this);
        // cc.director.getScheduler().setTimeScale(0.1)
        // this.battleView.setSpeedScale(0.1)
        // this.node.opacity = 120;        
    }



    touchMove(touch: cc.Touch, event) {
        // cc.log("PlayerView  ")
        // if(this.clickID >= 0 ){

        let touchX = touch.getLocationX()
        let touchY = touch.getLocationY() 
        // let pos = touch.getLocation();
        // cc.log("touchMove  ",touchLoc)
        // let pos = this.node.getParent().convertToNodeSpaceByBufferPos(touchLoc);
        // cc.log(' pos ',pos)
        let disx = touchX - this.touchPos.x;
        let disy =  touchY - this.touchPos.y;
        // cc.log(" this.battleItemModel.isAnyMove() ",this.battleItemModel.isAnyMove())
        // if (!BattleManager.getInstance().getBattleModel().isAnyMove()) {
        //     disy = 0;
        // }

        // cc.log("pos  ",pos)
        this.player.updatePos(disx, disy)
        // for (let index = 0; index < this.guardView.length; index++) {
        //     const element = this.guardView[index];
        //     element.setPos(this.player.node.position)
        // }
        this.touchPos.x = touchX
        this.touchPos.y = touchY


        // }
    }
    touchFinish() {
        // this.battleView.setSpeedScale(0.1)
        // cc.director.getScheduler().setTimeScale(0.1)
        // this.node.opacity = 120;
        this.touchPos.x = this.player.node.x;
        this.touchPos.y = this.player.node.y;
    }
    touchStart(touch, event) {
        // this.battleView.setSpeedScale(1)
        // cc.director.getScheduler().setTimeScale(1)
        // this.node.opacity = 0;
        // let touchLoc = touch.getLocation();
        // let pos = this.node.getParent().convertToNodeSpace(touchLoc);
        this.touchPos.x = touch.getLocationX();
        this.touchPos.y = touch.getLocationY();
        // this.clickID = touch.getID();



    }
}

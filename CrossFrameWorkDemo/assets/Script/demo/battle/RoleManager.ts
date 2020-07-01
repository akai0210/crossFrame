import RoleView from "./view/RoleView";

/**
 * 对象管理器
 */
export default class RoleManager {


    private roleList: RoleView[] = []

    private removeList: RoleView[] = []

    push(obj: RoleView) {
        this.roleList.push(obj)
    }

    get List() {
        return this.roleList;
    }

    getElement(index: number) {
        return this.roleList[index]
    }

    size() {
        return this.roleList.length
    }

    clear() {
        this.removeList.length = 0;
        console.log(' this.roleList.length ', this.roleList.length)
        while (this.roleList.length > 0) {
            let obj = this.roleList.shift();
            obj.kill()
        }
        this.roleList.length = 0;
    }

    updateObj(dt) {
        for (let index = 0; index < this.roleList.length; index++) {
            const element = this.roleList[index];
            if (element.isAlive()) {
                element.updateObj(dt);
            }

        }
    }

    //移除标记不能马上删除，会破坏迭代器
    remove(obj: RoleView) {
        this.removeList.push(obj)
    }


    //删除
    delete(obj: RoleView) {
        for (let index = 0; index < this.roleList.length; index++) {
            const element = this.roleList[index];
            if (obj == element) {
                obj.kill()
                this.roleList.splice(index, 1)
                break;
            }
        }
    }

    //回收
    recover() {
        while (this.removeList.length > 0) {
            this.delete(this.removeList.shift())
        }
    }

}

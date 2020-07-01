import ResLoader from "../../cfw/res/ResLoader";
import AudioManager from "../../cfw/audio/AudioManager";

export default class Module {

    private loader: ResLoader;

    protected audio: AudioManager;

    protected name: string = ''
    
    constructor(moduleName: string) {
        this.name = moduleName;
        this.loader = new ResLoader()
        this.audio = new AudioManager(moduleName, this.loader)
    }

    getName() {
        return this.name;
    }

    getLoader() {
        return this.loader;
    }

    getAudio() {
        return this.audio;
    }
}
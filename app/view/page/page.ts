import { ComponentPageFrame } from './componentPageFrame';
import { ServiceModel } from '../serviceModel/serviceModel';
import { ComponentRouter } from '../common/component/generic/router/componentRouter';
import { Child } from '../common/child/child';

export class Page extends Child {
    private currentFrame: ComponentPageFrame;
    private language: any;
    private unknown: boolean;

    constructor(file?) {
        super();
        this.className = 'Page';
        this.unknown = false;
        if (file)
            ServiceModel.getPromise(file + 'L').then((data) => this.checkLanguage(file, data)).fail((data) => this.checkFailed(data));
    }

    public getLanguage() {
        return this.language;
    }

    public getUnknown() {
        return this.unknown;
    }

    public setUnknown(unknown) {
        this.unknown = unknown;
    }

    protected checkLanguage(file, jSON) {
        this.language = jSON;
        ServiceModel.getPromise(file).then((data) => this.checkArray(data)).fail((data) => this.checkFailed(data));
    }

    protected checkArray(jSON) {
        // jSON = JSON.parse(jSON);
        if (jSON.constructor === Array) {
            for (let index = 0; index < jSON.length; index++) {
                let fJSON = {
                    minWidth: jSON[index]['minWidth'],
                    maxWidth: jSON[index]['maxWidth'],
                    minHeight: jSON[index]['minHeight'],
                    maxHeight: jSON[index]['maxHeight'],
                };
                ServiceModel.getPromise(jSON[index]['file']).then((data) => this.checkFrame(data, fJSON)).fail((data) => this.checkFailed(data));
            }
        } else {
            let frame = new ComponentPageFrame();
            this.addFrame(frame, jSON);
            this.setPage();
        }
    }

    protected checkFrame(jSON, fJSON) {
        // jSON = JSON.parse(jSON);
        let frame = new ComponentPageFrame();
        frame.setMinWidth(fJSON.minWidth);
        frame.setMaxWidth(fJSON.maxWidth);
        frame.setMinHeight(fJSON.minHeight);
        frame.setMaxHeight(fJSON.maxHeight);
        this.addFrame(frame, jSON);
        this.setPage();
    }

    protected checkFailed(data) {
        // console.error('JSONT:' + data);
        if (this.father instanceof ComponentRouter)
            this.father.updateFailed(data, this);
    }

    public setPage() {// depois checar evento de resize e fazer esperar carregamento
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        for (let index = 0; index < this.arrayChild.length; index++) {
            let frame = this.arrayChild[index];
            if (frame instanceof ComponentPageFrame && this.father instanceof ComponentRouter) {
                if (frame.getMaxHeight() === undefined || frame.getMaxHeight() >= height) {
                    if (frame.getMinHeight() === undefined || frame.getMinHeight() <= height) {
                        if (frame.getMaxWidth() === undefined || frame.getMaxWidth() >= width) {
                            if (frame.getMinWidth() === undefined || frame.getMinWidth() <= width) {
                                if (this.currentFrame === undefined || this.currentFrame !== frame || this.father.toGo()) {
                                    this.father.went();
                                    this.refreshFrame(frame);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private refreshFrame(frame: ComponentPageFrame) {
        this.currentFrame = frame;
        this.addFrame(frame);
        // this.currentFrame.renderAfterFullUpdate(this.currentFrame);
    }

    private addFrame(frame: ComponentPageFrame, jSON?) {
        if (this.getArrayChild.indexOf(frame) === -1)
            this.addChild(frame, jSON);
    }
}

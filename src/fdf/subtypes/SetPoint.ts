import {IWriteAble} from "../../IWriteAble";
import {StringStream} from "../../StringStream";
import {FrameBase} from "../FrameBase";
import {BaseFrames} from "../../base/BaseFrames";
import {PAlign} from "./PAlign";

export class SetPoint implements IWriteAble {
    public myPoint: PAlign;
    public parentFrame: FrameBase | BaseFrames;
    public parentPoint: PAlign;
    public xx: number;
    public yy: number;

    constructor(myPoint: PAlign, parentFrame: FrameBase | BaseFrames, parentPoint: PAlign, xx: number, yy: number) {
        this.myPoint = myPoint;
        this.parentFrame = parentFrame;
        this.parentPoint = parentPoint;
        this.xx = xx;
        this.yy = yy;
    }
    compileToStringStream(str: StringStream): void {
        str.writeIndentation()
            .writeString(`SetPoint ${this.myPoint}, `);

        str.writeString(`"${typeof this.parentFrame == "string" ? this.parentFrame : this.parentFrame.Name}", `);
        str.writeString(`${this.parentPoint}, ${this.xx}, ${this.yy}, \n`);
    }

}
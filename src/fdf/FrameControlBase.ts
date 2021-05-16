import {StringStream} from "../StringStream";
import {FrameBase, FrameBaseArgs} from "./FrameBase";
import {ControlStyles} from "./subtypes/ControlStyles";
import {FrameHighlightType, FrameBackdropType} from "./FrameTypes";


export type FrameControlBaseArgs = FrameBaseArgs & {
    ControlStyle?: Set<ControlStyles>,

    ControlBackdrop?: FrameBackdropType,
    ControlPushedBackdrop?: FrameBackdropType,
    ControlDisabledBackdrop?: FrameBackdropType,
    ControlDisabledPushedBackdrop?: FrameBackdropType,

    ControlMouseOverHighlight?: FrameHighlightType,
}

export abstract class FrameControlBase extends FrameBase {
    public ControlStyle: Set<ControlStyles> = new Set();

    public ControlBackdrop?: FrameBackdropType;
    public ControlPushedBackdrop?: FrameBackdropType;
    public ControlDisabledBackdrop?: FrameBackdropType;
    public ControlDisabledPushedBackdrop?: FrameBackdropType;

    public ControlMouseOverHighlight?: FrameHighlightType;

    public constructor(name: string, args?: FrameControlBaseArgs) {
        super(name);
        if (args) Object.assign(this, args);
    }

    public writeControl(str: StringStream) {
        this.writeSet(str, this.ControlStyle, "ControlStyle");

        this.writeFrame(str, this.ControlBackdrop, "ControlBackdrop");
        this.writeFrame(str, this.ControlPushedBackdrop, "ControlPushedBackdrop");
        this.writeFrame(str, this.ControlDisabledBackdrop, "ControlDisabledBackdrop");
        this.writeFrame(str, this.ControlDisabledPushedBackdrop, "ControlDisabledPushedBackdrop");

        this.writeFrame(str, this.ControlMouseOverHighlight, "ControlMouseOverHighlight");
    }
}
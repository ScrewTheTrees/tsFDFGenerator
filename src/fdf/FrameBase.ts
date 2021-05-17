import {IWriteAble} from "../IWriteAble";
import {StringStream} from "../StringStream";
import {SetPoint} from "./subtypes/SetPoint";
import {FrameType} from "./FrameTypes";
import {FontJustify} from "./subtypes/FontJustify";
import {Vector2} from "../other/Vector2";
import {RGBColor} from "../other/RGBColor";
import {FrameFont} from "./subtypes/FrameFont";
import {Vector4} from "../other/Vector4";

export type FrameBaseArgs = {
    Width?: number,
    Height?: number,
    InheritsFrom?: FrameBase | string,
    InheritsWithChildren?: boolean,

    SetAllPoints?: boolean,
    DecorateFileNames?: boolean,

    Children?: FrameBase[],
    Points?: SetPoint[],

    FrameFont?: FrameFont,
    FontJustificationH?: FontJustify,
    FontJustificationV?: FontJustify,
    FontJustificationOffset?: Vector2,
    FontFlags?: (string | 'FIXEDSIZE'),
    FontColor?: RGBColor,
    FontHighlightColor?: RGBColor,
    FontDisabledColor?: RGBColor,
    FontShadowColor?: RGBColor,
    FontShadowOffset?: Vector2,
};

export abstract class FrameBase implements IWriteAble {
    public Name; //All frames need a name, preferably it should be entirely unique.
    public Width?: number;
    public Height?: number;
    public InheritsFrom?: FrameType; //Makes this frame inherit from another frame.
    public InheritsWithChildren?: boolean = false; //adds the "WITHCHILDREN" to inherit children too.

    //Flags
    public SetAllPoints: boolean = false; //Sets all the points to its parent frame.
    public DecorateFileNames: boolean = false; //Inside this Frame Filenames are lookups in a string table like GameInterface etc.

    public Children: FrameBase[] = []; //Children of this frame.
    public Points: SetPoint[] = []; //Used to align what this frame "sticks" to.

    public FrameFont?: FrameFont;
    public FontJustificationH?: FontJustify; //How the text should expand/align.
    public FontJustificationV?: FontJustify; //Is this even real?
    public FontJustificationOffset?: Vector2;
    public FontFlags?: (string | 'FIXEDSIZE');
    public FontColor?: RGBColor; //RGBA
    public FontHighlightColor?: RGBColor; //RGBA
    public FontDisabledColor?: RGBColor; //RGBA
    public FontShadowColor?: RGBColor; //RGBA
    public FontShadowOffset?: Vector2;

    public addChild(frame: FrameBase) {
        this.Children.push(frame);
    }
    public printChildren(str: StringStream) {
        for (let child of this.Children) {
            child.compileToStringStream(str);
        }
    }

    public constructor(name: string, args?: FrameBaseArgs) {
        this.Name = name;
        if (args) Object.assign(this, args);
    }
    public writeBaseHeader(str: StringStream, type: string) {
        str.writeIndentation();
        str.writeString(`Frame "${type}" "${this.Name}"`);
        this.writeInheritsFrom(str);
        str.writeLine(` {`);
    }
    public writeCommonData(str: StringStream) {
        if (this.DecorateFileNames) str.writeIndentation().writeLine(`DecorateFileNames,`);
        if (this.SetAllPoints) str.writeIndentation().writeLine(`SetAllPoints,`);
        this.writeGeneric(str, this.Width, "Width");
        this.writeGeneric(str, this.Height, "Height");

        for (let point of this.Points) {
            point.compileToStringStream(str);
        }

        this.writeFontData(str);
    }
    private writeFontData(str: StringStream) {
        this.writeColor(str, this.FontColor, "FontColor");
        this.writeColor(str, this.FontHighlightColor, "FontHighlightColor");
        this.writeColor(str, this.FontDisabledColor, "FontDisabledColor");
        this.writeColor(str, this.FontShadowColor, "FontShadowColor");
        this.writeVector(str, this.FontShadowOffset, "FontShadowOffset");
        if (this.FrameFont) this.FrameFont.compileToStringStream(str);
        this.writeVector(str, this.FontJustificationOffset, "FontJustificationOffset");
        this.writeGeneric(str, this.FontJustificationH, "FontJustificationH", true);
        this.writeGeneric(str, this.FontJustificationV, "FontJustificationV", true);
        this.writeGeneric(str, this.FontFlags, "FontFlags");
    }

    public writeFrame(str: StringStream, frame: FrameType | undefined, header: string) {
        if (frame != null) {
            str.writeIndentation();
            str.writeLine(`${header} "${typeof frame == "string" ? frame : frame.Name}",`);
        }
    }
    public writeGeneric(str: StringStream, frame: string | number | undefined, header: string, noDoots: boolean = false) {
        if (frame != null) {
            str.writeIndentation();
            if (!noDoots && typeof frame == "string") {
                str.writeLine(`${header} "${frame}",`);
            } else {
                str.writeLine(`${header} ${frame},`);
            }
        }
    }
    public writeSet<T extends string>(str: StringStream, set: Set<T>, header: string) {
        if (set.size > 0) {
            str.writeIndentation().writeString(`${header} "`);
            let first = true;
            for (let entry of set) {
                if (!first) str.writeString("|")
                str.writeString(entry.toString())
                first = false;
            }
            str.writeString(`",\n`);
        }
    }
    public writeColor(str: StringStream, color: RGBColor | undefined, header: string) {
        if (color != undefined) {
            str.writeIndentation()
                .writeLine(`${header} ${color.toString()},`);
        }
    }
    public writeVector(str: StringStream, vec: Vector2 | Vector4 | undefined, header: string) {
        if (vec != undefined) {
            str.writeIndentation()
                .writeLine(`${header} ${vec.toString()},`);
        }
    }

    private writeInheritsFrom(str: StringStream) {
        if (this.InheritsFrom != null) {
            str.writeString(` INHERITS`);
            if (this.InheritsWithChildren) str.writeString(` WITHCHILDREN`);
            str.writeString(` "${typeof this.InheritsFrom == "string" ? this.InheritsFrom : this.InheritsFrom.Name}"`);
        }
    }
    public abstract compileToStringStream(str: StringStream): void;
}


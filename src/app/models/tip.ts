import { TipType } from "./tip-type.enum";
import { UGC } from "./ugc";

export interface Tip extends UGC {
    tipType: TipType;
    text: string;
    image64: string;
}

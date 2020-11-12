import { TipType } from "./tip-type.enum";
import { UGC } from "./ugc";

export class Tip extends UGC {
    tipType: TipType;
    text: string;
    
}

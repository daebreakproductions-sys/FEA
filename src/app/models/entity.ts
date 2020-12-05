import { IonDatetime } from "@ionic/angular";
import { EatsDate } from "./eats-date";
import { Status } from "./status.enum";

export interface Entity {
    id?: number;
    created?: EatsDate;
    modified?: EatsDate;
    status?: Status;
    version?: number;
    commentCount?: number;
    tagCount?: number;
    viewCount?: number;
}

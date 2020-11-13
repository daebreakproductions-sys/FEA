import { IonDatetime } from "@ionic/angular";
import { EatsDate } from "./eats-date";
import { Status } from "./status.enum";

export interface Entity {
    id: bigint;
    created: EatsDate;
    modified: EatsDate;
    status: Status;
    version: bigint;
    commentCount: bigint;
    tagCount: bigint;
    viewCount: bigint;
}

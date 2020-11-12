import { IonDatetime } from "@ionic/angular";
import { Status } from "./status.enum";

export class Entity {
    id: bigint;
    created: Date;
    modified: Date;
    status: Status;
    version: bigint;
    commentCount: bigint;
    tagCount: bigint;
    viewCount: bigint;
}

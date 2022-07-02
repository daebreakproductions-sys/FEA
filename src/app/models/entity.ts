import { EatsDate } from "./eats-date";
import { Status } from "./status.enum";

export interface Entity {
    class?: string;
    id?: number;
    created?: EatsDate;
    modified?: EatsDate;
    status?: Status;
    version?: number;
    commentCount?: number;
    tagCount?: number;
    viewCount?: number;
}

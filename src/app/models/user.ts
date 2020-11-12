import { Entity } from './entity'
import { NotificationFrequency } from './notification-frequency.enum';

export class User extends Entity {
    avatar: object;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gisOn: boolean;
    notificationFrequency: NotificationFrequency;
    username: string;
    termsAccept: Date;
    irbAccept: Date;
}

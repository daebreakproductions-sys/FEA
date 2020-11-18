import { Entity } from './entity'
import { NotificationFrequency } from './notification-frequency.enum';

export interface User extends Entity {
    avatar64: object;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gisOn: boolean;
    notificationFrequency: NotificationFrequency;
    username: string;
    termsAccept: Date;
    irbAccept: Date;
    name: string;
}

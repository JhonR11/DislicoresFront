import { user } from "../../../../../shared/models/user.interface";
import { UserItem } from "../../../../../shared/models/users.interfaces";

export class UserMapper{
    static mapUserItem( item: UserItem): user{
        return {
            name: item.name,
            lastname: item.lastname,
            documentNumber: item.documentNumber,
            phone: item.phone,
            isActive: item.isActive
        }
        
    }

    static mapUserItemsArray(items: UserItem[]): user[]{  
        return items.map(item => this.mapUserItem(item));
    }

}
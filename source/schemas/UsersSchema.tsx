import Realm from "realm";

export class Users extends Realm.Object<Users> {
  _id!: Realm.BSON.ObjectId;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  userId!: string;
  username?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Users',
  properties: {
    _id: 'objectId',
    firstName: 'string?',
    lastName: 'string?',
    profilePicture: 'string?',
    userId: 'string',
    username: 'string?',
  },
  primaryKey: '_id',
}
};


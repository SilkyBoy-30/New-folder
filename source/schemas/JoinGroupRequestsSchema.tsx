import Realm from "realm";

export class JoinGroupRequests extends Realm.Object<JoinGroupRequests> {
  _id!: Realm.BSON.ObjectId;
  groupName!: string;
  userId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'JoinGroupRequests',
    properties: {
      _id: 'objectId',
      groupName: 'string',
      userId: 'string',
    },
    primaryKey: '_id',
}
};


import Realm from "realm";

export class Groups extends Realm.Object<Groups> {
    _id!: Realm.BSON.ObjectId;
    dateCreated?: Date;
    memberRoles!: Realm.List<string>;
    members!: Realm.List<string>;
    name!: string;
    owner?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Groups',
    properties: {
        _id: 'objectId',
        dateCreated: 'date?',
        memberRoles: 'string[]',
        members: 'string[]',
        name: 'string?',
        owner: 'string?',
    },
  primaryKey: '_id',
}
};


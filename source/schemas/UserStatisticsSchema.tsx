import Realm from "realm";

export class UserStatistics extends Realm.Object<UserStatistics> {
    _id!: Realm.BSON.ObjectId;
    lvl!: number;
    numCardioWorkouts!: number;
    numResistanceWorkouts!: number;
    numWorkouts!: number;
    userId!: string;
    xp!: number;
    xpTarget!: number;

  static schema: Realm.ObjectSchema = {
    name: 'UserStatistics',
  properties: {
    _id: 'objectId',
    lvl: 'int?',
    numCardioWorkouts: 'int?',
    numResistanceWorkouts: 'int?',
    numWorkouts: 'int?',
    userId: 'string',
    xp: 'int?',
    xpTarget: 'int?',
  },
  primaryKey: '_id',
}
};
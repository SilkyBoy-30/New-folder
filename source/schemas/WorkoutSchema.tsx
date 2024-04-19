import Realm, {BSON} from 'realm';

export class Workouts extends Realm.Object<Workouts> {
  _id!: Realm.BSON.ObjectId;
  dateCreated?: Date;
  userId!: string;
  workoutType?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Workouts',
    properties: {
      _id: 'objectId',
      dateCreated: 'date?',
      userId: 'string',
      workoutType: 'string?',
    },
    primaryKey: '_id',
  };
}

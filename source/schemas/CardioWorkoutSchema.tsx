import Realm, {BSON} from 'realm';

export class CardioWorkout extends Realm.Object<CardioWorkout> {
  _id!: Realm.BSON.ObjectId;
  allExercises!: Realm.List<string>;
  dateCreated!: Date;
  distance!: Realm.List<string>;
  exercise!: Realm.List<string>;
  extraNotes!: Realm.List<string>;
  time!: Realm.List<string>;
  totalDistance?: number;
  totalTime?: number;
  user_id!: string;


  static schema: Realm.ObjectSchema = {
    name: 'CardioWorkout',
    properties: {
      _id: 'objectId',
      allExercises: 'string[]',
      dateCreated: 'date',
      distance: 'string[]',
      exercise: 'string[]',
      extraNotes: 'string[]',
      time: 'string[]',
      totalDistance: 'int?',
      totalTime: 'int?',
      user_id: 'string',
    },
    primaryKey: '_id',
  }

};

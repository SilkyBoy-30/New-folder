import Realm from "realm";

export class ResistanceWorkout extends Realm.Object<ResistanceWorkout> {
    _id!: Realm.BSON.ObjectId;
    allExercises!: Realm.List<string>;
    dateCreated?: Date;
    exercises!: Realm.List<string>;
    reps!: Realm.List<string>;
    totalReps?: number;
    totalVolume?: number;
    userId!: string;
    weights!: Realm.List<string>;


  static schema: Realm.ObjectSchema = {
    name: 'ResistanceWorkout',
  properties: {
    _id: 'objectId',
    allExercises: 'string[]',
    dateCreated: 'date?',
    exercises: 'string[]',
    reps: 'string[]',
    totalReps: 'int?',
    totalVolume: 'int?',
    userId: 'string',
    weights: 'string[]',
  },
  primaryKey: '_id',
  }

};

import { useQuery, useRealm, useUser } from "@realm/react"
import { useEffect } from "react"
import { Text, View } from "react-native"
import { CardioWorkout } from "../../schemas/CardioWorkoutSchema"
import { ResistanceWorkout } from "../../schemas/ResistanceWorkoutSchema"
import { Groups } from "../../schemas/GroupsSchema"
import { Users } from "../../schemas/UsersSchema"
import { Workouts } from "../../schemas/WorkoutSchema"

type HistoryScreenProps = {
    group:string;
}


export const HistoryScreen = (props: HistoryScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const group = useQuery(Groups).filtered('name == $0', props.group);
    const stringIds = group[0].members.map(member => member)
    //let userStatistics = useQuery(UserStatistics).filtered("userId IN $0", stringIds).sorted("numWorkouts", true)

    const currentDate = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(currentDate.getDate() - 30)

    const workouts = useQuery(Workouts).filtered("userId IN $0 AND dateCreated >= $1", stringIds, thirtyDaysAgo)
    console.log(workouts)

    const userData = useQuery(Users).filtered("userId IN $0", stringIds)

    //test comment

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(CardioWorkout)
            )

            mutableSubs.add(
                realm.objects(ResistanceWorkout)
            )
        });
    }, [realm, user]);

    return (
        <View>
            {
                workouts.map((item:any) => {
                    return (
                        <View>
                            <Text>{item.workoutType}</Text>
                        </View>
                    )
                })
            }
        </View>
        
    )
}
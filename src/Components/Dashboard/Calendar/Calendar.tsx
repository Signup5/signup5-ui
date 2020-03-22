import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  AppointmentModel,
  EditingState,
  IntegratedEditing, Resource,
  SchedulerDateTime,
  ViewState
} from '@devexpress/dx-react-scheduler';
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  ConfirmationDialog,
  DateNavigator,
  DayView,
  MonthView,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import {useQuery} from "@apollo/react-hooks";
import {useSelector} from "react-redux";
import {Event, Person, QueryResponse} from "../../../Types";
import {InitialState} from "../../../Store/Reducers/rootReducer";
import {GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID} from "../../../Store/GQL";
import addMinutes from "date-fns/addMinutes";
import {blue, green} from "@material-ui/core/colors";

interface Props {

}

interface StateProps {
  person: Person;
}

export const Calendar: FC<Props> = (props) => {
  const startDayHour = 7;
  const endDayHour = 19;
  const [currentDate, setCurrentDate] = useState<SchedulerDateTime>(Date.now());
  const [events, setEvents] = useState<Array<AppointmentModel>>([]);
  const [resources, setResources] = useState<[Resource]>([{
    fieldName: "role",
    title: "role",
    instances: [
      {id: "host", text: "as Host", color: green},
      {id: "guest", text: "as Guest", color: blue}
    ]
  }])

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person
      };
    }
  );


  const response: QueryResponse = useQuery(GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID, {
    variables: {
      id: stateProps.person.id
    }
  });

  function addDuration(date: string, time: string, duration: number): string {
    return addMinutes(new Date(date).setHours(Number(time.substr(0, 2))
      , Number(time.substr(3, 2))), duration).toTimeString().substr(0, 5);
  };


  function mapEventToAppointment(events: Array<Event>): Array<AppointmentModel> {
    return events.map((e) => {

      return {
        startDate: `${e.date_of_event}T${e.time_of_event.substr(0, 5)}`,
        endDate: `${e.date_of_event}T${addDuration(e.date_of_event, e.time_of_event, e.duration)}`,
        title: e.title,
        id: e.id,
        role: (e.host.id === stateProps.person.id)? "host": "guest"
      }
    });
  }

  useEffect(() => {
    if (!response.loading && response.data)
      setEvents(mapEventToAppointment(response.data.events));
  }, [response.loading, response.data]);

  // if (response.loading) return <p>Loading...</p>;
  // if (response.error) {
  //   return <p>No events found!</p>;
  // }

  const commitChanges = () => {

  }

  return (
    <Paper style={{flexGrow: 6}}>
      <Scheduler
        data={events}
        height={660}
      >
        <Toolbar/>
        <ViewState
          currentDate={currentDate}
        />
        <DateNavigator/>
        <TodayButton/>
        <ViewSwitcher/>

        <EditingState
          onCommitChanges={commitChanges}
        />
        <IntegratedEditing/>
        <WeekView
          startDayHour={startDayHour}
          endDayHour={endDayHour}
        />
        <DayView
        />
        <MonthView/>


        <Appointments/>
        <ConfirmationDialog
          ignoreCancel
        />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
        />
        <Resources
          data={resources}
        />

        <AppointmentForm/>
      </Scheduler>
    </Paper>
  );
};
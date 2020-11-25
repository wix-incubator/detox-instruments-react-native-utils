declare module 'detox-instruments-react-native-utils' {

  interface EventStatuses {
    completed: 0,
    error: 1,
    cancelled: 2,
  }

  export class Event {
    constructor(category: string, name: string)

    static EventStatus: EventStatuses;

    static event(category: string, name: string, eventStatus: EventStatuses, message: string)

    beginInterval(message: string)

    endInterval(eventStatus: EventStatuses[keyof EventStatuses], message: string)
  }

}

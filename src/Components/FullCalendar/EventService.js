export class EventService {
  getEvents() {
    return fetch("data/events.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }
}

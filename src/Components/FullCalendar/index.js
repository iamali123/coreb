import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const FullCalendarDemo = (props) => {
  return (
    <>
      <div>
        <div className="card" style={{ marginTop: 40 }}>
          <FullCalendar
            events={props.data}
            initialDate={new Date()}
            initialView="dayGridMonth"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable
            dayMaxEvents
            dateClick={props.dateClick}
            eventClick={props.eventClick}
            eventDrop={props.eventDrop}
          />
        </div>
      </div>
    </>
  );
};
export default FullCalendarDemo;

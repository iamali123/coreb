import React, { useState } from "react";
import FullCalendar from "../../../Components/FullCalendar";
import AppointmentForm from "./AppointmentForm";
import { useSelector, useDispatch } from "react-redux";
import AppointmentInfo from "./AppointmentInfo";
import dateformat from "dateformat";
import { EditAppointment } from "../../../Api/Actions/Health/Appointment/AppointmentAction";
import { EDIT_APPOINTMENT } from "../../../Redux/Constants";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
function Appointment() {
  const params = useParams();
  const [Open, setOpen] = useState(false);
  const [data, setdata] = useState();
  const [OpenInfoPopUp, setOpenInfoPopUp] = useState(false);
  const [AppointmentInformation, setAppointmentInformation] = useState();
  const [date, setdate] = useState(new Date());
  const dispatch = useDispatch();
  var AppointmentSchedule = useSelector(
    (appointment) => appointment.appointmentReducer
  ).map((schedule) => ({
    id: parseInt(schedule.id),
    title: schedule.patientName,
    start: schedule.startTime,
    end: schedule.endTime,
    note: schedule.note,
    doctorName: schedule.doctorName,
    appointmentType: schedule.appointmentTypeName,
    email: schedule.patientEmailAddress,
    phoneNumber: schedule.patientPhoneNumber,
    appointmentStatus: schedule.appointmentStatus,
  }));
  var Appointments = useSelector((e) => e.appointmentReducer);
  const updateAppointmentByDrag = (e) => {
    let newDate = e?.event?._instance?.range?.start;
    let updatedAppointmentId = e?.event?._def?.publicId;
    let updatedObject = Appointments.find((e) => e.id === updatedAppointmentId);
    updatedObject.date = dateformat(newDate, "yyyy-mm-dd");
    EditAppointment(updatedObject)
      .then((res) => {
        dispatch({ type: EDIT_APPOINTMENT, payload: res.data });
      })
      .catch((error) => {
        if (error.response !== undefined) {
          Swal.fire({
            title: `${error?.response?.data?.title ?? "Error"}`,
            text: `${error?.response?.data?.message ?? "Error"}`,
            icon: "error",
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: `Network Error`,
            icon: "error",
            showConfirmButton: true,
          });
        }
      });
  };
  let RelatedPatientAppointment = useSelector((e) => e.appointmentReducer)
    .filter(
      (d) => d.patientId.toString() === params?.PatientId?.toString() ?? "0"
    )
    .map((schedule) => ({
      id: parseInt(schedule.id),
      title: schedule.patientName,
      start: schedule.startTime,
      end: schedule.endTime,
      note: schedule.note,
      doctorName: schedule.doctorName,
      appointmentType: schedule.appointmentTypeName,
      email: schedule.patientEmailAddress,
      phoneNumber: schedule.patientPhoneNumber,
      appointmentStatus: schedule.appointmentStatus,
    }));

  return (
    <>
      <AppointmentForm
        Open={Open}
        setOpen={setOpen}
        date={date}
        data={data}
        setdate={setdate}
        setdata={setdata}
      />
      <AppointmentInfo
        Open={OpenInfoPopUp}
        setOpen={setOpenInfoPopUp}
        date={date}
        Info={AppointmentInformation}
        OpenAppointmentForm={Open}
        setOpenAppointmentForm={setOpen}
        setdata={setdata}
      />
      <FullCalendar
        data={
          RelatedPatientAppointment.length > 0
            ? RelatedPatientAppointment
            : AppointmentSchedule
        }
        dateClick={(e) => {
          setdate(e.date);
          setdata(undefined);
          setOpen(true);
        }}
        eventClick={(e) => {
          setOpenInfoPopUp(true);
          setAppointmentInformation(e);
        }}
        eventDrop={(e) => {
          updateAppointmentByDrag(e);
        }}
      />
    </>
  );
}

export default Appointment;

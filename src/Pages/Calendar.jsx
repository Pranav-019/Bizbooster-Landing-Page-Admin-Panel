import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { scheduleData } from '../Data/dummy';
import { Header } from '../Components';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState(scheduleData); // Store calendar events

  // Handle adding a new meeting
  const handleAddMeeting = (event) => {
    setEvents([...events, event]); // Add event to the existing list
  };

  // Handle event creation (when you add a meeting from the calendar UI)
  const handleEventCreated = (args) => {
    const newEvent = {
      ...args.data,
      StartTime: new Date(args.data.StartTime),
      EndTime: new Date(args.data.EndTime),
      Description: args.data.Subject, // You can use Subject as the description or any other field
      cssClass: 'blue-event', // Add custom class for styling
    };
    handleAddMeeting(newEvent); // Add to events state
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      
      {/* Meeting Creation Form */}
      <div className="meeting-form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newMeeting = {
              Subject: e.target.subject.value,
              StartTime: new Date(e.target.startDate.value),
              EndTime: new Date(e.target.endDate.value),
              Description: e.target.subject.value, // Use subject as description or provide a new field
              cssClass: 'blue-event', // Apply custom class
            };
            handleAddMeeting(newMeeting); // Add meeting
          }}
        >
          <label>Subject:</label>
          <input type="text" name="subject" required />
          <label>Start Date:</label>
          <input type="datetime-local" name="startDate" required />
          <label>End Date:</label>
          <input type="datetime-local" name="endDate" required />
          <button type="submit">Add Meeting</button>
        </form>
      </div>
      
      <ScheduleComponent
        height="650px"
        eventSettings={{
          dataSource: events, // Show events
          fields: {
            subject: 'Subject',
            startTime: 'StartTime',
            endTime: 'EndTime',
            description: 'Description',
            cssClass: 'cssClass', // Apply custom class for styling
          },
        }}
        selectedDate={new Date()}
        onEventCreated={handleEventCreated} // Add new event on calendar interaction
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  );
};

export default Calendar;

import React, { useState, useEffect } from 'react';
import './Calendar.scss';
import './Popup.scss';
import './Sidebar.scss';

import { Button } from '@/components/ui/button';
// Array for day names to maintain consistency
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


function Calendar() {
  // Core calendar state
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem('currentDate');
    return savedDate ? new Date(savedDate) : new Date();
  });

  // Events/appointments state
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  // UI state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: 'meeting', // Default category
    reminder: '15' // Default reminder time in minutes
  });
  const [clickedDate, setClickedDate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('currentDate', currentDate.toISOString());
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [currentDate, appointments]);

  // Calendar calculation helpers
  const currentMonthIndex = currentDate.getMonth();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const currentYearMonth = `${currentDate.getFullYear()} ${currentDate.toLocaleString('en-US', {
    month: 'long',
  })}`;
  
// Add your function to export appointments
const exportAppointments = (appointments, month, year) => {
  // Filter appointments based on the selected month and year
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.time );
    return (
      appointmentDate.getMonth() === month && appointmentDate.getFullYear() === year
    );
  });
 
  // Convert filtered appointments to CSV or JSON (for simplicity, we'll use JSON)
  const data = JSON.stringify(filteredAppointments, null, 2);
  
  // Create a download link
  const blob = new Blob([data], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `appointments_${year}_${month + 1}.json`;
  link.click();
};
  // Navigation handlers
  function handleDateChange(increment) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  }

  function handleResetClick() {
    setCurrentDate(new Date());
  }

  // Utility functions
  function getDayClassName(date, isCurrentMonth, isToday) {
    let className = 'calendar__day';
    if (!isCurrentMonth) {
      className += ' calendar__day_inactive';
    }
    if (isToday) {
      className += ' calendar__day_today';
    }
    return className;
  }

  // Filter and search functions
  function getFilteredAppointments() {
    return appointments.filter(appointment => {
      const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || appointment.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }

  function getDateAppointments(date) {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.time);
      return (
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getDate() === date
      );
    });
  }

  // Event handlers
  function handleAddAppointment(date) {
    setClickedDate(date);
    setIsModalOpen(true);
    setSelectedAppointment(null);
    setAppointmentForm({
      name: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      category: 'meeting',
      reminder: '15'
    });
  }

  function handleViewAppointment(appointment) {
    setSelectedAppointment(appointment);
    setClickedDate(new Date(appointment.time));
    setAppointmentForm({
      name: appointment.name,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      description: appointment.description,
      location: appointment.location,
      category: appointment.category,
      reminder: appointment.reminder
    });
    setIsModalOpen(true);
  }

  function handleSaveAppointment() {
    if (!appointmentForm.name || !appointmentForm.startTime || !appointmentForm.endTime) {
      alert('Please fill out all required fields!');
      return;
    }

    if (appointmentForm.startTime >= appointmentForm.endTime) {
      alert('End time must be after start time!');
      return;
    }

    const newAppointment = {
      id: selectedAppointment?.id || Date.now(),
      time: clickedDate.toISOString(),
      ...appointmentForm
    };

    if (selectedAppointment) {
      // Update existing appointment
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id ? newAppointment : apt
      ));
    } else {
      // Create new appointment
      setAppointments([...appointments, newAppointment]);

      
    }

    setIsModalOpen(false);
  }

  function handleDeleteAppointment() {
    if (confirm('Are you sure you want to delete this event?')) {
      setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id));
      setIsModalOpen(false);
    }
  }

  // Calendar grid generation
  const dateBoxes = Array.from(
    { length: Math.ceil((daysInMonth + firstDayOfWeek) / 7) },
    (_, i) => i
  ).map((week) => (
    <div className="calendar__week" key={week}>
      {Array.from({ length: 7 }, (_, i) => i).map((day) => {
        const date = week * 7 + day + 1 - firstDayOfWeek;
        const isCurrentMonth = date > 0 && date <= daysInMonth;
        const actualDate = new Date();
        const isToday = 
          actualDate.getDate() === date &&
          actualDate.getMonth() === currentMonthIndex &&
          actualDate.getFullYear() === currentDate.getFullYear();

        let dateText;
        if (date < 1) {
          dateText = prevMonthLastDay + date;
        } else if (date > daysInMonth) {
          dateText = date - daysInMonth;
        } else {
          dateText = date;
        }

        return (
          <div
            className={getDayClassName(date, isCurrentMonth, isToday)}
            key={`${week}-${day}`}
            onClick={() => {
              if (isCurrentMonth) {
                const selectedDate = new Date(
                  currentDate.getFullYear(),
                  currentMonthIndex,
                  date
                );
                handleAddAppointment(selectedDate);
              }
            }}
          >
            <div className="calendar__day-number">{dateText}</div>
            <div className="calendar__appointments">
              {getDateAppointments(date).map((appointment) => (
                <div
                  key={appointment.id}
                  className={`calendar__appointment calendar__appointment--${appointment.category}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewAppointment(appointment);
                  }}
                >
                  <span className="calendar__appointment-time">
                    {appointment.startTime}
                  </span>
                  <span className="calendar__appointment-title">
                    {appointment.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ));

  return (
    <div className="calendar">
      {/* Sidebar */}
      <div className={`calendar__sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Button className="calendar__sidebar-close" onClick={() => setIsSidebarOpen(false)}>
          ×
        </Button>
        <h2 className="calendar__sidebar-title">Events</h2>
        
        <div className="calendar__sidebar-filters">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="calendar__sidebar-search"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="calendar__sidebar-category"
          >
            <option value="all">All Categories</option>
            <option value="meeting">Meeting</option>
            <option value="personal">Personal</option>
            <option value="birthday">Birthday</option>
          </select>
        </div>

        <div className="calendar__sidebar-list">
          {getFilteredAppointments().map((appointment) => (
            <div
              key={appointment.id}
              className={`calendar__sidebar-item calendar__sidebar-item--${appointment.category}`}
              onClick={() => handleViewAppointment(appointment)}
            >
              <div className="calendar__sidebar-item-title">{appointment.name}</div>
              <div className="calendar__sidebar-item-date">
                {new Date(appointment.time).toLocaleDateString()}
              </div>
              <div className="calendar__sidebar-item-time">
                {appointment.startTime} - {appointment.endTime}
              </div>
            </div>
          ))}
        </div>
      </div>

        

      <Button className="calendar__Button calendar__Button--view calendar__phone2" onClick={() => setIsSidebarOpen(true)}>
            View Events
          </Button>
          <Button className="calendar__Button calendar__Button--view calendar__phone2" onClick={() => exportAppointments(appointments,currentDate.getMonth(),currentDate.getFullYear())}>
            export
          </Button>
        
          <Button className="calendar__Button calendar__Button--today calendar__phone2" onClick={handleResetClick}>
            Today
          </Button>

         

      {/* Header */}
      <div className="calendar__header">
        <div className="calendar__title">Calendar</div>
        <div className="calendar__navigation">
          <Button className="calendar__Button calendar__Button--prev" onClick={() => handleDateChange(-1)}>
            &lt;
          </Button>
         

          <Button className="calendar__Button calendar__Button--view calendar__phone" onClick={() => setIsSidebarOpen(true)}>
            View Events
          </Button>
          <Button className="calendar__Button calendar__Button--view calendar__phone" onClick={() => exportAppointments(appointments,currentDate.getMonth(),currentDate.getFullYear())}>
            export
          </Button>
        
          <Button className="calendar__Button calendar__Button--month">
            {currentYearMonth}
          </Button>
          <Button className="calendar__Button calendar__Button--today" onClick={handleResetClick}>
            Today
          </Button>
         
          <Button className="calendar__Button calendar__Button--next" onClick={() => handleDateChange(1)}>
            &gt;
          </Button>
        </div>
      </div>

      {/* Days header */}
      <div className="calendar__week">
        {days.map((day, index) => (
          <div key={index} className="calendar__day-name">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {dateBoxes}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal is-visible">
          <div className="modal__content">
            <div className="modal__header">
              <h3>{selectedAppointment ? 'Edit Event' : 'New Event'}</h3>
              <Button onClick={() => setIsModalOpen(false)}>×</Button>
            </div>

            <div className="modal__body">
              <input
                type="text"
                placeholder="Event Name *"
                value={appointmentForm.name}
                onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
                className="modal__input"
              />

              <div className="modal__input-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={appointmentForm.startTime}
                  onChange={(e) => setAppointmentForm({...appointmentForm, startTime: e.target.value})}
                  className="modal__input"
                />
              </div>

              <div className="modal__input-group">
                <label>End Time *</label>
                <input
                  type="time"
                  value={appointmentForm.endTime}
                  onChange={(e) => setAppointmentForm({...appointmentForm, endTime: e.target.value})}
                  className="modal__input"
                />
              </div>

              <div className="modal__input-group">
                <label>Location</label>
                <input
                  type="text"
                  value={appointmentForm.location}
                  onChange={(e) => setAppointmentForm({...appointmentForm, location: e.target.value})}
                  className="modal__input"
                  placeholder="Enter location"
                />
              </div>

              <div className="modal__input-group">
                <label>Category</label>
                <select
                  value={appointmentForm.category}
                  onChange={(e) => setAppointmentForm({...appointmentForm, category: e.target.value})}
                  className="modal__input"
                >
                  <option value="meeting">Meeting</option>
                  <option value="personal">Personal</option>
                  <option value="birthday">Birthday</option>
                </select>
              </div>

              <div className="modal__input-group">
                <label>Reminder</label>
                <select
                  value={appointmentForm.reminder}
                  onChange={(e) => setAppointmentForm({...appointmentForm, reminder: e.target.value})}
                  className="modal__input"
                >
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                </select>
              </div>

              <div className="modal__input-group">
                <label>Description</label>
                <textarea
                  value={appointmentForm.description}
                  onChange={(e) => setAppointmentForm({...appointmentForm, description: e.target.value})}
                  className="modal__input"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
            </div>

            <div className="modal__footer">
              {selectedAppointment ? (
                <>
                  <Button onClick={handleDeleteAppointment} className="modal__Button modal__Button--delete">
                    Delete
                  </Button>
                  <Button onClick={handleSaveAppointment} className="modal__Button modal__Button--save">
                    Update
                  </Button>
                </>
              ) : (
                <Button onClick={handleSaveAppointment} className="modal__Button modal__Button--save">
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseURL = process.env.VUE_APP_API_BASE_URL;
        const response = await axios.get(`${baseURL}/events`);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleRegister = async (eventId) => {
    // Implement registration logic here
    console.log(`Registering for event ID: ${eventId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
            <button 
              className="text-xl font-semibold cursor-pointer w-full text-left" 
              onClick={() => handleEventSelect(event)} 
              onKeyPress={(e) => { if (e.key === 'Enter') handleEventSelect(event); }} 
              tabIndex={0}
            >
              {event.title}
            </button>
            <p className="text-gray-600">{event.date}</p>
            <p className="text-gray-800 mt-2">{event.description.slice(0, 100)}...</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleRegister(event.id)}>Register</button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="mt-8 border rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold">Event Details</h2>
          <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
          <p className="text-gray-600">Date: {selectedEvent.date}</p>
          <p className="text-gray-800 mt-2">{selectedEvent.description}</p>
          <h3 className="text-lg font-bold mt-4">Register for Tickets</h3>
          <form className="mt-2">
            <input type="text" placeholder="Your Name" className="border rounded px-2 py-1 w-full mb-2" required />
            <input type="email" placeholder="Your Email" className="border rounded px-2 py-1 w-full mb-2" required />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventPage;

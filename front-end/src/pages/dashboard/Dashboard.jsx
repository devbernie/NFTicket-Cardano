import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [eventStats, setEventStats] = useState({
    totalTickets: 0,
    totalAttendees: 0,
    ticketTypes: { free: 0, nft: 0 },
    feedback: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const baseURL = process.env.VUE_APP_API_BASE_URL;
        const response = await axios.get(`${baseURL}/events/stats`);
        setEventStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event data');
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  // Prepare data for ticket type pie chart
  const ticketTypeData = {
    labels: ['Free Tickets', 'NFT Tickets'],
    datasets: [
      {
        data: [eventStats.ticketTypes.free, eventStats.ticketTypes.nft],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  // Prepare data for feedback bar chart
  const feedbackData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Participant Feedback',
        data: [
          eventStats.feedback.filter(f => f.rating === 'excellent').length,
          eventStats.feedback.filter(f => f.rating === 'good').length,
          eventStats.feedback.filter(f => f.rating === 'average').length,
          eventStats.feedback.filter(f => f.rating === 'poor').length,
        ],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Event Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p className="stat-number">{eventStats.totalTickets}</p>
        </div>
        <div className="stat-card">
          <h3>Total Attendees</h3>
          <p className="stat-number">{eventStats.totalAttendees}</p>
        </div>
        <div className="stat-card">
          <h3>Attendance Rate</h3>
          <p className="stat-number">
            {((eventStats.totalAttendees / eventStats.totalTickets) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Ticket Types Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={ticketTypeData} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Participant Feedback</h3>
          <div className="chart-wrapper">
            <Bar
              data={feedbackData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="feedback-list">
        <h3>Recent Feedback</h3>
        <div className="feedback-grid">
          {eventStats.feedback.slice(0, 5).map((feedback) => (
            <div key={feedback.attendee} className="feedback-card">
              <p className="rating">{feedback.rating.toUpperCase()}</p>
              <p className="comment">{feedback.comment}</p>
              <p className="author">- {feedback.attendee}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';

 function HealthcareManagementPortal() {
  const [patientName, setPatientName] = useState('');
  const [password, setPassword] = useState(''); // Added for JWT
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Load data and check session on startup
  useEffect(() => {
    fetch('http://localhost:8000/appointments/doctors/')
      .then(res => res.json())
      .then(data => setDoctors(data));
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      fetchAppointments();
      // In a real app, you'd fetch the user profile here
    }
  }, []);

  const fetchAppointments = () => {
    const token = localStorage.getItem('accessToken');
    fetch('http://localhost:8000/appointments/book/', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAppointments(data);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Senior Implementation: Requesting JWT tokens from the backend
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: patientName, password: password }), 
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        
        setIsLoggedIn(true);
        setCurrentPatient({ name: patientName });
        setPatientName(''); // CLEAR DETAILS: Prepares login for next session
        setPassword('');
        setMessage({ text: 'Logged in successfully!', type: 'success' });
        fetchAppointments();
      } else {
        setMessage({ text: 'Invalid username or password.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Authentication server unreachable.', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setCurrentPatient(null);
    setAppointments([]);
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8000/appointments/book/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        patient_name: currentPatient.name, 
        doctor: selectedDoctor,
        appointment_date: appointmentDate 
      }),
    });

    if (response.ok) {
      setMessage({ text: 'Appointment Scheduled!', type: 'success' });
      setAppointmentDate('');
      fetchAppointments();
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/appointments/book/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ text: 'Appointment successfully cancelled.', type: 'success' });
        setAppointments(appointments.filter(app => app.id !== id));
      } else {
        setMessage({ text: 'Failed to cancel. Check permissions.', type: 'error' });
      }
    }
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80")', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      {!isLoggedIn ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '400px', textAlign: 'center' }}>
          <h2>{isRegistering ? 'Register' : 'Healthcare Management Portal'}</h2>
          {message.text && <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>{message.text}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Username" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={{ padding: '10px' }} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} required />
            <button type="submit" style={{ backgroundColor: '#003366', color: 'white', padding: '12px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>
              {isRegistering ? 'REGISTER' : 'SIGN IN'}
            </button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#003366', cursor: 'pointer' }}>
            {isRegistering ? 'Back to Login' : 'Create Account'}
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '90%', maxWidth: '1000px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2>Welcome! <button onClick={handleLogout} style={{ float: 'right', padding: '5px 10px', cursor: 'pointer' }}>Logout</button></h2>
          
          {message.text && <p style={{ color: message.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>{message.text}</p>}

          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', marginBottom: '20px', borderRadius: '4px' }}>
            <h3>Schedule New Appointment</h3>
            <form onSubmit={bookAppointment} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} style={{ flex: '1', padding: '10px' }} required>
                <option value="">Select Doctor</option>
                {doctors.map(doc => <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>)}
              </select>
              <input type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={{ flex: '1', padding: '10px' }} required />
              <button type="submit" style={{ backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Confirm Booking</button>
            </form>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Your Scheduled Appointments</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#eee' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Doctor Name</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Date & Time</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
                  .map((app, index) => {
                    const doctor = doctors.find(d => d.id === parseInt(app.doctor));
                    return (
                      <tr key={index}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{doctor ? `Dr. ${doctor.name}` : `ID: ${app.doctor}`}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(app.appointment_date).toLocaleString()}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <button onClick={() => cancelAppointment(app.id)} style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Cancel</button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthcareManagementPortal;
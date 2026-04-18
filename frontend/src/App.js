import React, { useState, useEffect } from 'react';

function HospitalPortal() {
  const [patientName, setPatientName] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(''); // New State for Date
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/appointments/doctors/')
      .then(res => res.json())
      .then(data => setDoctors(data));
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    fetch('http://localhost:8000/appointments/book/')
      .then(res => res.json())
      .then(data => setAppointments(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/appointments/patients/');
    const patients = await res.json();
    const existing = patients.find(p => p.name.trim().toLowerCase() === patientName.trim().toLowerCase());

    if (!existing) {
      setMessage({ text: 'User not found. Please register.', type: 'error' });
      return;
    }
    setIsLoggedIn(true);
    setCurrentPatient(existing);
    setPatientName('');
  };

  /* --- FIXED REGISTRATION LOGIC --- */
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/appointments/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patientName }), // Ensure this matches your Django model field
      });

      if (response.ok) {
        setMessage({ text: 'Success! You can now Sign In.', type: 'success' });
        setIsRegistering(false);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Registration failed: ${JSON.stringify(errorData)}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Backend unreachable. Check Docker.', type: 'error' });
    }
  };

  /* --- UPDATED BOOKING WITH DATE/TIME --- */
  const bookAppointment = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/appointments/book/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        patient_name: currentPatient.name, 
        doctor: selectedDoctor,
        appointment_date: appointmentDate // Sending the picked date
      }),
    });

    if (response.ok) {
      setMessage({ text: 'Appointment Scheduled!', type: 'success' });
      setAppointmentDate('');
      fetchAppointments();
    }
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80")', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      {!isLoggedIn ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '400px', textAlign: 'center' }}>
          <h2>{isRegistering ? 'New Patient' : 'Health Care Portal'}</h2>
          {message.text && <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>{message.text}</p>}
          <form onSubmit={isRegistering ? handleSignUp : handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Full Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={{ padding: '10px' }} required />
            <button type="submit" style={{ backgroundColor: '#003366', color: 'white', padding: '12px', cursor: 'pointer' }}>{isRegistering ? 'REGISTER' : 'SIGN IN'}</button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#003366', cursor: 'pointer' }}>{isRegistering ? 'Back to Login' : 'Create Account'}</button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', width: '90%', maxWidth: '900px' }}>
          <h2>Welcome, {currentPatient?.name} <button onClick={() => setIsLoggedIn(false)} style={{ float: 'right' }}>Logout</button></h2>
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', marginBottom: '20px' }}>
            <h3>Schedule New Appointment</h3>
            <form onSubmit={bookAppointment} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} style={{ flex: '1', padding: '10px' }} required>
                <option value="">Select Doctor</option>
                {doctors.map(doc => <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>)}
              </select>
              {/* DATE TIME PICKER */}
              <input type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={{ flex: '1', padding: '10px' }} required />
              <button type="submit" style={{ backgroundColor: '#003366', color: 'white', padding: '10px 20px' }}>Confirm</button>
            </form>
          </div>
          {/* Table remains the same but displays the chosen date */}
        </div>
      )}
    </div>
  );
}

export default HospitalPortal;
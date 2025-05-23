import React, { useState, useEffect } from "react";
import { MdSettings, MdClose } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/doctor.webp";
import axios from "axios";

function Doctorpage() {
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [error, setError] = useState(null);
  const [existingMedicalRecord, setExistingMedicalRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.username) {
          setError("No user data found. Please log in again.");
          setLoading(false);
          return;
        }

        const username = user.username;

        const doctorResponse = await axios.get(`http://localhost:5000/api/doctor/${username}`);
        setDoctorDetails(doctorResponse.data);

        const appointmentsResponse = await axios.get(`http://localhost:5000/api/doctor/${doctorResponse.data._id}/appointments/today`);
        setAppointments(appointmentsResponse.data);

        const patientsResponse = await axios.get(`http://localhost:5000/api/doctor/${doctorResponse.data._id}/patients`);
        setPatients(patientsResponse.data);
      } catch (error) {
        setError(`Error loading data: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const fetchExistingMedicalRecord = async (patientName) => {
    try {
      const patientResponse = await axios.get(`http://localhost:5000/api/patient/by-name/${patientName}`);
      if (patientResponse.data && patientResponse.data._id) {
        const medicalRecordResponse = await axios.get(
          `http://localhost:5000/api/medical-record/${patientResponse.data._id}/${doctorDetails._id}`
        );
        if (medicalRecordResponse.data) {
          setExistingMedicalRecord(medicalRecordResponse.data);
          setDescription(medicalRecordResponse.data.description || "");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching existing medical record:", error);
      return false;
    }
  };

  const handleMedicalRecordSubmit = async () => {
    if (!selectedPatient) return;

    try {
      const patientResponse = await axios.get(`http://localhost:5000/api/patient/by-name/${selectedPatient.name}`);
      if (!patientResponse.data) {
        alert("Patient not found.");
        return;
      }

      const patientId = patientResponse.data._id;
      const doctorId = doctorDetails._id;

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('patientId', patientId);
      formData.append('doctorId', doctorId);
      formData.append('description', description);

      if (existingMedicalRecord) {
        formData.append('recordId', existingMedicalRecord._id);
        await axios.put('http://localhost:5000/api/update-medical-record', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert("Medical record updated successfully");
      } else {
        await axios.post('http://localhost:5000/api/create-medical-record', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert("Medical record created successfully");
      }

      setShowModal(false);
      setSelectedFile(null);
      setDescription("");
      setExistingMedicalRecord(null);
    } catch (error) {
      alert(`Failed to ${existingMedicalRecord ? 'update' : 'create'} medical record: ${error.message}`);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedPatient || !selectedPatient.appointmentId) return;
    try {
      await axios.post('http://localhost:5000/admin/update-appointment-status', {
        appointmentId: selectedPatient.appointmentId,
        status
      });
      setAppointmentStatus(status);
      if (status !== 'scheduled') {
        const updatedAppointments = await axios.get(`http://localhost:5000/api/doctor/${doctorDetails._id}/appointments/today`);
        setAppointments(updatedAppointments.data);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setAppointmentStatus(patient.status || "scheduled");

    const hasExistingRecord = await fetchExistingMedicalRecord(patient.name);

    if (!hasExistingRecord) {
      setDescription("");
      setSelectedFile(null);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setSelectedFile(null);
    setDescription("");
    setExistingMedicalRecord(null);
    setAppointmentStatus("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = '/';
  };

  const handleViewAllMedicalRecords = async (appointment) => {
    try {
      const patientResponse = await axios.get(`http://localhost:5000/api/patient/by-name/${appointment.name}`);
      if (!patientResponse.data) {
        alert("Patient not found.");
        return;
      }

      const patientId = patientResponse.data._id;
      const medicalRecordsResponse = await axios.get(`http://localhost:5000/api/patient/${patientId}/all-medical-records`);
      if (medicalRecordsResponse.data && medicalRecordsResponse.data.length > 0) {
        setSelectedPatient({ ...appointment, medicalRecords: medicalRecordsResponse.data });
        setShowModal(true);
      } else {
        alert("No medical records found for this patient.");
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      alert("Failed to fetch medical records. Please try again.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#fff] border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <div className="text-2xl font-bold leading-none text-gray-800">
            CHIKITSA
          </div>
        </div>

        <div className="flex gap-6 text-gray-700 font-semibold text-lg">
          <button
            className={`hover:text-black pb-1 ${selectedTab === "schedule" ? "border-b-2 border-black" : ""}`}
            onClick={() => setSelectedTab("schedule")}
          >
            Schedule
          </button>
          <button
            class={`hover:text-black pb-1 ${selectedTab === "patientList" ? "border-b-2 border-black" : ""}`}
            onClick={() => setSelectedTab("patientList")}
          >
            Patient List
          </button>
        </div>

        <div className="flex items-center gap-4">
  <button 
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
  >
    <MdLogout className="text-xl" />
    <span>Logout</span>
  </button>
</div>

      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="bg-[#fff] text-gray-200 w-full md:w-[22%] flex flex-col items-center py-8 gap-6 shadow-inner border-r-2 border-[#ccc]">
          <img
            src={patientai}
            alt="Doctor avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md"
          />
          {loading ? (
            <div className="text-gray-800">Loading doctor details...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="border-2 border-gray-300 rounded-xl p-6 bg-[#f4f4f4] shadow-lg w-[90%] flex flex-col gap-4 text-gray-800 text-lg leading-relaxed font-poppins ">
              <p className="text-lg font-semibold">
                <strong>Name:</strong> {doctorDetails.name || "Dr. Raj Chopra"}
              </p>
              <p className="text-lg font-semibold">
                <strong>Gender:</strong> {doctorDetails.gender || "Male"}
              </p>
              <p className="text-lg font-semibold">
                <strong>Age:</strong> {doctorDetails.age || "32"}
              </p>
              <p className="text-lg font-semibold">
                <strong>Blood Group:</strong> {doctorDetails.blood_group || "O+"}
              </p>
              <p className="text-lg font-semibold">
                <strong>Contact:</strong> {doctorDetails.contact_info || "9xxxx 9xxxx"}
              </p>
              {doctorDetails.doctor_id && (
                <p className="text-lg font-semibold">
                  <strong>Doctor ID:</strong> {doctorDetails.doctor_id}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#f5f5f5] p-6 flex flex-col items-center">
          {loading ? (
            <p className="text-lg text-gray-700">Loading data...</p>
          ) : error ? (
            <p className="text-lg text-red-600">{error}</p>
          ) : selectedTab === "schedule" ? (
            <>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Today's Schedule</h2>
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-4 overflow-y-auto h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {appointments.length === 0 ? (
                  <p className="text-center text-gray-600 mt-10">No appointments scheduled for today.</p>
                ) : (
                  // In the appointments.map section of Doctorpage.jsx
                  // In the appointments map:
                  appointments.map((appointment, idx) => (
  <button
    key={idx}
    className="relative border border-gray-300 rounded-xl p-4 mb-6 shadow-md bg-white hover:bg-gray-200 text-left w-full"
    onClick={() => handlePatientClick(appointment)}
  >
    {/* Name and Reason */}
    <div className="mb-4">
      <p className="text-lg font-semibold text-gray-800">
        Name: {appointment.name}
      </p>
      <p className="text-gray-700 mt-1">
        <strong>Reason:</strong> {appointment.reason}
      </p>
    </div>

    {/* Date, Time, and Medical Records Button */}
    <div className="absolute top-4 right-4 text-right">
      <p className="text-gray-700">
        <strong>Date:</strong> {appointment.date}
      </p>
      <p className="text-gray-700">
        <strong>Time:</strong> {appointment.time}
      </p>
      <button
        className="text-blue-600 underline hover:text-blue-800 transition mt-2"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent button's onClick
          handleViewAllMedicalRecords(appointment);
        }}
      >
        View All Medical Records
      </button>
    </div>
  </button>
))
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Patient List</h2>
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-4 overflow-y-auto h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {patients.length === 0 ? (
                  <p className="text-center text-gray-600 mt-10">No patients assigned yet.</p>
                ) : (
                  patients.map((patient, idx) => (
                    <button
                      key={idx}
                      className="border border-gray-300 rounded-xl p-4 mb-4 shadow-md bg-white hover:bg-gray-200 text-left w-full"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <p className="text-lg font-semibold text-gray-800">Name: {patient.name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-gray-700"><strong>Age:</strong> {patient.age}</p>
                          <p className="text-gray-700"><strong>Contact:</strong> {patient.contact}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
          <footer className="text-sm text-gray-500 mt-6">© 2025 Chikitsa. All rights reserved.</footer>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPatient && (
  <div className="fixed inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-150 h-150 p-6 relative max-w-4xl max-h-[90vh] overflow-y-auto">
      <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <MdClose className="text-2xl" />
      </button>

      {/* Patient Details */}
      <h2 className="text-2xl font-bold text-black mb-4">Patient Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6 relative">
        <p className="text-xl font-semibold text-gray-800">{selectedPatient.name}</p>
        <p className="text-gray-700 mt-1"><strong>Reason:</strong> {selectedPatient.reason || "General Consultation"}</p>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            {selectedPatient.age && <p className="text-gray-700"><strong>Age:</strong> {selectedPatient.age}</p>}
            {selectedPatient.contact && <p className="text-gray-700"><strong>Contact:</strong> {selectedPatient.contact}</p>}
          </div>
        </div>
        <div className="absolute top-4 right-4 text-gray-700">
          <p><strong>Date:</strong> {selectedPatient.date || "Not specified"}</p>
          <p><strong>Time:</strong> {selectedPatient.time || "Not specified"}</p>
        </div>
      </div>

      {/* Medical Records Section */}
      {selectedPatient.medicalRecords && (
        <>
          <h2 className="text-2xl font-bold text-black mt-8">Medical Records</h2>
          <div className="mt-4 space-y-4">
            {selectedPatient.medicalRecords.map((record, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <p className="text-lg font-semibold text-gray-800">{record.description}</p>
                <p className="text-gray-700 mt-1"><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                {record.pdf && (
                  <a
                    href={`http://localhost:5000/api/view-file/${record._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    View Document
                  </a>
                )}

                {existingMedicalRecord && existingMedicalRecord.pdf && (
                  <div className="mt-4">
                    <a 
                      href={`http://localhost:5000/api/view-file/${existingMedicalRecord._id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Existing Document
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

            {/* Status */}
            <h2 className="text-2xl font-bold text-black mt-4">Status of the Appointment</h2>
            <div className="flex justify-between mt-4">
              <button
                className={`w-60 p-4 border-2 ${appointmentStatus === 'completed' ? 'border-green-500 bg-green-100' : 'border-gray-300'} rounded-lg`}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </button>
              <button
                className={`w-60 p-4 border-2 ${appointmentStatus === 'cancelled' ? 'border-red-500 bg-red-100' : 'border-gray-300'} rounded-lg`}
                onClick={() => handleStatusChange('cancelled')}
              >
                Cancelled
              </button>
            </div>

            {/* Medical Record Description */}
            <h2 className="text-2xl font-bold text-black mt-8">
              {existingMedicalRecord ? 'Update Medical Record' : 'Create Medical Record'}
            </h2>
            <textarea
              className="mt-4 p-4 border-2 border-gray-300 rounded-lg h-32 resize-none w-full"
              placeholder="Enter medical records description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Upload PDF */}
            <h2 className="text-2xl font-bold text-black mt-8">Report Link</h2>
            <div className="mt-4">
              <label className="text-lg font-semibold text-gray-700">Upload PDF:</label>
              <div className="mt-2 flex items-center gap-4">
                <input type="file" id="files" accept=".pdf" className="hidden" onChange={handleFileChange} />
                <label htmlFor="files" className="p-4 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-black">
                  {selectedFile ? selectedFile.name : "Select File"}
                </label>
                <button 
                  onClick={handleMedicalRecordSubmit} 
                  className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {existingMedicalRecord ? 'Update Record' : 'Create Record'}
                </button>
              </div>
              {existingMedicalRecord && existingMedicalRecord.pdf && (
  <div className="mt-4">
          <a 
            href={`http://localhost:5000/${existingMedicalRecord.pdf}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Existing Document
          </a>
  </div>
)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Doctorpage;
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from "../Components"

const Applied = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://ftfl-backend.vercel.app/api/jobs/all-jobs')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data);
                setJobs(Array.isArray(data.jobs) ? data.jobs : []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
                setLoading(false);
            });
    }, []);

    const handleJobChange = (event) => {
        const jobId = event.target.value;
        const job = jobs.find(j => j._id === jobId);
        setSelectedJob(job);
        setApplications(job ? job.applications : []);
    };

    // ✅ Handle Application Deletion
    const handleDeleteApplication = (jobId, appId) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
    
        fetch(`https://ftfl-backend.vercel.app/api/jobs/delete-application/${jobId}/${appId}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Application deleted successfully!");
                    setApplications(prevApplications => prevApplications.filter(app => app._id !== appId));
                } else {
                    alert("Error deleting application: " + data.error);
                }
            })
            .catch(error => {
                console.error("Error deleting application:", error);
                alert("Failed to delete application. Please check the console for details.");
            });
    };
    return (
        <div className="container mt-4">
            <Header category="" title="Applied Candidates" />
            <h2 className="text-center mb-4"></h2>


            {/* Job Dropdown */}
            <div className="mb-3">
                {/* <label className="form-label"><strong>Select a Job:</strong></label> */}
                <select onChange={handleJobChange} className="form-select">
                    <option value="">Select a job</option>
                    {loading ? (
                        <option disabled>Loading jobs...</option>
                    ) : jobs.length > 0 ? (
                        jobs.map(job => (
                            <option key={job._id} value={job._id}>
                                {job.jobTitle}
                            </option>
                        ))
                    ) : (
                        <option disabled>No jobs available</option>
                    )}
                </select>
            </div>

            {/* Display Selected Job Applications */}
            {selectedJob && (
                <div className="mt-4">
                    <h3 className="text-primary">{selectedJob.jobTitle} - Applications</h3>
                    <div className="row">
                        {applications.length > 0 ? (
                            applications.map(app => (
                                <div key={app._id} className="col-md-6 col-lg-4">
                                    <div className="card shadow-sm p-3 mb-4">
                                        <div className="card-body">
                                            <h5 className="card-title text-dark">{app.fullName}</h5>
                                            <p className="card-text"><strong>Email:</strong> {app.email}</p>
                                            <p className="card-text"><strong>Phone:</strong> {app.mobileNumber}</p>
                                            <p className="card-text"><strong>Location:</strong> {app.jobLocation}</p>
                                            <p className="card-text"><strong>Workplace Type:</strong> {app.workplaceType}</p>
                                            <p className="card-text"><strong>Employment Type:</strong> {app.employmentType}</p>
                                            <p className="card-text"><strong>Background:</strong> {app.backgroundDescription}</p>
                                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm me-2">
                                                View Resume
                                            </a>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDeleteApplication(selectedJob._id, app._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-warning">No applications found for this job.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applied;
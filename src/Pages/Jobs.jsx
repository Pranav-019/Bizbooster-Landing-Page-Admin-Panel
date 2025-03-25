import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Header } from "../Components"

const Jobs = () => {
  // State variables for form fields
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [mustHave, setMustHave] = useState('');
  const [niceToHave, setNiceToHave] = useState('');
  const [workEnvironment, setWorkEnvironment] = useState('Office');
  const [experience, setExperience] = useState('');
  const [benefits, setBenefits] = useState('');
  const [applyDeadline, setApplyDeadline] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [qualification, setQualification] = useState('');
  const [jobDepartment, setJobDepartment] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [openingType, setOpeningType] = useState('Regular'); // Consistent spelling of "Regular"
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Prepare job data for submission
    const jobData = {
      jobTitle,
      jobDescription,
      requirements: {
        mustHave: mustHave.split(';').map(item => item.trim()), // Convert semicolon-separated string to array
        niceToHave: niceToHave.split(';').map(item => item.trim()), // Convert semicolon-separated string to array
      },
      workEnvironment: workEnvironment.split(';').map(item => item.trim()), // Convert semicolon-separated string to array
      experience,
      benefits: benefits.split(';').map(item => item.trim()), // Convert semicolon-separated string to array
      applyDeadline,
      jobType,
      salary,
      qualification,
      jobDepartment,
      jobLocation,
      openingType,
    };
  
    // Debugging: Log the job data before submission
    console.log('Submitting job data:', jobData);
  
    try {
      // Send POST request to the backend
      const response = await axios.post('http://localhost:5000/api/jobs/post-job', jobData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log success and show alert
      console.log('Job posted successfully:', response.data);
      alert('Job posted successfully!');
  
      // Reset form fields after successful submission
      setJobTitle('');
      setJobDescription('');
      setMustHave('');
      setNiceToHave('');
      setWorkEnvironment('Office');
      setExperience('');
      setBenefits('');
      setApplyDeadline('');
      setJobType('Full-time');
      setSalary('');
      setQualification('');
      setJobDepartment('');
      setJobLocation('');
      setOpeningType('Regular');
    } catch (error) {
      // Log and display errors
      console.error('Error posting job:', error.response ? error.response.data : error.message);
      alert(`Failed to post job. ${error.response ? error.response.data.message : 'Please try again.'}`);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  return (
    <div className="container mt-5">
      <Header category="" title="Create A Job Posting"/>
      <h2 className="text-center mb-4"></h2>
      <div className="card p-4 shadow">
        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className="form-control"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          {/* Job Description */}
          <div className="mb-3">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Must-Have Requirements */}
          <div className="mb-3">
            <label className="form-label">Must-Have Requirements (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={mustHave}
              onChange={(e) => setMustHave(e.target.value)}
            />
          </div>

          {/* Nice-to-Have Requirements */}
          <div className="mb-3">
            <label className="form-label">Nice-to-Have Requirements (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={niceToHave}
              onChange={(e) => setNiceToHave(e.target.value)}
            />
          </div>

          {/* Work Environment */}
          <div className="mb-3">
            <label className="form-label">Work Environment (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={workEnvironment}
              onChange={(e) => setWorkEnvironment(e.target.value)}
              required
            />
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">Experience</label>
            <input
              type="text"
              className="form-control"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </div>

          {/* Benefits */}
          <div className="mb-3">
            <label className="form-label">Benefits (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          {/* Application Deadline */}
          <div className="mb-3">
            <label className="form-label">Application Deadline</label>
            <input
              type="date"
              className="form-control"
              value={applyDeadline}
              onChange={(e) => setApplyDeadline(e.target.value)}
              required
            />
          </div>

          {/* Job Type */}
          <div className="mb-3">
            <label className="form-label">Job Type</label>
            <select
              className="form-select"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Salary */}
          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              type="text"
              className="form-control"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>

          {/* Qualification */}
          <div className="mb-3">
            <label className="form-label">Qualification</label>
            <input
              type="text"
              className="form-control"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
          </div>

          {/* Department */}
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              value={jobDepartment}
              onChange={(e) => setJobDepartment(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              required
            />
          </div>

          {/* Opening Type */}
          <div className="mb-3">
            <label className="form-label">Opening Type</label>
            <select
              className="form-select"
              value={openingType}
              onChange={(e) => setOpeningType(e.target.value)}
              required
            >
              <option value="Regular">Regular</option> {/* Consistent spelling of "Regular" */}
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Posting Job...</span>
              </>
            ) : (
              'Create Job'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Jobs;
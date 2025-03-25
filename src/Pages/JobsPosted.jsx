import React, { useEffect, useState } from 'react';
import { Spinner, Button, Card, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { Header } from "../Components"

const JobsPosted = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editableJob, setEditableJob] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://ftfl-backend.vercel.app/api/jobs/all-jobs/');
        const data = await response.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          console.error('Unexpected API response format:', data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    setDeletingJobId(jobId);
    try {
      const response = await fetch(`https://ftfl-backend.vercel.app/api/jobs/delete-job/${jobId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
      } else {
        alert('Failed to delete the job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleEditJob = (job) => {
    setEditableJob(job);
    setEditingJobId(job._id);
    setShowEditModal(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://ftfl-backend.vercel.app/api/jobs/update-job/${editingJobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableJob),
      });
      if (response.ok) {
        const updatedJobs = jobs.map(job => job._id === editingJobId ? { ...job, ...editableJob } : job);
        setJobs(updatedJobs);
        setShowEditModal(false);
      } else {
        alert('Failed to update the job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableJob(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNestedChange = (parentKey, childKey, value) => {
    setEditableJob(prevState => ({
      ...prevState,
      [parentKey]: {
        ...prevState[parentKey],
        [childKey]: value,
      },
    }));
  };

  const renderEditableField = (key, value, parentKey = '') => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={key}>
          <strong>{key}:</strong>
          {Object.keys(value).map((childKey) => (
            <div key={childKey} style={{ marginLeft: '20px' }}>
              {renderEditableField(childKey, value[childKey], key)}
            </div>
          ))}
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <Form.Group className="mb-3" key={key}>
          <Form.Label>{key}</Form.Label>
          {value.map((item, index) => (
            <Form.Control
              key={index}
              type="text"
              value={item}
              onChange={(e) => {
                const newArray = [...value];
                newArray[index] = e.target.value;
                handleNestedChange(parentKey, key, newArray);
              }}
            />
          ))}
        </Form.Group>
      );
    } else {
      return (
        <Form.Group className="mb-3" key={key}>
          <Form.Label>{key}</Form.Label>
          <Form.Control
            type="text"
            name={fullKey}
            value={value}
            onChange={(e) => {
              if (parentKey) {
                handleNestedChange(parentKey, key, e.target.value);
              } else {
                handleChange(e);
              }
            }}
          />
        </Form.Group>
      );
    }
  };

  return (
    <Container className="my-4">
          <Header category="" title="Posted Jobs"/>
      <h1 className="text-center mb-4"></h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <Col key={job._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{job.jobTitle || 'No Job Name'}</Card.Title>
                    <Card.Text>{job.jobLocation || 'No Location'}</Card.Text>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDeleteJob(job._id)}
                      disabled={deletingJobId === job._id}
                      className="me-2"
                    >
                      {deletingJobId === job._id ? <Spinner as="span" animation="border" size="sm" /> : 'Delete Job'}
                    </Button>
                    <Button variant="primary" onClick={() => handleEditJob(job)}>Edit Job</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No jobs found or data is invalid.</p>
          )}
        </Row>
      )}

      {/* Edit Job Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateJob}>
            {Object.keys(editableJob).map((key) => {
              if (key === '_id' || key === '__v') return null; // Skip internal fields
              return renderEditableField(key, editableJob[key]);
            })}
            <Button variant="success" type="submit">Update</Button>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} className="ms-2">Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default JobsPosted;
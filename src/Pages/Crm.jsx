import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Form,
  Card,
  ButtonGroup,
} from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import { Header } from "../Components";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Crm.css";

const Crm = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpComment, setFollowUpComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTab, setShowTab] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [meetingRoom, setMeetingRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("https://ftfl-backend.vercel.app/api/contact/");
        if (!response.ok) throw new Error("Failed to fetch leads");
        const data = await response.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const applyFilter = (filterType) => {
    let filtered = [...leads];
    const now = new Date();

    switch (filterType) {
      case "today":
        filtered = filtered.filter(
          (lead) => new Date(lead.createdAt).toDateString() === now.toDateString()
        );
        break;
      case "thisWeek":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter(
          (lead) => new Date(lead.createdAt) >= startOfWeek
        );
        break;
      case "thisMonth":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(
          (lead) => new Date(lead.createdAt) >= startOfMonth
        );
        break;
      case "customDate":
        if (startDate && endDate) {
          filtered = filtered.filter((lead) => {
            const leadDate = new Date(lead.createdAt);
            return (
              leadDate >= new Date(startDate) && leadDate <= new Date(endDate)
            );
          });
        }
        break;
      case "all":
        filtered = leads;
        break;
      default:
        break;
    }

    setFilteredLeads(filtered);
  };

  const handleTabToggle = (lead) => {
    setSelectedLead(lead);
    setFollowUpComment("");
    setShowTab(!showTab);
    setUpdateSuccess(false);
  };

  const handleFollowUpChange = async () => {
    if (!selectedLead) return alert("Please select a lead.");
    const newFollowUp = followUpComment;

    try {
      const response = await fetch(`https://ftfl-backend.vercel.app/api/contact/${selectedLead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followUp: newFollowUp }),
      });

      if (!response.ok) {
        throw new Error("Failed to update follow-up");
      }

      const updatedLead = {
        ...selectedLead,
        followUp: [...(selectedLead.followUp || []), newFollowUp],
      };

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === selectedLead._id ? updatedLead : lead
        )
      );

      setSelectedLead(updatedLead);
      setFollowUpComment("");
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating follow-up:", error);
    }
  };

  const handleStartMeeting = () => {
    if (meetingRoom && userName) {
      const url = `https://meet.jit.si/${meetingRoom}`;
      const meetingWindow = window.open(url, "_blank");

      meetingWindow?.addEventListener("load", () => {
        meetingWindow.document.documentElement.requestFullscreen();
      });

      setIsMeetingStarted(true);
    } else {
      alert("Please provide a meeting room name and your name.");
    }
  };

  const renderMobileCard = (lead) => (
    <div className="mobile-lead-card mb-3 p-3 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 className="mb-1">{`${lead.firstName} ${lead.lastName}`}</h6>
          <p className="mb-1 text-muted small">{lead.phone}</p>
        </div>
        <Button
          variant="link"
          className="p-0"
          onClick={() => handleTabToggle(lead)}
        >
          <FaPen size={20} />
        </Button>
      </div>
      
      <div className="mobile-lead-details">
        <p className="mb-1 small"><strong>Message:</strong> {lead.message}</p>
        <p className="mb-0 small"><strong>Email:</strong> {lead.email}</p>
      </div>
    </div>
  );

  return (
    <Container fluid className="crm-container p-2 p-md-4">
      <Row>
        <Col>
          <Header category="" title="CRM" />

          <Card className="mb-4">
            <Card.Body className="p-2 p-md-4">
              <div className="filter-section mb-4">
                <ButtonGroup className="d-flex flex-wrap gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("today")}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("thisWeek")}
                  >
                    This Week
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("thisMonth")}
                  >
                    This Month
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1 mb-2 mb-md-0"
                    onClick={() => applyFilter("all")}
                  >
                    All
                  </Button>
                </ButtonGroup>
              </div>

              <h5 className="mb-3">Leads List</h5>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <div className="d-block d-md-none">
                    {filteredLeads.map((lead) => renderMobileCard(lead))}
                  </div>

                  <div className="d-none d-md-block table-responsive">
                    <Table striped bordered hover className="lead-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Message</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead._id}>
                            <td>{`${lead.firstName} ${lead.lastName}`}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.message}</td>
                            <td>
                              <Button
                                variant="link"
                                className="p-0"
                                onClick={() => handleTabToggle(lead)}
                              >
                                <FaPen size={20} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {showTab && selectedLead && (
            <div className="lead-tab">
              <Card className="mb-4">
                <Card.Body className="p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                    <h4 className="mb-3 mb-md-0">Lead Details</h4>
                    <Button
                      variant="secondary"
                      onClick={() => setShowTab(false)}
                      className="mb-3 mb-md-0"
                    >
                      Close Tab
                    </Button>
                  </div>

                  <div className="lead-details-grid">
                    <div className="detail-item">
                      <strong>Name:</strong>
                      <p>{`${selectedLead.firstName} ${selectedLead.lastName}`}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Email:</strong>
                      <p>{selectedLead.email}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Phone:</strong>
                      <p>{selectedLead.phone}</p>
                    </div>
                    <div className="detail-item">
                      <strong>Message:</strong>
                      <p>{selectedLead.message}</p>
                    </div>
                  </div>

                  {/* <div className="follow-up-section mt-4">
                    <h5>Follow Up Comments</h5>
                    <div className="follow-up-comments mb-3">
                      {selectedLead.followUp?.map((comment, index) => (
                        <div key={index} className="follow-up-comment p-2 mb-2 bg-light rounded">
                          {index + 1}. {comment}
                        </div>
                      ))}
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={followUpComment}
                      onChange={(e) => setFollowUpComment(e.target.value)}
                      placeholder="Add new follow-up comment..."
                      className="mb-2"
                    />
                    <Button
                      variant="primary"
                      onClick={handleFollowUpChange}
                      disabled={!followUpComment}
                    >
                      Add Follow Up
                    </Button>
                    {updateSuccess && (
                      <p className="text-success mt-2">
                        Follow-up comment added successfully!
                      </p>
                    )}
                  </div> */}

                  <div className="meeting-section mt-4">
                    <h5>Start Online Meeting</h5>
                    <div className="meeting-form-grid">
                      <Form.Group>
                        <Form.Label>Meeting Room Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter meeting room name"
                          value={meetingRoom}
                          onChange={(e) => setMeetingRoom(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <Button
                      variant="success"
                      onClick={handleStartMeeting}
                      className="mt-3"
                    >
                      Start Meeting
                    </Button>
                    {isMeetingStarted && (
                      <p className="text-success mt-2">
                        Meeting started successfully!
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Crm;
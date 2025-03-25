import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, Container, Row, Col, Alert, Spinner, Carousel } from 'react-bootstrap';

const Design = () => {
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  // Fetch designs on load
  useEffect(() => {
    setLoading(true); // Start loading
    axios.get('https://Artisticify-backend.vercel.app/api/design/get')
      .then((response) => {
        setDesigns(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => {
        setError('Failed to fetch designs.');
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleAddDesign = async () => {
    const formData = new FormData();
    formData.append('category', category);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    setLoading(true); // Start loading when submitting
    try {
      const response = await axios.post('https://Artisticify-backend.vercel.app/api/design/insert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Design added successfully!');
      setCategory('');
      setSelectedFiles([]);
      setDesigns((prevDesigns) => [...prevDesigns, response.data.design]);
      setLoading(false); // Stop loading
    } catch (err) {
      setError('Failed to add design.');
      setLoading(false);
    }
  };

  const handleDeleteDesign = async (id) => {
    setLoading(true); // Start loading while deleting
    try {
      await axios.delete(`https://Artisticify-backend.vercel.app/api/design/delete/${id}`);
      setMessage('Design deleted successfully!');
      setDesigns(designs.filter((design) => design._id !== id));
      setLoading(false); // Stop loading
    } catch (err) {
      setError('Failed to delete design.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Design Management</h2>

      {/* Alert Messages */}
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Loader */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Form to Add Design */}
      <Row className="mb-4">
        <Col md={6}>
          <Form>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddDesign}>Add Design</Button>
          </Form>
        </Col>
      </Row>

      {/* Display All Designs */}
      <Row>
        {designs.map((design) => (
          <Col md={4} key={design._id} className="mb-4">
            <Card>
              {/* Carousel for multiple images */}
              <Card.Body>
                <Card.Title>{design.category}</Card.Title>
                {design.images.length > 1 ? (
                  <Carousel>
                    {design.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img className="d-block w-100" src={image} alt={`design-image-${index}`} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <Card.Img variant="top" src={design.images[0]} />
                )}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteDesign(design._id)}
                  className="mt-3"
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Design;
